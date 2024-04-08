//-SPDX-License-Identifier:-UNLICENSED
pragma solidity ^0.8.0;

contract Namecount {
    string public samsung;
    string public Cellnumber;
    uint public number;
    constructor(string memory _samsung, uint _initialNumber) {
        samsung = _samsung;
        number = _initialNumber;
    }
    function increaseNumber() public {
        number ++;
    }
    function Decrease() public {
        number --;

    }
    function Addnumber(string memory _addNumber) public returns(string memory Addnumber) {
        Cellnumber = _addNumber;
        return Cellnumber;
    }
    function PhoneNumber() public view returns(string memory Digits){
        return Cellnumber;
    }
function getContact() public view returns(string memory Contacts){
    return samsung;
}
    function newContact(string memory _newContact) public returns(string memory newContact) {
        samsung = _newContact;
        return samsung;
    }
}