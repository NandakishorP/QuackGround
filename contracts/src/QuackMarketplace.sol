// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract QuackMarketplace is ReentrancyGuard {
    // Errors
    error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
    error NotListed(address nftAddress, uint256 tokenId);
    error AlreadyListed(address nftAddress, uint256 tokenId);
    error NoProceeds();
    error NotOwner();
    error NotApprovedForMarketplace();
    error PriceMustBeAboveZero();
    error InvalidQuantity();
    error NotAIAgent();
    error InsufficientAllowanceOrBalance();

    struct Listing {
        uint256 pricePerUnit;
        address seller;
        uint256 quantity;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 pricePerUnit,
        uint256 quantity
    );
    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );
    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 quantity,
        uint256 totalPrice
    );
    event TrendScoreUpdated(uint256 indexed tokenId, uint256 score);
    event AIAgentRegistered(address indexed agent, bool allowed);
    event MarketplaceParamsUpdated(uint256 feeBps, address daoTreasury);

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;

    IERC20 public immutable duckToken;

    uint256 public marketplaceFeeBps;

    address public daoTreasury;

    mapping(address => bool) public aiAgents;

    mapping(uint256 => uint256) public trendScore;

    constructor(address _duckToken, address _daoTreasury, uint256 _feeBps) {
        require(_duckToken != address(0), "DUCK token address zero");
        require(_daoTreasury != address(0), "DAO treasury zero");
        duckToken = IERC20(_duckToken);
        daoTreasury = _daoTreasury;
        marketplaceFeeBps = _feeBps;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.quantity == 0 || listing.pricePerUnit == 0) {
            revert NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier notListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.quantity > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    function setMarketplaceParams(
        address _daoTreasury,
        uint256 _feeBps
    ) external {
        require(_daoTreasury != address(0), "zero dao");
        require(_feeBps <= 1000, "fee too high");
        daoTreasury = _daoTreasury;
        marketplaceFeeBps = _feeBps;
        emit MarketplaceParamsUpdated(_feeBps, _daoTreasury);
    }

    function registerAIAgent(address agent, bool allowed) external {
        aiAgents[agent] = allowed;
        emit AIAgentRegistered(agent, allowed);
    }

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 pricePerUnit,
        uint256 quantity
    ) external notListed(nftAddress, tokenId) {
        if (pricePerUnit == 0) revert PriceMustBeAboveZero();
        if (quantity == 0) revert InvalidQuantity();

        IERC1155 nft = IERC1155(nftAddress);
        uint256 balance = nft.balanceOf(msg.sender, tokenId);
        if (balance < quantity) revert NotOwner();
        try
            IERC1155(nftAddress).isApprovedForAll(msg.sender, address(this))
        returns (bool ok) {
            if (!ok) revert NotApprovedForMarketplace();
        } catch {
            revert NotApprovedForMarketplace();
        }

        s_listings[nftAddress][tokenId] = Listing({
            pricePerUnit: pricePerUnit,
            seller: msg.sender,
            quantity: quantity
        });

        emit ItemListed(
            msg.sender,
            nftAddress,
            tokenId,
            pricePerUnit,
            quantity
        );
    }

    function cancelListing(
        address nftAddress,
        uint256 tokenId
    ) external isListed(nftAddress, tokenId) {
        Listing memory l = s_listings[nftAddress][tokenId];
        if (l.seller != msg.sender) revert NotOwner();
        delete s_listings[nftAddress][tokenId];
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPricePerUnit,
        uint256 newQuantity
    ) external isListed(nftAddress, tokenId) {
        Listing storage l = s_listings[nftAddress][tokenId];
        if (l.seller != msg.sender) revert NotOwner();
        if (newPricePerUnit == 0) revert PriceMustBeAboveZero();
        if (newQuantity == 0) revert InvalidQuantity();

        IERC1155 nft = IERC1155(nftAddress);
        uint256 balance = nft.balanceOf(msg.sender, tokenId);
        if (balance < newQuantity) revert NotOwner();

        l.pricePerUnit = newPricePerUnit;
        l.quantity = newQuantity;

        emit ItemListed(
            msg.sender,
            nftAddress,
            tokenId,
            newPricePerUnit,
            newQuantity
        );
    }

    function buyItem(
        address nftAddress,
        uint256 tokenId,
        uint256 quantity
    ) external nonReentrant isListed(nftAddress, tokenId) {
        Listing storage listed = s_listings[nftAddress][tokenId];
        if (quantity == 0 || quantity > listed.quantity)
            revert InvalidQuantity();

        uint256 totalPrice = listed.pricePerUnit * quantity;

        if (
            duckToken.allowance(msg.sender, address(this)) < totalPrice ||
            duckToken.balanceOf(msg.sender) < totalPrice
        ) {
            revert InsufficientAllowanceOrBalance();
        }
        bool ok = duckToken.transferFrom(msg.sender, address(this), totalPrice);
        require(ok, "DUCK transfer failed");

        // compute fee and seller amount
        uint256 fee = (totalPrice * marketplaceFeeBps) / 10000;
        uint256 sellerAmount = totalPrice - fee;

        // accumulate proceeds
        s_proceeds[listed.seller] += sellerAmount;
        s_proceeds[daoTreasury] += fee;

        IERC1155(nftAddress).safeTransferFrom(
            listed.seller,
            msg.sender,
            tokenId,
            quantity,
            ""
        );

        if (listed.quantity == quantity) {
            delete s_listings[nftAddress][tokenId];
        } else {
            listed.quantity -= quantity;
        }

        emit ItemBought(msg.sender, nftAddress, tokenId, quantity, totalPrice);
    }

    function executeAIPurchase(
        address buyer,
        address nftAddress,
        uint256 tokenId,
        uint256 quantity,
        uint256 maxTotalPrice
    ) external nonReentrant isListed(nftAddress, tokenId) {
        if (!aiAgents[msg.sender]) revert NotAIAgent();
        Listing storage listed = s_listings[nftAddress][tokenId];
        if (quantity == 0 || quantity > listed.quantity)
            revert InvalidQuantity();

        uint256 totalPrice = listed.pricePerUnit * quantity;
        require(totalPrice <= maxTotalPrice, "Price > maxTotalPrice");

        if (
            duckToken.allowance(buyer, address(this)) < totalPrice ||
            duckToken.balanceOf(buyer) < totalPrice
        ) {
            revert InsufficientAllowanceOrBalance();
        }
        bool ok = duckToken.transferFrom(buyer, address(this), totalPrice);
        require(ok, "DUCK transfer failed");

        uint256 fee = (totalPrice * marketplaceFeeBps) / 10000;
        uint256 sellerAmount = totalPrice - fee;
        s_proceeds[listed.seller] += sellerAmount;
        s_proceeds[daoTreasury] += fee;

        IERC1155(nftAddress).safeTransferFrom(
            listed.seller,
            buyer,
            tokenId,
            quantity,
            ""
        );

        if (listed.quantity == quantity) {
            delete s_listings[nftAddress][tokenId];
        } else {
            listed.quantity -= quantity;
        }

        emit ItemBought(buyer, nftAddress, tokenId, quantity, totalPrice);
    }

    function withdrawProceeds() external nonReentrant {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds == 0) revert NoProceeds();
        s_proceeds[msg.sender] = 0;
        bool ok = duckToken.transfer(msg.sender, proceeds);
        require(ok, "DUCK transfer failed");
    }

    function setTrendScore(uint256 tokenId, uint256 score) external {
        if (!aiAgents[msg.sender]) revert NotAIAgent();
        trendScore[tokenId] = score;
        emit TrendScoreUpdated(tokenId, score);
    }

    function getListing(
        address nftAddress,
        uint256 tokenId
    ) external view returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
