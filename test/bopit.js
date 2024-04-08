const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('RealEstate', () => {
    let realEstate, boppit
    let deployer, seller
    let nftID = 1
    let purchasePrice = ether(100)
    let boppitAmount = ether(20)

    beforeEach(async () => {
        // Setup accounts
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        seller = deployer
        buyer = accounts[1]
        inspector = accounts[2]
        lender = accounts[3]


        // Load contracts
        const RealEstate = await ethers.getContractFactory('RealEstate')
        const Boppit = await ethers.getContractFactory('Boppit')
        // Deploy contracts
        realEstate = await RealEstate.deploy()


        boppit = await Boppit.deploy(
            realEstate.address,
            nftID,
            purchasePrice,
            boppitAmount,
            seller.address,
            buyer.address,
            inspector.address,
            lender.address
        )
        // Seller Approves NFT
        transaction = await realEstate.connect(seller).approve(boppit.address, nftID)
        await transaction.wait()

    })
    describe('Deployment', async () => {

        it('sends an NFT to the seller / deployer', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })



        describe('selling real estate', async () => {
            let balance, transaction

            it('executes a successful transaction', async () => {
                // expects seller to be the NFT owner before the sale.

                expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)

                // check boppit balance
                balance = await boppit.getBalance()
                console.log("boppit balance:", ethers.utils.formatEther(balance))

                // buyer deposits earnest
                transaction = await boppit.connect(buyer).depositEarnest({ value: ether(20) })

                // check boppit balance
                balance = await boppit.getBalance()
                console.log("boppit balance:", ethers.utils.formatEther(balance))

                // Inspector updates status
                transaction = await boppit.connect(inspector).updateInspectionStatus(true)
                await transaction.wait()
                console.log("Inspector updates status")

                //buyer approves sale
                transaction = await boppit.connect(buyer).approveSale()
                await transaction.wait()
                console.log("buyer approves sale")

                // Seller approves sale
                transaction = await boppit.connect(seller).approveSale()
                await transaction.wait()
                console.log("Seller approves sale")

                // Lender funds sale
                transaction = await lender.sendTransaction({ to: boppit.address, value: ether(80) })

                // Lender approves sale
                transaction = await boppit.connect(lender).approveSale()
                await transaction.wait()
                console.log("Lender approves sale")

                //finalizes sale

                transaction = await boppit.connect(buyer).finalizeSale()
                await transaction.wait()
                console.log("buyer finalizes sale")

                //expects buyer to be owner of nft address after sale
                expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address)

                // Expect Seller to receive funds
                balance = await ethers.provider.getBalance(seller.address)
                console.log("Seller balance:", ethers.utils.formatEther(balance))
                expect(balance).to.be.above(ether(1099))

            })
        })

    })
})
