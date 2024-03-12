const { expect } = require("chai");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Dappazon", () => {
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
                .list(1, "Shoes", "Clothing", "Image", 1, 4, 5);
            await transaction.wait();
        });
        it("Lists an item", async () => {
            const item = await dappazon.items(1);
            expect(item.id).to.equal(1);
        });
    });
});
