// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./Token.sol";

contract DecentralizedExchange {

    address public feeAccount;
    uint256 public feePercent;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint256 amount, uint256 balance);

    mapping(address => mapping(address => uint256)) public tokens;

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // DEPOSIT AND WITHDRAW TOKENS\\
    function depositToken(address _token, uint256 _amount) public {
        require(Token(_token).transferFrom(msg.sender, address(this), _amount), "Token transfer failed. Please make sure that the sender has sufficient balance and allowance for the transfer and that the token contract is functioning properly.");
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withdrawToken(address _token, uint256 _amount) public {
        require(tokens[_token][msg.sender] >= _amount, "Insufficient token balance. Please check your token balance and try again with a lower amount.");
        Token(_token).transfer(msg.sender, _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(address _token, address _user) public view returns(uint256){
        return tokens[_token][_user];
    }

}