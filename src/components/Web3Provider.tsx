import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  // Connection state
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  
  // Contract interaction
  contract: ethers.Contract | null;
  contractAddress: string | null;
  
  // Connection methods
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
  
  // Loading states
  isConnecting: boolean;
  isTransacting: boolean;
  
  // Connection attempt tracking
  hasAttemptedConnection: boolean;
  connectionRejected: boolean;
  
  // Auto-connection control
  autoConnectAttempted: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Safe environment variable access
const getEnvVar = (key: string, defaultValue: string = '') => {
  try {
    // Try different environment variable patterns
    if (typeof window !== 'undefined' && (window as any).__ENV__?.[key]) {
      return (window as any).__ENV__[key];
    }
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return process.env[key];
    }
    if (typeof import.meta !== 'undefined' && import.meta.env?.[key]) {
      return import.meta.env[key];
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
};

// Contract configuration with safe environment access
const CONTRACT_CONFIG = {
  // Default to a placeholder address - update this after deployment
  address: getEnvVar('REACT_APP_CONTRACT_ADDRESS', '0x0000000000000000000000000000000000000000'), 
  abi: [
    "function mint(uint256 quantity) external payable",
    "function lowCostMint(uint256 quantity) external payable",
    "function totalMinted() external view returns (uint256)",
    "function mintPrice() external view returns (uint256)",
    "function lowCostPrice() external view returns (uint256)",
    "function mintingActive() external view returns (bool)",
    "function lowCostMintActive() external view returns (bool)",
    "function mintedByAddress(address addr) external view returns (uint256)",
    "function lowCostMintedByAddress(address addr) external view returns (uint256)",
    "function remainingLowCostMints(address addr) external view returns (uint256)",
    "function remainingRegularMints(address addr) external view returns (uint256)",
    "function getHolders() external view returns (address[])",
    "function getHolderTokens(address holder) external view returns (uint256[])",
    "function getTotalHolders() external view returns (uint256)",
    "function isHolderAddress(address addr) external view returns (bool)",
    "function balanceOf(address owner) external view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
    "function tokenURI(uint256 tokenId) external view returns (string)",
    "function ownerOf(uint256 tokenId) external view returns (address)",
    "function totalSupply() external view returns (uint256)",
    "function MAX_SUPPLY() external view returns (uint256)",
    "function MAX_PER_WALLET() external view returns (uint256)",
    "function lowCostMintLimit() external view returns (uint256)",
    "event TokenMinted(address indexed to, uint256 tokenId, bool isLowCost)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
  ]
};

// Supported networks
const SUPPORTED_NETWORKS = {
  1: 'Ethereum Mainnet',
  11155111: 'Sepolia Testnet',
  137: 'Polygon',
  80001: 'Mumbai Testnet'
};

const DEFAULT_CHAIN_ID = 11155111; // Sepolia testnet for development

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);
  const [connectionRejected, setConnectionRejected] = useState(false);
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);

  // Enhanced user rejection detection
  const isUserRejectionError = (error: any): boolean => {
    if (!error) return false;
    
    const errorMsg = error.message?.toLowerCase() || '';
    const errorCode = error.code;
    
    return (
      errorCode === 4001 ||
      errorCode === 'ACTION_REJECTED' ||
      errorMsg.includes('user rejected') ||
      errorMsg.includes('user denied') ||
      errorMsg.includes('user cancelled') ||
      errorMsg.includes('cancelled by user') ||
      errorMsg.includes('rejected by user') ||
      errorMsg.includes('request rejected') ||
      errorMsg.includes('user abort') ||
      errorMsg.includes('user cancel') ||
      errorMsg.includes('metamask tx signature') ||
      errorMsg.includes('transaction was rejected')
    );
  };

  // Clear error function
  const clearError = () => {
    setError(null);
    setConnectionRejected(false);
  };

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  // Initialize contract
  const initializeContract = (providerInstance: ethers.providers.Web3Provider, signerInstance: ethers.Signer) => {
    try {
      // Check if we have a valid contract address
      if (!CONTRACT_CONFIG.address || CONTRACT_CONFIG.address === '0x0000000000000000000000000000000000000000') {
        console.log('ℹ️ No contract address configured. Smart contract features will be disabled.');
        return null;
      }

      const contractInstance = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        signerInstance
      );
      setContract(contractInstance);
      return contractInstance;
    } catch (err) {
      console.log('⚠️ Failed to initialize contract:', err);
      // Don't set error for contract initialization failures
      return null;
    }
  };

  // Enhanced error handling for MetaMask errors with complete suppression of user rejections
  const handleWalletError = (err: any, suppressError = false, context = 'general') => {
    console.log(`🔍 Handling wallet error in ${context}:`, {
      error: err,
      message: err?.message,
      code: err?.code,
      suppressError
    });
    
    // Handle user rejection errors - completely silent
    if (isUserRejectionError(err)) {
      console.log('✅ User rejection detected - handling silently');
      setConnectionRejected(true);
      
      // Don't set any error message for user rejections
      // This is completely normal behavior and shouldn't be treated as an error
      return;
    }
    
    // Handle specific MetaMask error codes
    if (err.code === -32002) {
      if (!suppressError) {
        setError('MetaMask connection is already pending. Please check your MetaMask popup.');
      }
      return;
    }
    
    if (err.message?.includes('No Ethereum provider')) {
      if (!suppressError) {
        setError('MetaMask is not installed. Please install MetaMask to continue.');
      }
      return;
    }
    
    if (err.message?.includes('Network')) {
      if (!suppressError) {
        setError('Network connection failed. Please check your internet connection.');
      }
      return;
    }
    
    if (err.message?.includes('accounts')) {
      if (!suppressError) {
        setError('No MetaMask accounts found. Please create or unlock your MetaMask wallet.');
      }
      return;
    }
    
    // Generic error fallback - only if not user rejection
    if (!suppressError && !isUserRejectionError(err)) {
      setError('Unable to connect to wallet. Please try again.');
    }
  };

  // Enhanced safe wrapper for async operations
  const safeAsync = async (operation: () => Promise<any>, suppressError = false, context = 'operation') => {
    try {
      return await operation();
    } catch (err: any) {
      console.log(`🛡️ Safe async caught error in ${context}:`, err);
      handleWalletError(err, suppressError, context);
      return null;
    }
  };

  // Connect wallet with enhanced error handling
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask extension to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);
    setConnectionRejected(false);
    setHasAttemptedConnection(true);

    const result = await safeAsync(async () => {
      console.log('🔄 Starting wallet connection...');

      // Check if MetaMask is locked
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      // If no accounts, request permission
      let requestedAccounts;
      if (accounts.length === 0) {
        console.log('🔐 Requesting account access...');
        requestedAccounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
      } else {
        requestedAccounts = accounts;
      }

      if (requestedAccounts.length === 0) {
        throw new Error('No accounts found in MetaMask');
      }

      // Create provider and signer
      const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
      const signerInstance = providerInstance.getSigner();
      const network = await providerInstance.getNetwork();

      // Check if we're on a supported network
      if (!SUPPORTED_NETWORKS[network.chainId as keyof typeof SUPPORTED_NETWORKS]) {
        console.log(`⚠️ Unsupported network detected: ${network.chainId}`);
        setError(`Unsupported network. Please switch to a supported network in MetaMask.`);
        return null;
      }

      // Set state
      setProvider(providerInstance);
      setSigner(signerInstance);
      setAccount(requestedAccounts[0]);
      setChainId(network.chainId);
      setIsConnected(true);
      setConnectionRejected(false);

      // Initialize contract
      initializeContract(providerInstance, signerInstance);

      console.log('✅ Wallet connected successfully:', {
        account: requestedAccounts[0],
        network: SUPPORTED_NETWORKS[network.chainId as keyof typeof SUPPORTED_NETWORKS],
        chainId: network.chainId
      });

      return true;
    }, false, 'connectWallet');

    if (!result) {
      setIsConnected(false);
    }

    setIsConnecting(false);
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setError(null);
    setConnectionRejected(false);
    console.log('🔌 Wallet disconnected');
  };

  // Switch network with error handling
  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) {
      setError('MetaMask is not available');
      return;
    }

    await safeAsync(async () => {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      
      // Reconnect after network switch
      setTimeout(() => connectWallet(), 1000);
    }, false, 'switchNetwork');
  };

  // Handle account changes with error protection
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('👤 Accounts changed:', accounts);
      
      try {
        if (accounts.length === 0) {
          console.log('🔓 MetaMask locked or disconnected');
          disconnectWallet();
        } else if (accounts[0] !== account) {
          console.log('🔄 Account switched, reconnecting...');
          setAccount(accounts[0]);
          // Only reconnect if we were previously connected
          if (isConnected) {
            connectWallet();
          }
        }
      } catch (err) {
        console.log('❌ Error handling account change:', err);
      }
    };

    const handleChainChanged = (chainId: string) => {
      try {
        const newChainId = parseInt(chainId, 16);
        console.log('🌐 Network changed:', newChainId);
        setChainId(newChainId);
        
        // Check if new network is supported
        if (!SUPPORTED_NETWORKS[newChainId as keyof typeof SUPPORTED_NETWORKS]) {
          setError(`Unsupported network. Please switch to a supported network in MetaMask.`);
          setIsConnected(false);
        } else {
          setError(null);
          // Only reconnect if we were previously connected
          if (isConnected) {
            connectWallet();
          }
        }
      } catch (err) {
        console.log('❌ Error handling chain change:', err);
      }
    };

    const handleDisconnect = (error: any) => {
      console.log('🔌 MetaMask disconnected:', error);
      disconnectWallet();
    };

    // Add event listeners with error protection
    try {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    } catch (err) {
      console.log('❌ Error setting up event listeners:', err);
    }

    // Cleanup
    return () => {
      try {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('disconnect', handleDisconnect);
        }
      } catch (err) {
        console.log('❌ Error cleaning up event listeners:', err);
      }
    };
  }, [account, isConnected]);

  // Safe auto-connect on page load
  useEffect(() => {
    if (autoConnectAttempted) return;

    const autoConnect = async () => {
      if (!isMetaMaskInstalled()) {
        setAutoConnectAttempted(true);
        return;
      }

      // Attempt silent connection check
      const result = await safeAsync(async () => {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        
        if (accounts.length > 0) {
          console.log('🔄 Auto-connecting to previously connected account...');
          await connectWallet();
        }
        
        return true;
      }, true, 'autoConnect'); // Suppress errors for auto-connect

      setAutoConnectAttempted(true);
    };

    // Delay auto-connect to prevent initial load issues
    const timer = setTimeout(autoConnect, 1000);
    return () => clearTimeout(timer);
  }, [autoConnectAttempted]);

  const value: Web3ContextType = {
    isConnected,
    account,
    chainId,
    provider,
    signer,
    contract,
    contractAddress: CONTRACT_CONFIG.address,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    error,
    clearError,
    isConnecting,
    isTransacting,
    hasAttemptedConnection,
    connectionRejected,
    autoConnectAttempted
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

// Custom hook to use Web3 context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// Custom hook for contract interactions with enhanced error handling
export function useContract() {
  const { contract, isConnected, account } = useWeb3();
  
  const [contractData, setContractData] = useState({
    totalMinted: 0,
    maxSupply: 0,
    mintPrice: '0',
    lowCostPrice: '0',
    mintingActive: false,
    lowCostMintActive: false,
    userMinted: 0,
    userLowCostMinted: 0,
    userBalance: 0,
    remainingLowCostMints: 0,
    remainingRegularMints: 0
  });

  // Safe contract data fetching
  const fetchContractData = async () => {
    if (!contract || !isConnected || !account) {
      console.log('⏸️ Contract data fetch skipped - missing requirements');
      return;
    }

    try {
      console.log('📊 Fetching contract data...');
      
      const [
        totalMinted,
        maxSupply,
        mintPrice,
        lowCostPrice,
        mintingActive,
        lowCostMintActive,
        userMinted,
        userLowCostMinted,
        userBalance,
        remainingLowCostMints,
        remainingRegularMints
      ] = await Promise.all([
        contract.totalMinted(),
        contract.MAX_SUPPLY(),
        contract.mintPrice(),
        contract.lowCostPrice(),
        contract.mintingActive(),
        contract.lowCostMintActive(),
        contract.mintedByAddress(account),
        contract.lowCostMintedByAddress(account),
        contract.balanceOf(account),
        contract.remainingLowCostMints(account),
        contract.remainingRegularMints(account)
      ]);

      const newData = {
        totalMinted: totalMinted.toNumber(),
        maxSupply: maxSupply.toNumber(),
        mintPrice: ethers.utils.formatEther(mintPrice),
        lowCostPrice: ethers.utils.formatEther(lowCostPrice),
        mintingActive,
        lowCostMintActive,
        userMinted: userMinted.toNumber(),
        userLowCostMinted: userLowCostMinted.toNumber(),
        userBalance: userBalance.toNumber(),
        remainingLowCostMints: remainingLowCostMints.toNumber(),
        remainingRegularMints: remainingRegularMints.toNumber()
      };

      setContractData(newData);
      console.log('✅ Contract data updated:', newData);
      
    } catch (err) {
      console.log('ℹ️ Contract data fetch failed (this is normal if contract not deployed):', err);
      // Silently fail for contract data - don't show errors to user
    }
  };

  // Refresh data when contract or account changes
  useEffect(() => {
    if (contract && account && isConnected) {
      fetchContractData();
    }
  }, [contract, account, isConnected]);

  return {
    ...contractData,
    refreshData: fetchContractData
  };
}

// Type declarations for MetaMask
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
    __ENV__?: Record<string, string>;
  }
}