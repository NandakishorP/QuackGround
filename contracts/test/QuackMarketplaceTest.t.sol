// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BaseTest.t.sol";

contract QuackMarketplaceTest is BaseTest {
    uint256 tokenId;

    uint256 constant PRICE = 100 ether;
    uint256 constant AMOUNT = 1;

    function setUp() public override {
        super.setUp();

        vm.startPrank(owner);
        quackNFT.grantMinter(owner);
        tokenId = quackNFT.mintNew(
            seller,
            10,
            "ipfs://bafybeig27hsafgr7cpdcoixyiizc3funhevak7rzhwqcfytmtuqncc7acm",
            ""
        );
        vm.stopPrank();
    }

    function testListItem() public {
        vm.startPrank(seller);
        quackNFT.setApprovalForAll(address(marketplace), true);
        marketplace.listItem(address(quackNFT), tokenId, 100 ether, 5);
        vm.stopPrank();

        QuackMarketplace.Listing memory listing = marketplace.getListing(
            address(quackNFT),
            tokenId
        );

        assertEq(listing.pricePerUnit, 100 ether);
        assertEq(listing.quantity, 5);
        assertEq(listing.seller, seller);
    }

    function testBuyItem() public {
        vm.startPrank(seller);
        quackNFT.setApprovalForAll(address(marketplace), true);
        marketplace.listItem(address(quackNFT), tokenId, 100 ether, 5);
        vm.stopPrank();
        vm.startPrank(buyer);
        duckCoin.approve(address(marketplace), 500 ether);
        marketplace.buyItem(address(quackNFT), tokenId, 2);
        vm.stopPrank();
        assertEq(quackNFT.balanceOf(buyer, tokenId), 2);
        QuackMarketplace.Listing memory listing = marketplace.getListing(
            address(quackNFT),
            tokenId
        );
        assertEq(listing.quantity, 3);
        uint256 expectedProceeds = (100 ether * 2 * (10000 - feeBps)) / 10000;
        assertEq(marketplace.getProceeds(seller), expectedProceeds);
        uint256 expectedFee = (100 ether * 2 * feeBps) / 10000;
        assertEq(marketplace.getProceeds(daoTreasury), expectedFee);
    }

    function testWithdrawProceeds() public {
        vm.startPrank(seller);
        quackNFT.setApprovalForAll(address(marketplace), true);
        marketplace.listItem(address(quackNFT), tokenId, 50 ether, 5);
        vm.stopPrank();

        vm.startPrank(buyer);
        duckCoin.approve(address(marketplace), 500 ether);
        marketplace.buyItem(address(quackNFT), tokenId, 5);
        vm.stopPrank();

        vm.startPrank(seller);
        uint256 beforeBalance = duckCoin.balanceOf(seller);
        marketplace.withdrawProceeds();
        uint256 afterBalance = duckCoin.balanceOf(seller);
        vm.stopPrank();

        assertGt(afterBalance, beforeBalance);
    }

    function test_CancelListing_Success() public {
        vm.startPrank(seller);
        quackNFT.setApprovalForAll(address(marketplace), true);
        marketplace.listItem(address(quackNFT), tokenId, PRICE, AMOUNT);
        vm.stopPrank();
        vm.startPrank(seller);
        marketplace.cancelListing(address(quackNFT), tokenId);
        vm.stopPrank();
        QuackMarketplace.Listing memory listing = marketplace.getListing(
            address(quackNFT),
            tokenId
        );
        assertEq(listing.pricePerUnit, 0, "Price should be reset to zero");
        assertEq(listing.quantity, 0, "Amount should be reset to zero");
        assertEq(listing.seller, address(0), "Lister should be reset to zero");
    }

    function test_CancelListing_FailsIfNotLister() public {
        vm.startPrank(seller);
        quackNFT.setApprovalForAll(address(marketplace), true);

        marketplace.listItem(address(quackNFT), tokenId, PRICE, AMOUNT);
        vm.stopPrank();
        vm.startPrank(buyer);
        vm.expectRevert(
            abi.encodeWithSignature("NotOwner()", address(quackNFT), tokenId)
        );
        marketplace.cancelListing(address(quackNFT), tokenId);
        vm.stopPrank();
    }

    function test_CancelListing_FailsIfNotListed() public {
        vm.startPrank(seller);
        vm.expectRevert(
            abi.encodeWithSignature(
                "NotListed(address,uint256)",
                address(quackNFT),
                tokenId
            )
        );
        marketplace.cancelListing(address(quackNFT), tokenId);
        vm.stopPrank();
    }

    function test_CancelListing_ThenListAgain() public {
        vm.startPrank(seller);
        quackNFT.setApprovalForAll(address(marketplace), true);

        marketplace.listItem(address(quackNFT), tokenId, PRICE, AMOUNT);
        marketplace.cancelListing(address(quackNFT), tokenId);
        marketplace.listItem(address(quackNFT), tokenId, 200 ether, AMOUNT);
        vm.stopPrank();
        QuackMarketplace.Listing memory listing = marketplace.getListing(
            address(quackNFT),
            tokenId
        );
        assertEq(listing.pricePerUnit, 200 ether);
        assertEq(listing.quantity, AMOUNT);
        assertEq(listing.seller, seller);
    }
}
