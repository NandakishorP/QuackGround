// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {DuckCoin} from "../src/DuckCoin.sol";
import {QuackMarketplace} from "../src/QuackMarketplace.sol";
import {QuackNFT} from "../src/QuackNFT.sol";

contract NftMarketplaceTest is Test {
    DuckCoin duckCoin;
    QuackMarketplace marketPlace;
    QuackNFT nft;

    function setUp() public {}
}
