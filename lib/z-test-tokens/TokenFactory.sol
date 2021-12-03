// SPDX-License-Identifier: MIT

pragma solidity =0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenFactory {
    address[] public arr;

    function createNewToken(string calldata _name, string calldata _symbol) public {
        bytes32 salt = keccak256("This is used to create to the same address every time"); 
        ERC20 erc20 = new ERC20{salt: salt}(_name, _symbol);
        arr.push(address(erc20));
    }

    function getArr() external view returns(address[] memory) {
        return arr;
    }

}

