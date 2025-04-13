'use client'

import { useState } from 'react'
import { ethers } from 'ethers'

// TEA Sepolia Network Configuration
const TEA_SEPOLIA_CONFIG = {
  chainId: '0x27ea', // 10218 in hex
  chainName: 'TEA Sepolia Testnet',
  nativeCurrency: {
    name: 'TEA',
    symbol: 'TEA',
    decimals: 18
  },
  rpcUrls: [
    'https://tea-sepolia.g.alchemy.com/public'
  ],
  blockExplorerUrls: ['https://sepolia.teascan.xyz/']
}

// Contract configuration
const CONTRACT_ADDRESS = "0xDA07539b1a6CCaa0aF22ddE194717e532d58AD3e";
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_message",
        "type": "string"
      }
    ],
    "name": "flex",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Flexed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "sayHello",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
];

export default function TeaFlexDApp() {
  const [state, setState] = useState({
    loading: false,
    error: null,
    txHash: null
  })

  const handleFlex = async () => {
    setState(prev => ({ ...prev, loading: true, error: null, txHash: null }))

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask")
      }

      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      if (chainId !== TEA_SEPOLIA_CONFIG.chainId) {
        throw new Error("Please switch to TEA Sepolia network")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      const tx = await contract.flex("Flexing with TEA!")
      setState(prev => ({ ...prev, txHash: tx.hash }))

      await tx.wait()
      setState(prev => ({ ...prev, loading: false }))

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.reason || error.message || "Transaction failed"
      }))
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-4 flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <img 
            src="https://sepolia.app.tea.xyz/images/logo.svg" 
            alt="TEA Logo" 
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold">Tea Flex</h1>
        </div>
        <p className="text-sm text-gray-400">Don't stop, just flex with tea.</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <button
          onClick={handleFlex}
          disabled={state.loading}
          className={`w-full py-2 px-4 rounded bg-green-500 hover:bg-green-600 text-white`}
        >
          {state.loading ? 'Processing...' : '☕️ Flex Now'}
        </button>

        {state.txHash && (
          <div className="bg-gray-800 p-2 rounded text-xs break-all">
            <p className="text-blue-400">Transaction Hash:</p>
            <a 
              href={`https://sepolia.teascan.xyz/tx/${state.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {state.txHash}
            </a>
          </div>
        )}

        {state.error && (
          <p className="mt-2 text-red-400 text-center">
            {state.error}
          </p>
        )}
      </div>

      {/* === Footer === */}
      <div className="text-xs mt-8 opacity-70 text-center transition-all hover:opacity-100">
        <p>
          Contract address:{' '}
          <a
            href={`https://sepolia.tea.xyz/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            className="text-blue-400"
          >
            {CONTRACT_ADDRESS}
          </a>
        </p>        
        <p className="mt-6">
        Made by{' '}
        <a
          href="https://github.com/molodoyf"
          target="_blank"
          className="underline hover:text-pink-400"
        >
          molodoyf
        </a>
        </p>
      </div>
    </div>
  )
}
