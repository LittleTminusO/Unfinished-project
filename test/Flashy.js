
const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}
const ether = tokens

describe('FlashLoan', () => {
    let token, flashLoan, FlashLoanReceiver
    let deployer

    beforeEach(async () => {
        // Setup accounts
        accounts = await ethers.getSigners()
        deployer = accounts[0]

        // Load accounts
        const FlashLoan = await ethers.getContractFactory('FlashLoan')
        const FlashLoanReceiver = await ethers.getContractFactory('FlashLoanReceiver')
        const Token = await ethers.getContractFactory('Token')

        // deploy token
        token = await Token.deploy('Finally', 'SomeCrypto', '1000000')

        //deploy Flash Loan pool
        flashLoan = await FlashLoan.deploy(token.address)

        // Approve tokens before despositing
        let transaction = await token.connect(deployer).approve(flashLoan.address, tokens(1000000))
        await transaction.wait()

        // Deposit tokens into the pool
        transaction = await flashLoan.connect(deployer).depositTokens(tokens(1000000))
        await transaction.wait()

        // Deploy flash loan receiver
        flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.address)

    })

    describe('Deployment', () => {

        it('sends tokens to the flash loan pool contract', async () => {
            expect(await token.balanceOf(flashLoan.address)).to.equal(tokens(1000000))
        })
    })

    describe('Borrowing funds', () => {
        it('borrows funds from the pool', async () => {
            let amount = tokens(100)
            let transaction = await flashLoanReceiver.connect(deployer).executeFlashLoan(amount)
            let result = await transaction.wait()
        })

    })

})