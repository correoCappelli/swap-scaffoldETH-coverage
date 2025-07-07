"use client";

import { useEffect, useState } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { ContractUI } from "~~/components/scaffold-eth";

const TOKEN_A = "0xa6Af3844C1e1A79E6B6685A78Ebd407829caacEC";
const TOKEN_B = "0x2C0b7dB6C07ed8fc3d4563769856cF16824649aE";
const SIMPLE_SWAP = "0xBa159fD9225EBd8F799570a9BF22034D0ddB06B8";

const ERC20_ABI = [
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "amount", type: "uint256" }],
  },
];

export default function Home() {
  const { address: userAddress } = useAccount();
  const [deadlineMs, setDeadlineMs] = useState(Date.now() + 100 * 60 * 1000);

  const { data: balanceA } = useBalance({ address: userAddress, token: TOKEN_A });
  const { data: balanceB } = useBalance({ address: userAddress, token: TOKEN_B });

  const { data: allowanceA } = useReadContract({
    address: TOKEN_A,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [userAddress, SIMPLE_SWAP],
  });

  const { data: allowanceB } = useReadContract({
    address: TOKEN_B,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [userAddress, SIMPLE_SWAP],
  });

  useEffect(() => {
    const refreshDeadline = setInterval(() => {
      setDeadlineMs(Date.now() + 100 * 60 * 1000);
    }, 30000);
    return () => clearInterval(refreshDeadline);
  }, []);

  return (
    <div className="p-6 space-y-10">
      <section className="bg-gray-900 p-6 rounded-lg space-y-4">
        <h2 className="text-3xl font-bold text-white">📘 How to Try SimpleSwap</h2>
        <ul className="list-disc list-inside text-white font-bold text-lg space-y-2">
          <li>Connect your wallet via MetaMask or WalletConnect.</li>
          <li>Make sure you hold TokenA and TokenB on the same network.</li>
          <li>Use the TokenA and TokenB contract panels below to approve spending.</li>
          <li>Once approved, use the SimpleSwap panel to swap or add/remove liquidity.</li>
        </ul>

        <div className="text-white text-lg font-bold flex items-center gap-2">
          💼 Connected Wallet: <Address address={userAddress} />
        </div>

        <div className="text-white text-lg font-bold">
          ⏰ Recommended Deadline (ms): <span className="font-mono">{deadlineMs}</span>
        </div>

        <div className="text-white text-lg font-bold">
          🪙 TokenA Balance: <span className="font-mono">{balanceA?.formatted ?? "..."}</span>
        </div>

        <div className="text-white text-lg font-bold">
          🪙 TokenB Balance: <span className="font-mono">{balanceB?.formatted ?? "..."}</span>
        </div>

        <div className="text-white text-lg font-bold">
          ✅ TokenA Allowance: <span className="font-mono">{allowanceA?.toString() ?? "..."}</span>
        </div>

        <div className="text-white text-lg font-bold">
          ✅ TokenB Allowance: <span className="font-mono">{allowanceB?.toString() ?? "..."}</span>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">🧮 SimpleSwap Interaction</h2>
        <ContractUI contractName="SimpleSwap" />
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">🔗 TokenA Contract</h3>
        <p className="text-sm text-gray-500 mb-2">Address: {TOKEN_A}</p>
        <ContractUI contractName="TokenA" />
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">🔗 TokenB Contract</h3>
        <p className="text-sm text-gray-500 mb-2">Address: {TOKEN_B}</p>
        <ContractUI contractName="TokenB" />
      </section>
    </div>
  );
}
