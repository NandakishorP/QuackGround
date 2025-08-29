// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DuckCoin is ERC20, Ownable {
    error DuckCoin__InvalidAddress();
    error DuckCoin__AmountMustBeMoreThanZero();

    constructor() ERC20("Duck Coin", "SC") Ownable(msg.sender) {}

    function mint(
        address _to,
        uint256 _amount
    ) external onlyOwner returns (bool) {
        if (_to == address(0)) {
            revert DuckCoin__InvalidAddress();
        }
        if (_amount <= 0) {
            revert DuckCoin__AmountMustBeMoreThanZero();
        }
        _mint(_to, _amount);
        return true;
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
