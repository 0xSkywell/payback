export const OBAggregator = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "tos",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "name": "aggregate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "widthdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

export const XVM_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "maker", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  }, {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "address", "name": "maker", "type": "address" }, {
      "indexed": true,
      "internalType": "bool",
      "name": "enable",
      "type": "bool"
    }],
    "name": "ChangeMaker",
    "type": "event"
  }, {
    "anonymous": false,
    "inputs": [{
      "indexed": true,
      "internalType": "address",
      "name": "previousOwner",
      "type": "address"
    }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }],
    "name": "OwnershipTransferred",
    "type": "event"
  }, {
    "inputs": [{ "internalType": "address", "name": "maker", "type": "address" }, {
      "internalType": "bool",
      "name": "enable",
      "type": "bool"
    }], "name": "changeMaker", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  }, {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "getMaker",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }, {
    "inputs": [{ "internalType": "bytes[]", "name": "data", "type": "bytes[]" }],
    "name": "multicall",
    "outputs": [{ "internalType": "bytes[]", "name": "results", "type": "bytes[]" }],
    "stateMutability": "payable",
    "type": "function"
  }, {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }, {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }, {
    "inputs": [{
      "internalType": "address payable",
      "name": "recipient",
      "type": "address"
    }, { "internalType": "address", "name": "token", "type": "address" }, {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }, { "internalType": "bytes", "name": "data", "type": "bytes" }],
    "name": "swap",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }, {
    "inputs": [{
      "internalType": "address payable",
      "name": "recipient",
      "type": "address"
    }, { "internalType": "address", "name": "token", "type": "address" }, {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }, { "internalType": "bytes", "name": "data", "type": "bytes" }],
    "name": "swapAnswer",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }, {
    "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }, {
    "inputs": [{ "internalType": "address", "name": "token", "type": "address" }],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }, { "stateMutability": "payable", "type": "receive" }];

export const OrbiterAggregator = [{
  "inputs": [{ "internalType": "bytes", "name": "data", "type": "bytes" }],
  "name": "transfer",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}];
