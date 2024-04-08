// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
import "./FlashLoan.sol";

contract FlashLoanReceiver {
    FlashLoan private pool;
    address private owner;

    constructor(address _poolAddress) {
        pool =  FlashLoan(_poolAddress);
        owner = msg.sender;
    }
    function receiveTokens(address _tokenAddress, uint _amount) external {
        console.log("_tokenAddress", _tokenAddress, "_amount", _amount);
    }

    function executeFlashLoan(uint _amount) external {
        require(msg.sender == owner, "only owner can execute flash loan");
        pool.flashLoan(_amount);
    }

}