// import { getInstalledWallet } from "orbiter-wallet";

interface ITx {
  recipient: string;
  value: string
}

export async function starknetTransfer(tokenAddress: string, params: ITx) {
  // const wallet = (getInstalledWallet())[0];
  // return (await wallet.send({ ...params, tokenAddress })).hash;
  return null
}
