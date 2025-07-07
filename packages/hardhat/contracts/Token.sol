// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";



contract Token is IERC20, ERC20  {

constructor(uint amount, string memory token_, string memory name_) ERC20(token_, name_) {
    _mint(msg.sender, amount); // gwei
}

function decimals() public pure override returns (uint8) {
    return 0;
}


// puedo deir que entreguen ethers 1:1 y luego reduzco o aumento el precio
// puede ser tambien para entregar monedas por plata > epic games o un casino
receive()external payable {
    _mint(msg.sender, msg.value);
}

function getBalanceOf(address account) external view returns (uint256){
    return balanceOf(account);
}

function mintTo(address to, uint256 amount) external {
        _mint(to, amount);
                console.log(
            "Transferring %s tokens from %s to %s",
            amount,
            msg.sender,
            to
        );
    }
    
}
