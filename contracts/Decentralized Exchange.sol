// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract DecentralizedExchange {

    address public feeAccount;
    uint256 public feePercent;


    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function depositToken(address _token, uint256 _amount) public {
        //transfer tokens to exchange
        //update user balance
        //emit an event
    }

}
