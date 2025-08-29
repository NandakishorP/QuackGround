// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155URIStorage} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title QuackNFT (ERC-1155) - simplified (no royalties)
 * @notice Per-token URI, minting by MINTER_ROLE, metadata freeze, supply tracking, pausable.
 */
contract QuackNFT is
    ERC1155,
    ERC1155URIStorage,
    ERC1155Supply,
    ERC1155Burnable,
    AccessControl,
    Pausable
{
    using Strings for uint256;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct TokenMeta {
        address creator;
        bool metadataFrozen;
    }

    string public name;
    string public symbol;

    mapping(uint256 => TokenMeta) private _tokenMeta;
    uint256 private _nextId = 1;

    // Errors
    error NotCreator(uint256 tokenId);
    error MetadataFrozen(uint256 tokenId);
    error InvalidRecipient();
    error QuantityZero();
    error UriEmpty();

    // Events
    event MetadataFrozenEvent(uint256 indexed tokenId, address indexed by);
    event TokenUriUpdated(
        uint256 indexed tokenId,
        string newUri,
        address indexed by
    );
    event TokenMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint256 amount,
        string uri,
        address indexed creator
    );

    constructor(string memory _baseURI, address _admin) ERC1155(_baseURI) {
        if (_admin == address(0)) revert InvalidRecipient();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
    }

    // Admin
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function grantMinter(address account) external onlyRole(ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, account);
    }

    function revokeMinter(address account) external onlyRole(ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, account);
    }

    // Minting
    function mintNew(
        address to,
        uint256 amount,
        string memory tokenURI_,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        if (to == address(0)) revert InvalidRecipient();
        if (amount == 0) revert QuantityZero();
        if (bytes(tokenURI_).length == 0) revert UriEmpty();

        tokenId = _nextId++;
        _mint(to, tokenId, amount, data);
        _setURI(tokenId, tokenURI_);

        _tokenMeta[tokenId] = TokenMeta({
            creator: msg.sender,
            metadataFrozen: false
        });

        emit TokenMinted(to, tokenId, amount, tokenURI_, msg.sender);
    }

    function mintExisting(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert InvalidRecipient();
        if (amount == 0) revert QuantityZero();
        require(exists(tokenId), "Token does not exist");
        _mint(to, tokenId, amount, data);
    }

    function mintNewBatch(
        address to,
        uint256[] memory amounts,
        string[] memory uris,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) returns (uint256[] memory tokenIds) {
        if (to == address(0)) revert InvalidRecipient();
        require(amounts.length == uris.length, "Length mismatch");
        uint256 n = amounts.length;
        tokenIds = new uint256[](n);

        for (uint256 i = 0; i < n; i++) {
            if (amounts[i] == 0) revert QuantityZero();
            if (bytes(uris[i]).length == 0) revert UriEmpty();

            uint256 id = _nextId++;
            tokenIds[i] = id;
            _mint(to, id, amounts[i], data);
            _setURI(id, uris[i]);

            _tokenMeta[id] = TokenMeta({
                creator: msg.sender,
                metadataFrozen: false
            });
            emit TokenMinted(to, id, amounts[i], uris[i], msg.sender);
        }
    }

    // Metadata
    function setTokenURI(uint256 tokenId, string memory newUri) external {
        if (!_isCreator(tokenId, msg.sender)) revert NotCreator(tokenId);
        if (_tokenMeta[tokenId].metadataFrozen) revert MetadataFrozen(tokenId);
        if (bytes(newUri).length == 0) revert UriEmpty();

        _setURI(tokenId, newUri);
        emit TokenUriUpdated(tokenId, newUri, msg.sender);
    }

    function freezeMetadata(uint256 tokenId) external {
        if (!_isCreator(tokenId, msg.sender)) revert NotCreator(tokenId);
        if (_tokenMeta[tokenId].metadataFrozen) revert MetadataFrozen(tokenId);

        _tokenMeta[tokenId].metadataFrozen = true;
        emit MetadataFrozenEvent(tokenId, msg.sender);
    }

    function creatorOf(uint256 tokenId) external view returns (address) {
        require(exists(tokenId), "Token does not exist");
        return _tokenMeta[tokenId].creator;
    }

    function isMetadataFrozen(uint256 tokenId) external view returns (bool) {
        require(exists(tokenId), "Token does not exist");
        return _tokenMeta[tokenId].metadataFrozen;
    }

    // Internal helpers
    function _isCreator(
        uint256 tokenId,
        address caller
    ) internal view returns (bool) {
        return
            _tokenMeta[tokenId].creator == caller ||
            hasRole(ADMIN_ROLE, caller);
    }

    // Overrides
    function uri(
        uint256 tokenId
    ) public view override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return ERC1155URIStorage.uri(tokenId);
    }

    // Override required due to multiple inheritance
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Override required due to multiple inheritance
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, amounts);
    }
}
