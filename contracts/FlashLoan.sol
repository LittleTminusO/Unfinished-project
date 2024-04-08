// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


import "hardhat/console.sol";
import "./Token.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IReceiver {
    function receiveTokens(address tokenAddress, uint amount) external;
}


contract FlashLoan {
    using SafeMath for uint;

    Token public token;
    uint public poolBalance;
    
    constructor(address _tokenAddress) {
        token = Token(_tokenAddress);
    }

    function depositTokens(uint _amount) external {
        require(_amount > 0, "Must deposit at least one token");
        token.transferFrom(msg.sender, address(this), _amount);
        poolBalance = poolBalance.add(_amount);
    }
    function flashLoan(uint _borrowAmount) external {
        // Send tokens to receiver
        token.transfer(msg.sender, _borrowAmount);

        IReceiver(msg.sender).receiveTokens(address(token), _borrowAmount);

        
    }
}