import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token", function () {
  let token: any;
  let owner: any;
  let addr1: any;

  const INITIAL_SUPPLY = 1000n;

  before(async () => {
    [owner, addr1] = await ethers.getSigners();
    const TokenFactory = await ethers.getContractFactory("Token");
    token = await TokenFactory.deploy(INITIAL_SUPPLY, "TestToken", "TTK", {
      gasLimit: 5_000_000,
    });
    await token.waitForDeployment();
  });

  it("Should initialize with correct name and symbol", async () => {
    expect(await token.name()).to.equal("TestToken"); // Correct name
    expect(await token.symbol()).to.equal("TTK");

    expect(await token.decimals()).to.equal(0);
  });

  it("Should mint initial supply to deployer", async () => {
    expect(await token.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
  });

  it("Should return correct balance from getBalanceOf()", async () => {
    const balance = await token.getBalanceOf(owner.address);
    expect(balance).to.equal(INITIAL_SUPPLY);
  });

  it("Should mint tokens via receive() fallback", async () => {
    await owner.sendTransaction({
      to: await token.getAddress(),
      value: ethers.parseEther("1"),
      gasLimit: 5_000_000,
    });

    expect(await token.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY + BigInt(ethers.parseEther("1").toString()));
  });

  it("Should mint tokens using mintTo()", async () => {
    await token.mintTo(addr1.address, 10, { gasLimit: 5_000_000 });
    expect(await token.balanceOf(addr1.address)).to.equal(10);
  });
});
