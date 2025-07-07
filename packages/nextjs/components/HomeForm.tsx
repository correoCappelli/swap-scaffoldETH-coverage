import { useState } from "react";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { FormSimpleSwap } from "~~/components/FormSimpleSwap";
import { EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContract, useTransactor } from "~~/hooks/scaffold-eth";

// 👈 import your swap form

const TOKEN_A = "0xa6Af3844C1e1A79E6B6685A78Ebd407829caacEC";
const TOKEN_B = "0x2C0b7dB6C07ed8fc3d4563769856cF16824649aE";
const SIMPLE_SWAP = "0xBa159fD9225EBd8F799570a9BF22034D0ddB06B8";

export const HomeForm = () => {
  const { address } = useAccount();
  const writeTxn = useTransactor();

  const { data: tokenAContract } = useScaffoldContract({ contractName: "TokenA" });
  const { data: tokenBContract } = useScaffoldContract({ contractName: "TokenB" });

  const [amountToApproveA, setAmountToApproveA] = useState("10");
  const [amountToApproveB, setAmountToApproveB] = useState("10");

  const isWholeNumber = (value: string) => /^\d+$/.test(value);
  const parseTokenAmount = (value: string) => BigInt(value);

  const approveToken = async (tokenContract: any, amount: string, label: string, tokenAddress: `0x${string}`) => {
    if (!tokenContract?.abi || !address || !isWholeNumber(amount)) {
      console.warn(`⚠️ Invalid approve data for ${label}`);
      return;
    }

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

    console.debug(`🚀 Approving ${label} Request`, request);
    await writeTxn(request);
    console.info(`✅ ${label} approved`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-10">
      <h2 className="text-xl font-bold">🔓 Approve Tokens</h2>

      <div className="space-y-4">
        <div>
          <EtherInput
            value={amountToApproveA}
            onChange={setAmountToApproveA}
            placeholder="Amount to approve for TokenA"
          />
          <button
            className="btn btn-primary w-full mt-2"
            onClick={() => approveToken(tokenAContract, amountToApproveA, "TokenA", TOKEN_A)}
          >
            Approve TokenA ×10
          </button>
        </div>

        <div>
          <EtherInput
            value={amountToApproveB}
            onChange={setAmountToApproveB}
            placeholder="Amount to approve for TokenB"
          />
          <button
            className="btn btn-primary w-full mt-2"
            onClick={() => approveToken(tokenBContract, amountToApproveB, "TokenB", TOKEN_B)}
          >
            Approve TokenB ×10
          </button>
        </div>
      </div>

      <hr />

      <h2 className="text-xl font-bold">🧮 SimpleSwap Interaction</h2>
      <p className="text-gray-500 mb-2">Use the form below to add liquidity or swap tokens after approval.</p>

      <FormSimpleSwap />
    </div>
  );
};
