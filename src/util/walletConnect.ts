import util from "./utils";
import Web3 from 'web3';
// import { METAMASK, METAMASK_APP } from "./constants";

const walletTypeCache = "WALLET_TYPE_CACHE";

let isBraveWallet = false;

interface IWallet {
  walletType: string;
  walletAddress: string;
  networkId: string | number;
  provider: any;
  web3: Web3;
}

// localstore
export const walletInfo: IWallet = {
  walletType: '',
  walletAddress: '',
  networkId: '',
  provider: window.ethereum,
  web3: new Web3()
};

function initWalletType() {
  walletInfo.walletType = localStorage.getItem(walletTypeCache) || METAMASK;
}

function initProvider(walletType = walletInfo.walletType) {
  const isProvider = (ethereum) => {
    if (!walletType || !ethereum) return false;
    if (walletType === METAMASK)
      return ethereum.isMetaMask && !isBraveWallet;
    if (walletType === TALLYHO) return ethereum.isTally;
    if (walletType === COINBASE) return ethereum.isCoinbaseWallet;
    if (walletType === BRAVE) return isBraveWallet;
    if (walletType === BRAVE_APP) return isBraveWallet;
    if (walletType === IM_TOKEN_APP) return ethereum.isImToken;
    if (walletType === METAMASK_APP) return ethereum.isMetaMask;
    if (walletType === TOKEN_POCKET_APP) return ethereum.isTokenPocket;
    if (walletType === BIT_KEEP_APP) return 'isBitKeepChrome' in ethereum;
    if (walletType === COINBASE_APP)
      return ethereum.isCoinbaseBrowser && ethereum.isCoinbaseWallet;
    if (walletType === BLOCKWALLET) return ethereum.isBlockWallet;
    if (walletType === OKXWALLET) return ethereum.isOkxWallet;
  };
  if (walletType === OKXWALLET && typeof window.okxwallet !== 'undefined') {
    walletInfo.provider = window.okxwallet;
  } else if (window?.ethereum?.providers && window.ethereum.providers.find(provider => provider.isCoinbaseWallet === true)) {
    walletInfo.provider = window.ethereum.providers.find(isProvider);
  } else {
    if (isProvider(window.ethereum)) {
      walletInfo.provider = window.ethereum;
    }
  }
}

export async function connectWallet(type) {
  localStorage.setItem(walletTypeCache, type);
  return await initWallet();
}

export function disconnectWallet(): IWallet {
  localStorage.setItem(walletTypeCache, '');
  walletInfo.walletType = '';
  walletInfo.walletAddress = '';
  walletInfo.networkId = '';
  walletInfo.provider = window.ethereum;
  walletInfo.web3 = new Web3();
  return walletInfo;
}

export async function initWallet(): Promise<{ code: number, msg: string, wallet?: IWallet }> {
  initWalletType();
  initProvider();
  const { walletType, provider } = walletInfo;
  try {
    await provider.enable();
  } catch (e) {
    return { code: 1, msg: e.message };
  }
  const web3Provider = new Web3(provider);
  walletInfo.web3 = web3Provider;
  let networkId, walletAddress;
  if (provider.request) {
    networkId = await provider.request({
      method: 'net_version',
    });
    walletAddress = await provider.request({
      method: 'eth_accounts',
    });
  } else {
    networkId = await (<any>web3Provider.eth).request({
      method: 'net_version ',
    });
    walletAddress = await (<any>web3Provider.eth).request({
      method: 'eth_accounts',
    });
  }

  if (!networkId) {
    return { code: 1, msg: 'Failed to get network ID, please try again later' };
  } else {
    if (walletType === METAMASK_APP) networkId = parseInt(networkId, 16);
    walletInfo.networkId = networkId;
  }
  if (!walletAddress || !walletAddress.length) {
    return { code: 1, msg: `Failed to get the wallet address, please unlock the ${walletType} wallet or create a new wallet address` };
  } else {
    walletInfo.walletAddress = walletAddress[0];
  }
  return { code: 0, msg: 'connect success', wallet: walletInfo };
}

export async function ensureWalletNetwork() {
  const switchParams = {
    chainId: '0x' + Number(324).toString(16),
  };
  try {
    await walletInfo.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [switchParams],
    });
    await initWallet();
  } catch (error) {
    if (error.code === 4902) {
      throw new Error('Please add your zkera network first');
    } else {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

export async function supportWalletList() {
  const walletList: string[] = [];
  const { ethereum } = window;
  if (ethereum.isMetaMask) walletList.push(METAMASK);
  if (typeof window.okxwallet !== 'undefined') walletList.push(OKXWALLET);
  if ((<any>window.navigator).brave) walletList.push(BRAVE);
  return walletList;
}


export const METAMASK = 'MetaMask' // metamask wallet constant
export const TALLYHO = 'TallyHo' // tally wallet constant
export const BLOCKWALLET = 'BlockWallet' // BlockWallet wallet constant
export const WALLETCONNECT = 'WalletConnect' // walletConnect wallet constant
export const COINBASE = 'Coinbase' // coinbase wallet constant
export const BRAVE = 'Brave' // brave wallet constant
export const OKXWALLET = 'OKXWallet' // okx wallet constant
export const IM_TOKEN_APP = 'imTokenApp' // imToken app name
export const BIT_KEEP_APP = 'bitKeepApp' // bitKeep app name
export const COINBASE_APP = 'coinbaseApp' // coinbase app name
export const METAMASK_APP = 'metamaskApp' // metamask app name
export const TOKEN_POCKET_APP = 'tokenPocketApp' // token pocket app name
export const LOCALLOGINDATA = 'localLoginData' // mainly used in localStorage for store the information if any wallets have been logged in
export const BRAVE_APP = 'braveApp' // brave wallet constant
