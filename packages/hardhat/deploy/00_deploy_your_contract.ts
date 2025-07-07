import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
//import { parseEther } from "ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const tokenA = await deploy("TokenA", {
    from: deployer,
    contract: "Token",
    args: [1000, "TokenA", "TOKA"],
    log: true,
  });

  const tokenB = await deploy("TokenB", {
    from: deployer,
    contract: "Token",
    args: [1000, "TokenB", "TOKB"],
    log: true,
  });

  const simpleSwap = await deploy("SimpleSwap", {
    from: deployer,
    contract: "SimpleSwap",
    log: true,
  });

  console.log(simpleSwap.address);

  const swapVerifier = await deploy("SwapVerifier", {
    from: deployer,
    contract: "contracts/SwapVerifier.sol:SwapVerifier",
    log: true,
  });

  const tokenAContract = await ethers.getContractAt("Token", tokenA.address);
  const tokenBContract = await ethers.getContractAt("Token", tokenB.address);

  await tokenAContract.mintTo(swapVerifier.address, 50);
  await tokenBContract.mintTo(swapVerifier.address, 50);
};

export default func;
func.tags = ["SwapVerifier"];
