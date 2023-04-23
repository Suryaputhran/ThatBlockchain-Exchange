// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./Token.sol";

contract DecentralizedExchange {

    address public feeAccount;
    uint256 public feePercent;
    uint256 public orderCount;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint256 amount, uint256 balance);
    event Order(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);

    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;

    struct _Order{
        uint256 id; //unique identifier for order
        address user;
        address tokenGet; //user who made order
        uint256 amountGet; // add of the token they receive
        address tokenGive; // address of token they give
        uint256 amountGive; //amount they give
        uint256 timestamp; //when order was created
    }

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // ---------------------------
    // DEPOSIT AND WITHDRAW TOKENS
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

    // ---------------------------
    // MAKE & CANCEL ORDERS
    function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive, "Error: Insufficient balance. You do not have enough balance of the specified token to make this order.");
        orderCount = orderCount + 1;
        orders[orderCount] = _Order(
            orderCount,
            msg.sender, //user
            _tokenGet, //tokenGet
            _amountGet, //amountGet
            _tokenGive, //tokenGive
            _amountGive, // amountGive
            block.timestamp
        );

        emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp );
    }
}
