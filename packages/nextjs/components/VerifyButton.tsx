"use client";

import { useState } from "react";
//import { useEffect } from "react";
import deployedContracts from "../contracts/deployedContracts";
//import { estimateSwapOut } from "../utils/scaffold-eth/calculateSwapOut";
import { ethers } from "ethers";
import { parseUnits } from "viem";
import { useWalletClient } from "wagmi";

type VerifyButtonProps = {
  amountA: string;
  amountB: string;
  minAmountOut: string;
  author: string;
};

export const VerifyButton = ({ amountA, amountB, minAmountOut, author }: VerifyButtonProps) => {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [storedAuthor, setStoredAuthor] = useState<string | null>(null);

  const [reserves, setReserves] = useState<[bigint, bigint] | null>(null);
  console.log(reserves);
  console.log(setReserves);

  const handleVerify = async () => {
    if (!walletClient) {
      setError("Please connect your wallet.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      const contracts = (deployedContracts as Record<number, any>)[chainId];
      if (!contracts) {
        throw new Error(`No deployed contracts found for chain ID ${chainId}`);
      }

      const verifier = new ethers.Contract(contracts.SwapVerifier.address, contracts.SwapVerifier.abi, signer);

      const tx = await verifier.verify(
        contracts.SimpleSwap.address,
        contracts.TokenA.address,
        contracts.TokenB.address,
        parseUnits(amountA, 0), // Assuming amountA is in whole units
        parseUnits(amountB, 0),
        parseUnits(minAmountOut, 0),
        author,
      );

      setTxHash(tx.hash);
      await tx.wait();

      const storedAuthor = await verifier.authors(0);
      setStoredAuthor(storedAuthor);
      console.log("Author stored in contract:", storedAuthor);
    } catch (err: any) {
      console.error("Verification failed:", err);
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-sm">
      <button className="btn btn-primary w-full" onClick={handleVerify} disabled={loading}>
        {loading ? "⏳ Verifying..." : "🔍 Run verify()"}
      </button>

      {txHash && (
        <>
          <p className="text-green-500 break-words">✅ Tx: {txHash}</p>
          {storedAuthor && <p className="text-sm text-gray-500">📝 Author at index [0]: {storedAuthor}</p>}
        </>
      )}

      {error && <p className="text-red-500">⚠️ {error}</p>}
    </div>
  );
};
