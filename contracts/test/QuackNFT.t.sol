// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BaseTest.t.sol";

contract QuackNFTTest is BaseTest {
    string tokenUri =
        "ipfs://bafybeig27hsafgr7cpdcoixyiizc3funhevak7rzhwqcfytmtuqncc7acm";

    function setUp() public override {
        super.setUp();
    }

    function testMintNewNFT() public {
        vm.startPrank(owner);
        quackNFT.grantMinter(owner);
        uint256 tokenId = quackNFT.mintNew(seller, 10, tokenUri, "");
        vm.stopPrank();

        assertEq(tokenId, 1);
        assertEq(quackNFT.balanceOf(seller, tokenId), 10);
        assertEq(quackNFT.uri(tokenId), tokenUri);
    }

    function testMintExistingNFT() public {
        vm.startPrank(owner);
        quackNFT.grantMinter(owner);
        uint256 tokenId = quackNFT.mintNew(seller, 5, tokenUri, "");
        quackNFT.mintExisting(seller, tokenId, 5, "");
        vm.stopPrank();

        assertEq(quackNFT.balanceOf(seller, tokenId), 10);
    }

    // function testSetAndFreezeURI() public {
    //     vm.startPrank(owner);
    //     quackNFT.grantMinter(owner);
    //     uint256 tokenId = quackNFT.mintNew(seller, 3, "ipfs://old", "");
    //     vm.stopPrank();

    //     vm.startPrank(owner);
    //     quackNFT.setTokenURI(tokenId, "ipfs://new");
    //     assertEq(quackNFT.uri(tokenId), "ipfs://new");

    //     quackNFT.freezeMetadata(tokenId);
    //     vm.expectRevert();
    //     quackNFT.setTokenURI(tokenId, "ipfs://blocked");
    //     vm.stopPrank();
    // }
}
