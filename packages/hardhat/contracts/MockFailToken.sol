

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockFailToken {
    function approve(address, uint256) external pure returns (bool) {
        return false;
    }

    function transfer(address, uint256) external pure returns (bool) {
        return false;
    }

    function transferFrom(address, address, uint256) external pure returns (bool) {
        return false;
    }

    function allowance(address, address) external pure returns (uint256) {
        return 1000;
    }

    function balanceOf(address) external pure returns (uint256) {
        return 1000;
    }

    function totalSupply() external pure returns (uint256) {
        return 10000;
    }

    function name() external pure returns (string memory) {
        return "MockFailToken";
    }

    function symbol() external pure returns (string memory) {
        return "MFT";
    }

    function decimals() external pure returns (uint8) {
        return 18;
    }
}
