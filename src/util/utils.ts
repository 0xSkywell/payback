import { ethers } from "ethers";
import * as RLP from 'rlp';
import { Buffer } from "buffer";
import { XVM_ABI } from './abi';

export default {
  transferEncodeABI(address: string, value: string) {
    const ifa = new ethers.utils.Interface(XVM_ABI);
    // const bufferList = [Buffer.from(tradeId), op + ''];
    // const encoded = RLP.encode(bufferList);
    return ifa.encodeFunctionData('forward', [
      address,
      value
    ]);
  },
  swapOkEncodeABI(tradeId: string, token: string, toAddress: string, toValue: string, op: number) {
    const ifa = new ethers.utils.Interface(XVM_ABI);
    const bufferList = [Buffer.from(tradeId), op + ''];
    const encoded = RLP.encode(bufferList);
    return ifa.encodeFunctionData('swapAnswer', [
      toAddress,
      token,
      toValue,
      encoded
    ]);
  },
  showMessage(message, type) {
    // const _type = type || 'success';
    // Notification[_type]({
    //   message,
    //   dangerouslyUseHTMLString: true,
    //   duration: 3000,
    // });
    throw new Error(message);
  },
  shortAddress(address) {
    if (address && address.length > 12) {
      const subStr1 = address.substr(0, 6);
      const subStr2 = address.substr(address.length - 6, 6);
      return subStr1 + '...' + subStr2;
    }
    return address;
  },
  starknetAddressFormat(address) {
    if (address.length < 66) {
      const end = address.substring(2, address.length);
      const add = 64 - end.length;
      let addStr = '';
      for (let i = 0; i < add; i++) {
        addStr += "0";
      }
      address = '0x' + addStr + end;
    }
    return address;
  }
};

