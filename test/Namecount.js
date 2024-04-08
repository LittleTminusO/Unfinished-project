const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Namecount', () => {
    let nameCount

    beforeEach(async () => {
        const Namecount = await ethers.getContractFactory('Namecount')
        namecount = await Namecount.deploy('My Namecount', 69)
    })

    describe('deployment', () => {
        it('Sets the initial count', async () => {

            const number = await namecount.number()
            expect(number).to.equal(69)
        })

        it('Sets the initial name', async () => {

            const samsung = await namecount.samsung()
            expect(samsung).to.equal('My Namecount')
        })
    })
    describe('counting', () => {
        let transaction
        it('reads the count from the "number" public variable', async () => {
            expect(await namecount.number()).to.equal(69)
        })

        it('increments the number', async () => {
            transaction = await namecount.increaseNumber()
            await transaction.wait()

            expect(await namecount.number()).to.equal(70)

            transaction = await namecount.increaseNumber()
            await transaction.wait()

            expect(await namecount.number()).to.equal(71)
        })


        it('decrements the number', async () => {
            transaction = await namecount.Decrease()
            await transaction.wait()

            expect(await namecount.number()).to.equal(68)

            transaction = await namecount.Decrease()
            await transaction.wait()

            expect(await namecount.number()).to.equal(67)
        })
        it('reads the name from the "samsung" public variable', async () => {
            expect(await namecount.samsung()).to.equal('My Namecount')
        })


    })
})