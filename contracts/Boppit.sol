// SPDX-License-Identifer: UNLICENSED

pragma solidity ^0.8.0;
interface IERC721{
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Boppit {
    address public nftAddress;
    uint public nftID;
    uint public purchasePrice;
    uint public boppitAmount;
    address payable public seller;
    address payable public buyer;
    address public inspector;
    address public lender;

    modifier onlyBuyer() {
    require(msg.sender == buyer, "Only buyer can call this function");
    _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "only inspector can call this function");
        _;
    }

    bool public inspectionPassed = false;
    mapping(address => bool) public approval;

    receive() external payable {}

    constructor(
        address _nftAddress,
        uint _nftID,
        uint _purchasePrice,
        uint _boppitAmount,
        address payable _seller, 
        address payable _buyer,
        address _inspector,
        address _lender
        ) {
    nftAddress = _nftAddress;
    nftID = _nftID;
    purchasePrice = _purchasePrice;
    boppitAmount = _boppitAmount;
    seller = _seller;
    buyer = _buyer;
    inspector = _inspector;
    lender = _lender;
    
}




function depositEarnest() public payable onlyBuyer{
    require(msg.value >= boppitAmount); 
     
}

function updateInspectionStatus(bool _passed) public onlyInspector{
    inspectionPassed = _passed;
}

function approveSale() public {
    approval[msg.sender] = true;
}

function getBalance() public view returns (uint) {
    return address(this).balance;
}

     function finalizeSale() public {
        require(inspectionPassed, 'must pass inspection') ;
        require(approval[buyer], 'must be approved by buyer');
        require(approval[seller], 'must be approved by seller ');
        require(approval[lender], 'must be approved by lender');
        require(address(this).balance >= purchasePrice, 'must have enough ether for sale');

        (bool success, ) = payable(seller).call{value: address(this).balance}("");
        require(success);

        // Transfer ownership of property
        IERC721(nftAddress).transferFrom(seller, buyer, nftID);
     }
}