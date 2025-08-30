// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/DuckCoin.sol";
import "../src/QuackNFT.sol";
import "../src/QuackMarketplace.sol";

contract BaseTest is Test {
    DuckCoin duckCoin;
    QuackNFT quackNFT;
    QuackMarketplace marketplace;

    address owner = address(0x1);
    address daoTreasury = address(0x2);
    address seller = address(0x3);
    address buyer = address(0x4);

    uint256 feeBps = 500;

    function setUp() public virtual {
        vm.startPrank(owner);
        duckCoin = new DuckCoin();
        quackNFT = new QuackNFT("https://base-uri/", owner);
        marketplace = new QuackMarketplace(
            address(duckCoin),
            daoTreasury,
            feeBps
        );
        vm.stopPrank();
        vm.startPrank(owner);
        duckCoin.mint(buyer, 1000 ether);
        vm.stopPrank();
        vm.label(owner, "Owner");
        vm.label(seller, "Seller");
        vm.label(buyer, "Buyer");
        vm.label(daoTreasury, "DAO Treasury");
    }
}
