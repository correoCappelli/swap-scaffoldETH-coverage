import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { AddressInput, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContract, useTransactor } from "~~/hooks/scaffold-eth";

export const AddLiquidityForm = () => {
  const { address } = useAccount();

  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [amountADesired, setAmountADesired] = useState("0.1");
  const [amountBDesired, setAmountBDesired] = useState("0.1");
  const [amountAMin, setAmountAMin] = useState("0.05");
  const [amountBMin, setAmountBMin] = useState("0.05");

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);

  const { data: simpleSwapContract } = useScaffoldContract({ contractName: "SimpleSwap" });
  const writeTxn = useTransactor();

  const handleAddLiquidity = async () => {
    if (!simpleSwapContract?.simulate || !address) return;

    try {
      const { request } = await simpleSwapContract.simulate.addLiquidity([
        tokenA,
        tokenB,
        parseEther(amountADesired),
        parseEther(amountBDesired),
        parseEther(amountAMin),
        parseEther(amountBMin),
        address,
        deadline,
      ]);

      await writeTxn(request);
    } catch (err) {
      console.error("💥 Transaction failed:", err);
    }
  };

  return (
    <div className="p-4 border rounded-xl space-y-4 max-w-xl mx-auto">
      <h2 className="text-lg font-semibold">➕ Add Liquidity</h2>

      <AddressInput value={tokenA} onChange={setTokenA} placeholder="Token A" />
      <AddressInput value={tokenB} onChange={setTokenB} placeholder="Token B" />
      <EtherInput value={amountADesired} onChange={setAmountADesired} placeholder="Amount A Desired" />
      <EtherInput value={amountBDesired} onChange={setAmountBDesired} placeholder="Amount B Desired" />
      <EtherInput value={amountAMin} onChange={setAmountAMin} placeholder="Min Amount A" />
      <EtherInput value={amountBMin} onChange={setAmountBMin} placeholder="Min Amount B" />

      <button className="btn btn-primary" onClick={handleAddLiquidity}>
        ✅ Add Liquidity
      </button>
    </div>
  );
};
