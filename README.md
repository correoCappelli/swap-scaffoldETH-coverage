# 🧮 SimpleSwap Interface Guide

Welcome to the **SimpleSwap** demo! This dApp allows you to swap between two ERC-20 tokens and manage liquidity in a streamlined, user-friendly interface.

🔗 Live Demo: [swap-scaffold-eth-coverage-nextjs.vercel.app](https://swap-scaffold-eth-coverage-nextjs.vercel.app/)

---

## 🚀 Getting Started

1. **Connect Your Wallet**
   - Use MetaMask or WalletConnect to connect your wallet.
   - Make sure you're on the correct network (e.g. Sepolia or your configured testnet).

2. **Mint Tokens to Your Wallet**
   - Use the **TokenA** and **TokenB** panels to call the `mint()` function.
   - Suggested amount: mint **1000 tokens** of each type to start interacting.
   - Make sure the wallet you're using has minting permissions or access to a faucet.

3. **Approve Token Spending**
   - Before swapping, you must approve the SimpleSwap contract to spend your tokens.
   - Use the TokenA and TokenB panels to call `approve()` and set the allowance.

4. **Swap or Manage Liquidity**
   - Once approved, use the SimpleSwap panel to:
     - Swap TokenA for TokenB or vice versa.
     - Add or remove liquidity from the pool.

---

## 🧾 Field Descriptions

### 💼 Wallet Info
- **Connected Wallet:** Displays your wallet address.
- **TokenA Balance:** Shows your current balance of TokenA.
- **TokenB Balance:** Shows your current balance of TokenB.
- **TokenA Allowance:** Amount of TokenA approved for SimpleSwap.
- **TokenB Allowance:** Amount of TokenB approved for SimpleSwap.

### ⏰ Deadline
- **Recommended Deadline (ms):** A dynamic timestamp used to prevent stale transactions.
- This value auto-refreshes every 30 seconds.

---

## 🧪 Contract Panels

### 🔗 TokenA & TokenB Panels
- Functions:
  - `mint()`: Mints tokens to your connected wallet.
  - `allowance()`: Checks how many tokens you’ve approved for spending.
  - `approve()`: Authorizes SimpleSwap to spend your tokens.

### 🧮 SimpleSwap Panel

#### 🔹 `addLiquidity()` Function

This function allows you to deposit TokenA and TokenB into the liquidity pool. You’ll receive LP tokens representing your share.

**Required Fields:**

| Field         | Description                                                                 |
|---------------|-----------------------------------------------------------------------------|
| `tokenA`      | Address of TokenA contract. Use the deployed address shown in the UI.       |
| `tokenB`      | Address of TokenB contract. Use the deployed address shown in the UI.       |
| `amountA`     | Amount of TokenA to deposit (in whole units, e.g. `1000`).                  |
| `amountB`     | Amount of TokenB to deposit (e.g. `1000`).                                  |
| `to`          | Your wallet address (where LP tokens will be sent).                         |
| `deadline`    | A future timestamp in milliseconds. Use the auto-generated value in the UI. |

**Example Input:**
```json
{
  "tokenA": "0xYourTokenAAddress",
  "tokenB": "0xYourTokenBAddress",
  "amountA": "1000",
  "amountB": "1000",
  "to": "0xYourWalletAddress",
  "deadline": "1720450000000"
}
```
### 🧮 SimpleSwap hardhat COVERAGE

```javascript

hpenvy14@hpenvy14-HP-ENVY-14-Notebook-PC:~/eth-kipu/modulo4-TP/scaffold-app/scaffold-app-1/packages/hardhat$ npx hardhat coverage

Version
=======
> solidity-coverage: v0.8.16

Instrumenting for coverage...
=============================

> ISimpleSwap.sol
> MockFailToken.sol
> SimpleSwap.sol
> SwapVerifier.sol
> TestSort.sol
> Token.sol

Compilation:
============

Nothing to compile
No need to generate any newer typings.

Network Info
============
> HardhatEVM: v2.22.19
> network:    hardhat



  SimpleSwap
    ✔ Should add liquidity and emit LiquidityAdded (175ms)
    ✔ Should get reserves
    ✔ Should get price
    ✔ Should get liquidity balance
    ✔ Should return zero liquidity for unused address
    ✔ Should swap tokens and emit Swap (215ms)
    ✔ Should remove liquidity and emit LiquidityRemoved (125ms)
    ✔ Should revert on invalid swap path (49ms)
    ✔ Should revert on expired deadline
    ✔ Should revert if tokenA equals tokenB
    ✔ Should revert if amountADesired is zero
    ✔ Should calculate correct output using getAmountOut
    ✔ Should revert when getting reserves from uninitialized pool (122ms)
    ✔ Should trigger sqrt logic during first liquidity provision (246ms)
    ✔ Should revert if amountBMin is too high (207ms)
    ✔ Should revert if amountAMin is too high (85ms)
    ✔ Should revert if getAmountOut called with zero input (39ms)
    ✔ Should revert if getAmountOut called with zero reserves (40ms)
    ✔ Should revert if _update causes overflow (102ms)
    ✔ Should sort tokens correctly (164ms)
    ✔ Should revert if removeLiquidity slippage fails (105ms)
    ✔ Should revert if removeLiquidity called with zero address (47ms)
    ✔ Should revert if addLiquidity called with zero token address
    ✔ Should revert if removeLiquidity with insufficient LP balance (50ms)
    ✔ Should revert if removeLiquidity called with zero liquidity amount
1751915900
    ✔ Should revert if liquidityMinted is zero (163ms)
    ✔ Should revert if swap uses zero address in path (38ms)
    ✔ Should revert if removeLiquidity on empty pool (98ms)
    ✔ Should revert on failed safeTransferFrom using MockFailToken (150ms)
    ✔ Should fallback to forceApprove when approve returns false (125ms)
    ✔ Should revert if getAmountOut rounds to zero
    ✔ Should revert swap with zero reserves (95ms)
    ✔ Should increase liquidity balance after addLiquidity (179ms)
1751915901
    ✔ Should revert if amountBDesired is zero
    ✔ Should revert if recipient address is zero in swap

  Token
    ✔ Should initialize with correct name and symbol
    ✔ Should mint initial supply to deployer
    ✔ Should return correct balance from getBalanceOf()
    ✔ Should mint tokens via receive() fallback
Transferring 10 tokens from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 to 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
    ✔ Should mint tokens using mintTo() (51ms)


  40 passing (4s)

--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts/         |    65.81 |    52.78 |    56.82 |    69.39 |                |
  ISimpleSwap.sol   |      100 |      100 |      100 |      100 |                |
  MockFailToken.sol |    11.11 |      100 |    11.11 |    11.11 |... 28,32,36,40 |
  SimpleSwap.sol    |    78.33 |    60.66 |    65.52 |    80.38 |... 58,859,1000 |
  SwapVerifier.sol  |        0 |        0 |        0 |        0 |... 170,172,175 |
  TestSort.sol      |      100 |       50 |      100 |      100 |                |
  Token.sol         |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
All files           |    65.81 |    52.78 |    56.82 |    69.39 |                |
--------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json

```






