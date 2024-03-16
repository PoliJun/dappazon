const { expect } = require("chai");
const { ethers } = require("hardhat");
const { describe, it, beforeEach } = require("mocha");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether");
};
const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE =
    "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;
describe("Dappazon", () => {
    let deployer, buyer;
    let dappazon;
    beforeEach(async () => {
        // Set up accounts
        [deployer, buyer] = await ethers.getSigners();
        // console.log("Deployer address: " + deployer.address);
        // console.log("Buyer address: " + buyer.address);
        // Deploy contract
        const Dappazon = await ethers.getContractFactory("Dappazon");
        dappazon = await Dappazon.deploy();
    });
    describe("Deployment", () => {
        it("Sets the owner", async () => {
            expect(await dappazon.owner()).to.equal(deployer.address);
        });
    });
    describe("Listing items", async () => {
        let transaction;

        beforeEach(async () => {
            transaction = await dappazon
                .connect(deployer)
                .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
            await transaction.wait();
        });
        it("Lists an item", async () => {
            const item = await dappazon.items(1);
            expect(item.id).to.equal(1);
        });
        it("Returns the item attributes", async () => {
            const item = await dappazon.items(ID);

            expect(item.id).to.equal(ID);
            expect(item.name).to.equal(NAME);
            expect(item.category).to.equal(CATEGORY);
            expect(item.image).to.equal(IMAGE);
            expect(item.cost).to.equal(COST);
            expect(item.rating).to.equal(RATING);
            expect(item.stock).to.equal(STOCK);
        });
        it("Emit List", async () => {
            expect(transaction)
                .to.emit(dappazon, "List")
                .withArgs(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
        });
    });
    describe("Buying items", async () => {
        let transaction;
        beforeEach(async () => {
            await dappazon
                .connect(deployer)
                .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
            transaction = await dappazon
                .connect(buyer)
                .buy(ID, { value: COST });
            await transaction.wait();
        });
        // it("Buy an item", async () => {
        //     const item = await dappazon.items(ID);
        //     expect(item.stock).to.equal(STOCK - 1);
        // });
        it("Updates the contract balance", async () => {
            const result = await ethers.provider.getBalance(dappazon.address);
            expect(result).to.equal(COST);
        });
        it("Emit Buy", async () => {
            expect(transaction).to.emit(dappazon, "Buy").withArgs(ID, COST);
        });
    });
});
