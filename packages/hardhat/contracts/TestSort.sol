
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// contracts/TestSort.sol
contract TestSort {
    function testSort(address a, address b) external pure returns (address, address) {
        require(a != b, "same address");
        return a < b ? (a, b) : (b, a);
    }
}
