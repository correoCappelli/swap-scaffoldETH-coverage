import { useState } from "react";
import { encodeFunctionData, formatUnits } from "viem";
import { useAccount } from "wagmi";
import { EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContract, useTransactor } from "~~/hooks/scaffold-eth";

const TOKEN_A = "0xa6Af3844C1e1A79E6B6685A78Ebd407829caacEC";
const TOKEN_B = "0x2C0b7dB6C07ed8fc3d4563769856cF16824649aE";
const SIMPLE_SWAP = "0xBa159fD9225EBd8F799570a9BF22034D0ddB06B8";

export const FormSimpleSwap = () => {
  const { address } = useAccount();
  const writeTxn = useTransactor();

  const { data: simpleSwapContract } = useScaffoldContract({ contractName: "SimpleSwap" });
  const { data: tokenAContract } = useScaffoldContract({ contractName: "TokenA" });
  const { data: tokenBContract } = useScaffoldContract({ contractName: "TokenB" });

  const [amountADesired, setAmountADesired] = useState("10");
  const [amountBDesired, setAmountBDesired] = useState("10");
  const [amountInSwap, setAmountInSwap] = useState("1");
  const [amountOutMinSwap, setAmountOutMinSwap] = useState("1");
  const [isApprovingA, setIsApprovingA] = useState(false);
  const [isApprovingB, setIsApprovingB] = useState(false);

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 6000);
  const isWholeNumber = (value: string) => /^\d+$/.test(value);
  const parseTokenAmount = (value: string) => BigInt(value);

  const approveToken = async (tokenContract: any, amount: string, label: string, tokenAddress: `0x${string}`) => {
    if (!tokenContract?.abi || !address || !isWholeNumber(amount)) {
      console.warn(`⚠️ Invalid approve data for ${label}`);
      return;
    }

    try {
      // 🔁 Approve 10x the input amount to prevent allowance errors
      const scaledAmount = parseTokenAmount(amount) * 10n;

      const request = {
        to: tokenAddress,
        from: address,
        data: encodeFunctionData({
          abi: tokenContract.abi,
          functionName: "approve",
          args: [SIMPLE_SWAP, scaledAmount],
        }),
        value: BigInt(0),
      };

      console.debug(`🚀 Approving ${label} with amount ${scaledAmount.toString()}`);
      await writeTxn(request);
      console.info(`✅ ${label} approved`);
    } catch (err: any) {
      console.error(`💥 ${label} approval failed:`, err?.message || err);
    }
  };

  const handleApproveA = async () => {
    if (!tokenAContract) {
      console.warn("⛔ TokenA contract is not ready.");
      return;
    }
    setIsApprovingA(true);
    await approveToken(tokenAContract, amountADesired, "TokenA", TOKEN_A);
    setIsApprovingA(false);
  };

  const handleApproveB = async () => {
    if (!tokenBContract) {
      console.warn("⛔ TokenB contract is not ready.");
      return;
    }
    setIsApprovingB(true);
    await approveToken(tokenBContract, amountBDesired, "TokenB", TOKEN_B);
    setIsApprovingB(false);
  };

  const handleAddLiquidity = async () => {
    if (!simpleSwapContract?.simulate || !tokenAContract?.read || !tokenBContract?.read || !address) {
      console.warn("⛔ Required contract or address missing");
      return;
    }

    if (!isWholeNumber(amountADesired) || !isWholeNumber(amountBDesired)) {
      console.warn("⚠️ Liquidity amounts must be whole tokens");
      return;
    }

    const amountA = parseTokenAmount(amountADesired);
    const amountB = parseTokenAmount(amountBDesired);

    try {
      const [allowanceA, balanceA] = await Promise.all([
        tokenAContract.read.allowance([address, SIMPLE_SWAP]),
        tokenAContract.read.balanceOf([address]),
      ]);
      const [allowanceB, balanceB] = await Promise.all([
        tokenBContract.read.allowance([address, SIMPLE_SWAP]),
        tokenBContract.read.balanceOf([address]),
      ]);

      console.log("🔍 TokenA balance:", formatUnits(balanceA, 0));
      console.log("🔍 TokenB balance:", formatUnits(balanceB, 0));
      console.log("🔍 TokenA allowance:", formatUnits(allowanceA, 0));
      console.log("🔍 TokenB allowance:", formatUnits(allowanceB, 0));

      if (allowanceA < amountA) {
        console.warn("⚠️ TokenA allowance is too low—please approve first");
        return;
      }

      if (allowanceB < amountB) {
        console.warn("⚠️ TokenB allowance is too low—please approve first");
        return;
      }

      if (balanceA < amountA || balanceB < amountB) {
        console.warn("⚠️ Insufficient token balance");
        return;
      }

      const args = [TOKEN_A, TOKEN_B, amountA, amountB, BigInt(1), BigInt(1), address, deadline] as const;

      const { request } = await simpleSwapContract.simulate.addLiquidity(args);
      console.debug("🚀 addLiquidity request", request);
      await writeTxn(request);
      console.info("✅ Liquidity added");
    } catch (err: any) {
      console.error("💥 addLiquidity failed:", err?.message || err);
    }
  };

  const handleTokenSwap = async () => {
    if (!simpleSwapContract?.simulate || !address) return;

    if (!isWholeNumber(amountInSwap) || !isWholeNumber(amountOutMinSwap)) {
      console.warn("⚠️ Swap values must be whole tokens");
      return;
    }

    const args = [
      parseTokenAmount(amountInSwap),
      parseTokenAmount(amountOutMinSwap),
      [TOKEN_A, TOKEN_B] as const,
      address,
      deadline,
    ] as const;

    try {
      const { request } = await simpleSwapContract.simulate.swapExactTokensForTokens(args);
      console.debug("🚀 swapExactTokensForTokens request", request);
      await writeTxn(request);
      console.info("✅ Tokens swapped");
    } catch (err: any) {
      console.error("💥 Swap failed:", err?.message || err);
    }
  };

  return (
    <div className="p-4 border rounded-xl space-y-6 max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-2">🧮 Sepolia Contract Interaction</h2>

      <div className="text-sm">
        <p>
          🔗 <strong>Token A</strong>: {TOKEN_A}
        </p>
        <p>
          🔗 <strong>Token B</strong>: {TOKEN_B}
        </p>
        <p>
          🔗 <strong>SimpleSwap</strong>: {SIMPLE_SWAP}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">🔓 Approve Tokens</h3>
        <button
          className={`btn btn-secondary ${isApprovingA ? "opacity-50" : ""}`}
          disabled={isApprovingA}
          onClick={handleApproveA}
        >
          {isApprovingA ? "Approving TokenA..." : `Approve TokenA for ${amountADesired}`}
        </button>
        <button
          className={`btn btn-secondary ${isApprovingB ? "opacity-50" : ""}`}
          disabled={isApprovingB}
          onClick={handleApproveB}
        >
          {isApprovingB ? "Approving TokenB..." : `Approve TokenB for ${amountBDesired}`}
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">➕ Add Liquidity</h3>
        <EtherInput value={amountADesired} onChange={setAmountADesired} placeholder="Token A (whole units)" />
        <EtherInput value={amountBDesired} onChange={setAmountBDesired} placeholder="Token B (whole units)" />
        <button className="btn btn-primary" onClick={handleAddLiquidity}>
          Add Liquidity
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">🔁 Swap Tokens</h3>
        <EtherInput value={amountInSwap} onChange={setAmountInSwap} placeholder="Swap In (whole units)" />
        <EtherInput value={amountOutMinSwap} onChange={setAmountOutMinSwap} placeholder="Min Output (whole units)" />
        <button className="btn btn-primary" onClick={handleTokenSwap}>
          Swap Tokens
        </button>
      </div>
    </div>
  );
};
