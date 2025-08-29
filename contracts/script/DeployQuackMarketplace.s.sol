// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {DuckCoin} from "../src/DuckCoin.sol";
import {QuackMarketplace} from "../src/QuackMarketplace.sol";
import {QuackNFT} from "../src/QuackNFT.sol";

contract DeployQuackMarketplace is Script {
    function run() public returns (DuckCoin, QuackMarketplace, QuackNFT) {
        vm.startBroadcast(
            0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
        );

        DuckCoin duckcoin = new DuckCoin();
        QuackMarketplace nftmarketplace = new QuackMarketplace(
            address(duckcoin),
            address(duckcoin),
            1e12
        );

        QuackNFT nft = new QuackNFT(
            "ipfs://bafybeig27hsafgr7cpdcoixyiizc3funhevak7rzhwqcfytmtuqncc7acm/",
            0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        );

        vm.stopBroadcast();

        return (duckcoin, nftmarketplace, nft);
    }
}
