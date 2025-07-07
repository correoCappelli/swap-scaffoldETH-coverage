import { expect } from "chai";
import { ethers } from "hardhat";

describe("SimpleSwap", function () {
  let swap: any;
  let tokenA: any;
  let tokenB: any;
  let owner: any;
  let addr1: any;

  const INITIAL_SUPPLY = 10000n;
  const GAS_LIMIT = 5_000_000;
  const ONE_ETH = BigInt("1000000000000000000");

  before(async () => {
    [owner, addr1] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("Token");
    tokenA = await TokenFactory.deploy(INITIAL_SUPPLY, "TKA", "TokenA", { gasLimit: GAS_LIMIT });
    await tokenA.waitForDeployment();

    tokenB = await TokenFactory.deploy(INITIAL_SUPPLY, "TKB", "TokenB", { gasLimit: GAS_LIMIT });
    await tokenB.waitForDeployment();

    const SwapFactory = await ethers.getContractFactory("SimpleSwap");
    swap = await SwapFactory.deploy({ gasLimit: GAS_LIMIT });
    await swap.waitForDeployment();

    await tokenA.approve(await swap.getAddress(), INITIAL_SUPPLY, { gasLimit: GAS_LIMIT });
    await tokenB.approve(await swap.getAddress(), INITIAL_SUPPLY, { gasLimit: GAS_LIMIT });
  });

  it("Should add liquidity and emit LiquidityAdded", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    await expect(
      swap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        1000,
        1000,
        900,
        900,
        owner.address,
        deadline,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.emit(swap, "LiquidityAdded");
  });

  it("Should get reserves", async () => {
    const [rA, rB] = await swap.getReserves(await tokenA.getAddress(), await tokenB.getAddress());
    expect(rA).to.equal(1000);
    expect(rB).to.equal(1000);
  });

  it("Should get price", async () => {
    const price = await swap.getPrice(await tokenA.getAddress(), await tokenB.getAddress());
    expect(price).to.equal(ONE_ETH);
  });

  it("Should get liquidity balance", async () => {
    const balance = await swap.getLiquidity(await tokenA.getAddress(), await tokenB.getAddress(), owner.address);
    expect(balance).to.be.gt(0);
  });

  it("Should return zero liquidity for unused address", async () => {
    const balance = await swap.getLiquidity(await tokenA.getAddress(), await tokenB.getAddress(), addr1.address);
    expect(balance).to.equal(0);
  });

  it("Should swap tokens and emit Swap", async () => {
    await tokenA.transfer(addr1.address, 1000, { gasLimit: GAS_LIMIT });
    await tokenA.connect(addr1).approve(await swap.getAddress(), 1000, { gasLimit: GAS_LIMIT });

    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const path = [await tokenA.getAddress(), await tokenB.getAddress()];
    await expect(
      swap.connect(addr1).swapExactTokensForTokens(100, 90, path, addr1.address, deadline, { gasLimit: GAS_LIMIT }),
    ).to.emit(swap, "Swap");
  });

  it("Should remove liquidity and emit LiquidityRemoved", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const lpBalance = await swap.getLiquidity(await tokenA.getAddress(), await tokenB.getAddress(), owner.address);

    await expect(
      swap.removeLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        lpBalance,
        1,
        1,
        owner.address,
        deadline,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.emit(swap, "LiquidityRemoved");
  });

  it("Should revert on invalid swap path", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const badPath = [await tokenA.getAddress()];
    await expect(
      swap.swapExactTokensForTokens(100, 90, badPath, owner.address, deadline, { gasLimit: GAS_LIMIT }),
    ).to.be.revertedWith("SS:IPL");
  });

  it("Should revert on expired deadline", async () => {
    const expired = Math.floor(Date.now() / 1000) - 100; // 100 seconds ago
    await expect(
      swap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        100,
        100,
        90,
        90,
        owner.address,
        expired,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.be.revertedWith("SS:EXP");
  });

  it("Should revert if tokenA equals tokenB", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const token = await tokenA.getAddress();
    await expect(
      swap.addLiquidity(token, token, 100, 100, 90, 90, owner.address, deadline, { gasLimit: GAS_LIMIT }),
    ).to.be.revertedWith("SS:IA");
  });

  it("Should revert if amountADesired is zero", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    await expect(
      swap.addLiquidity(await tokenA.getAddress(), await tokenB.getAddress(), 0, 100, 0, 90, owner.address, deadline, {
        gasLimit: GAS_LIMIT,
      }),
    ).to.be.revertedWith("SS:INA");
  });

  it("Should calculate correct output using getAmountOut", async () => {
    const out = await swap.getAmountOut(100, 1000, 1000);
    expect(out).to.equal(90);
  });

  it("Should revert when getting reserves from uninitialized pool", async () => {
    const TokenFactory = await ethers.getContractFactory("Token");
    const fakeToken = await TokenFactory.deploy(INITIAL_SUPPLY, "FAKE", "TokenFake", { gasLimit: GAS_LIMIT });
    await fakeToken.waitForDeployment();

    await expect(swap.getReserves(await tokenA.getAddress(), await fakeToken.getAddress())).to.be.revertedWith(
      "SS:RNI",
    );
  });

  it("Should trigger sqrt logic during first liquidity provision", async () => {
    const SwapFactory = await ethers.getContractFactory("SimpleSwap");
    const freshSwap = await SwapFactory.deploy({ gasLimit: GAS_LIMIT });
    await freshSwap.waitForDeployment();

    await tokenA.approve(await freshSwap.getAddress(), INITIAL_SUPPLY, { gasLimit: GAS_LIMIT });
    await tokenB.approve(await freshSwap.getAddress(), INITIAL_SUPPLY, { gasLimit: GAS_LIMIT });

    const deadline = Math.floor(Date.now() / 1000) + 1000;
    await expect(
      freshSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        200,
        200,
        150,
        150,
        owner.address,
        deadline,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.emit(freshSwap, "LiquidityAdded");
  });
  it("Should revert if amountBMin is too high", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;

    // First add creates pool
    await swap.addLiquidity(
      await tokenA.getAddress(),
      await tokenB.getAddress(),
      500,
      500,
      450,
      450,
      owner.address,
      deadline,
      { gasLimit: GAS_LIMIT },
    );

    // Now test slippage logic
    await expect(
      swap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        500,
        500,
        450,
        600, // too high to satisfy slippage
        owner.address,
        deadline,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.be.revertedWith("SS:INB");
  });

  it("Should revert if amountAMin is too high", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    await expect(
      swap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        1000,
        500,
        900, // too high
        400,
        owner.address,
        deadline,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.be.revertedWith("SS:INA");
  });

  it("Should revert if getAmountOut called with zero input", async () => {
    await expect(swap.getAmountOut(0, 1000, 1000)).to.be.revertedWith("SS:INA");
  });

  it("Should revert if getAmountOut called with zero reserves", async () => {
    await expect(swap.getAmountOut(100, 0, 1000)).to.be.revertedWith("SS:IL");
  });

  it("Should revert if _update causes overflow", async () => {
    const max = BigInt("2") ** BigInt("112");
    await expect(
      swap.swapExactTokensForTokens(
        max,
        1,
        [await tokenA.getAddress(), await tokenB.getAddress()],
        owner.address,
        Math.floor(Date.now() / 1000) + 1000,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.be.revertedWith("SS:OVERFLOW");
  });

  it("Should sort tokens correctly", async () => {
    const TestSortFactory = await ethers.getContractFactory("TestSort");
    const tester = await TestSortFactory.deploy({ gasLimit: GAS_LIMIT });
    await tester.waitForDeployment();

    // Use the correct cast with TypeChain
    const sorted = await tester.testSort(await tokenA.getAddress(), await tokenB.getAddress());
    expect(sorted[0] < sorted[1]).to.equal(true);

    const [sortedA, sortedB] = await tester.testSort(await tokenA.getAddress(), await tokenB.getAddress());
    expect(sortedA < sortedB).to.equal(true);
  });
  it("Should revert if removeLiquidity slippage fails", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const lpBalance = await swap.getLiquidity(await tokenA.getAddress(), await tokenB.getAddress(), owner.address);

    await expect(
      swap.removeLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        lpBalance,
        10000, // too high
        10000, // too high
        owner.address,
        deadline,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.be.revertedWith("SS:INA");
  });

  it("Should revert if removeLiquidity called with zero address", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const lpBalance = await swap.getLiquidity(await tokenA.getAddress(), await tokenB.getAddress(), owner.address);

    await expect(
      swap.removeLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        lpBalance,
        1,
        1,
        ethers.ZeroAddress,
        deadline,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.be.revertedWith("SS:IR");
  });

  it("Should revert if addLiquidity called with zero token address", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    await expect(
      swap.addLiquidity(ethers.ZeroAddress, await tokenB.getAddress(), 100, 100, 90, 90, owner.address, deadline, {
        gasLimit: GAS_LIMIT,
      }),
    ).to.be.revertedWith("SS:IZA");
  });

  it("Should revert if removeLiquidity with insufficient LP balance", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    await expect(
      swap.removeLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        999999, // too much
        1,
        1,
        addr1.address,
        deadline,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.be.revertedWith("SS:ILB");
  });

  it("Should revert if removeLiquidity called with zero liquidity amount", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    await expect(
      swap.removeLiquidity(await tokenA.getAddress(), await tokenB.getAddress(), 0, 1, 1, owner.address, deadline, {
        gasLimit: GAS_LIMIT,
      }),
    ).to.be.revertedWith("SS:IL");
  });
  it("Should revert if liquidityMinted is zero", async () => {
    const SwapFactory = await ethers.getContractFactory("SimpleSwap");
    const freshSwap = await SwapFactory.deploy({ gasLimit: GAS_LIMIT });
    await freshSwap.waitForDeployment();

    await tokenA.approve(await freshSwap.getAddress(), INITIAL_SUPPLY, { gasLimit: GAS_LIMIT });
    await tokenB.approve(await freshSwap.getAddress(), INITIAL_SUPPLY, { gasLimit: GAS_LIMIT });

    const deadline = Math.floor(Date.now() / 1000) + 1000;
    console.log(deadline);

    await expect(
      freshSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        1n,
        10n ** 24n,
        1n,
        1n,
        owner.address,
        Math.floor(Date.now() / 1000) + 1000,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.be.reverted;
  });

  it("Should revert if swap uses zero address in path", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    await expect(
      swap.swapExactTokensForTokens(100, 90, [ethers.ZeroAddress, await tokenB.getAddress()], owner.address, deadline, {
        gasLimit: GAS_LIMIT,
      }),
    ).to.be.revertedWith("SS:IZA");
  });

  it("Should revert if removeLiquidity on empty pool", async () => {
    const SwapFactory = await ethers.getContractFactory("SimpleSwap");
    const emptySwap = await SwapFactory.deploy({ gasLimit: GAS_LIMIT });
    await emptySwap.waitForDeployment();

    await expect(
      emptySwap.removeLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        1,
        1,
        1,
        owner.address,
        Math.floor(Date.now() / 1000) + 1000,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.be.revertedWith("SS:ITL");
  });
  it("Should revert on failed safeTransferFrom using MockFailToken", async () => {
    const FailFactory = await ethers.getContractFactory("MockFailToken");
    const failToken = await FailFactory.deploy({ gasLimit: GAS_LIMIT });
    await failToken.waitForDeployment();

    const SwapFactory = await ethers.getContractFactory("SimpleSwap");
    const swap = await SwapFactory.deploy({ gasLimit: GAS_LIMIT });
    await swap.waitForDeployment();

    // Approve intentionally—SafeERC20 will call transferFrom internally
    await expect(
      swap.addLiquidity(
        await failToken.getAddress(),
        await tokenB.getAddress(),
        100,
        100,
        90,
        90,
        owner.address,
        Math.floor(Date.now() / 1000) + 1000,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.be.revertedWithCustomError(swap, "SafeERC20FailedOperation");
  });

  it("Should fallback to forceApprove when approve returns false", async () => {
    const FailFactory = await ethers.getContractFactory("MockFailToken");
    const failToken = await FailFactory.deploy({ gasLimit: GAS_LIMIT });
    await failToken.waitForDeployment();

    await expect(
      swap.addLiquidity(
        await failToken.getAddress(),
        await tokenB.getAddress(),
        100,
        100,
        90,
        90,
        owner.address,
        Math.floor(Date.now() / 1000) + 1000,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.be.revertedWithCustomError(swap, "SafeERC20FailedOperation");
  });

  it("Should revert if getAmountOut rounds to zero", async () => {
    await expect(swap.getAmountOut(0, 1000, 1000)).to.be.revertedWith("SS:INA");
  });

  it("Should revert swap with zero reserves", async () => {
    const SwapFactory = await ethers.getContractFactory("SimpleSwap");
    const emptySwap = await SwapFactory.deploy({ gasLimit: GAS_LIMIT });
    await emptySwap.waitForDeployment();

    await expect(
      emptySwap.swapExactTokensForTokens(
        100,
        90,
        [await tokenA.getAddress(), await tokenB.getAddress()],
        owner.address,
        Math.floor(Date.now() / 1000) + 1000,
        { gasLimit: GAS_LIMIT },
      ),
    ).to.be.revertedWith("SS:RNI");
  });

  it("Should increase liquidity balance after addLiquidity", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const swapAddr = await swap.getAddress();

    const initial = await swap.getLiquidity(await tokenA.getAddress(), await tokenB.getAddress(), addr1.address, {
      gasLimit: GAS_LIMIT,
    });

    await tokenA.transfer(addr1.address, 1000, { gasLimit: GAS_LIMIT });
    await tokenB.transfer(addr1.address, 1000, { gasLimit: GAS_LIMIT });
    await tokenA.connect(addr1).approve(swapAddr, 1000, { gasLimit: GAS_LIMIT });
    await tokenB.connect(addr1).approve(swapAddr, 1000, { gasLimit: GAS_LIMIT });

    await swap
      .connect(addr1)
      .addLiquidity(await tokenA.getAddress(), await tokenB.getAddress(), 100, 100, 90, 90, addr1.address, deadline, {
        gasLimit: GAS_LIMIT,
      });

    const final = await swap.getLiquidity(await tokenA.getAddress(), await tokenB.getAddress(), addr1.address);
    expect(final).to.be.gt(initial);
  });

  it("Should revert if amountBDesired is zero", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    console.log(deadline);
    it("Should revert if amountBDesired is zero", async () => {
      const deadline = Math.floor(Date.now() / 1000) + 1000;

      await expect(
        swap.addLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          100, // amountADesired > 0
          0, // amountBDesired == 0
          90, // amountAMin valid
          1, // amountBMin low but > 0
          owner.address,
          deadline,
          { gasLimit: GAS_LIMIT },
        ),
      ).to.be.revertedWith("SS:INB");
    });
  });

  /*
it("Should revert when getPrice is called with zero reserves", async () => {
  const deadline = Math.floor(Date.now() / 1000) + 1000;

  // Fresh pool
  const SwapFactory = await ethers.getContractFactory("SimpleSwap");
  const swap = await SwapFactory.deploy({ gasLimit: GAS_LIMIT });
  await swap.waitForDeployment();

  await tokenA.approve(await swap.getAddress(), 100, { gasLimit: GAS_LIMIT });
  await tokenB.approve(await swap.getAddress(), 100, { gasLimit: GAS_LIMIT });

  // Seed liquidity
  await swap.addLiquidity(
    await tokenA.getAddress(),
    await tokenB.getAddress(),
    100,
    100,
    90,
    90,
    owner.address,
    deadline,
    { gasLimit: GAS_LIMIT }
  );

  // Transfer all tokenA in pool out to simulate drained reserveA
  const poolAddr = await swap.getPool(await tokenA.getAddress(), await tokenB.getAddress());
  const tokenABalance = await tokenA.balanceOf(poolAddr);
  await tokenA.connect(owner).transfer(addr1.address, tokenABalance, { gasLimit: GAS_LIMIT });

  // Now reserveA should be 0, triggering "SS:IL"
  await expect(
    swap.getPrice(await tokenA.getAddress(), await tokenB.getAddress())
  ).to.be.revertedWith("SS:IL");
});
*/

  it("Should revert if recipient address is zero in swap", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const path = [await tokenA.getAddress(), await tokenB.getAddress()];
    await expect(
      swap.swapExactTokensForTokens(100, 90, path, ethers.ZeroAddress, deadline, { gasLimit: GAS_LIMIT }),
    ).to.be.revertedWith("SS:IR");
  });
});
