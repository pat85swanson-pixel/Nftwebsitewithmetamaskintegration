import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { GlassButton } from './ui/glass-button';
import { Alert, AlertDescription } from './ui/alert';
import { useWeb3, useContract } from './Web3Provider';
import { ethers } from 'ethers';
import { 
  Wallet, 
  Coins, 
  Gift, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  ExternalLink,
  TrendingUp,
  Users,
  Info,
  RefreshCw,
  XCircle
} from 'lucide-react';

interface EVMNFTMinterProps {
  className?: string;
}

export function EVMNFTMinter({ className = '' }: EVMNFTMinterProps) {
  const {
    isConnected,
    account,
    chainId,
    contract,
    connectWallet,
    error: web3Error,
    clearError,
    isConnecting,
    hasAttemptedConnection,
    connectionRejected
  } = useWeb3();

  const contractData = useContract();

  const [mintQuantity, setMintQuantity] = useState(1);
  const [lowCostQuantity, setLowCostQuantity] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [isLowCostMinting, setIsLowCostMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (mintSuccess) {
      const timer = setTimeout(() => setMintSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mintSuccess]);

  useEffect(() => {
    if (mintError) {
      const timer = setTimeout(() => setMintError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mintError]);

  // Enhanced mint error handling
  const handleMintError = (err: any, operation: string) => {
    console.error(`${operation} failed:`, err);
    
    let errorMessage = `${operation} failed`;
    
    if (err.code === 4001 || err.message?.includes('User rejected')) {
      errorMessage = 'Transaction was cancelled by user';
    } else if (err.message?.includes('insufficient funds')) {
      errorMessage = 'Insufficient ETH balance for transaction';
    } else if (err.message?.includes('exceeds balance')) {
      errorMessage = 'Insufficient ETH balance';
    } else if (err.message?.includes('exceeds')) {
      errorMessage = 'Minting limit exceeded for your wallet';
    } else if (err.message?.includes('not active')) {
      errorMessage = 'Minting is currently not active';
    } else if (err.message?.includes('max supply')) {
      errorMessage = 'Maximum NFT supply reached';
    } else if (err.reason) {
      errorMessage = err.reason;
    } else if (err.data?.message) {
      errorMessage = err.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setMintError(errorMessage);
  };

  // Regular mint function
  const handleMint = async () => {
    if (!contract || !isConnected) return;

    setIsMinting(true);
    setMintError(null);
    setMintSuccess(null);

    try {
      const mintPrice = ethers.utils.parseEther(contractData.mintPrice);
      const totalCost = mintPrice.mul(mintQuantity);

      console.log('🚀 Starting mint transaction:', {
        quantity: mintQuantity,
        pricePerNFT: contractData.mintPrice,
        totalCost: ethers.utils.formatEther(totalCost)
      });

      const tx = await contract.mint(mintQuantity, {
        value: totalCost,
        gasLimit: 300000 // Adjust as needed
      });

      setMintSuccess(`Transaction submitted! Hash: ${tx.hash}`);
      console.log('📝 Transaction submitted:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt);
      
      setMintSuccess(`Successfully minted ${mintQuantity} NFT${mintQuantity > 1 ? 's' : ''}!`);
      
      // Refresh contract data
      contractData.refreshData();
      
    } catch (err: any) {
      handleMintError(err, 'Regular minting');
    } finally {
      setIsMinting(false);
    }
  };

  // Low-cost mint function
  const handleLowCostMint = async () => {
    if (!contract || !isConnected) return;

    setIsLowCostMinting(true);
    setMintError(null);
    setMintSuccess(null);

    try {
      const lowCostPrice = ethers.utils.parseEther(contractData.lowCostPrice);
      const totalCost = lowCostPrice.mul(lowCostQuantity);

      console.log('🎁 Starting low-cost mint transaction:', {
        quantity: lowCostQuantity,
        pricePerNFT: contractData.lowCostPrice,
        totalCost: ethers.utils.formatEther(totalCost)
      });

      const tx = await contract.lowCostMint(lowCostQuantity, {
        value: totalCost,
        gasLimit: 300000
      });

      setMintSuccess(`Transaction submitted! Hash: ${tx.hash}`);
      console.log('📝 Low-cost transaction submitted:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('✅ Low-cost transaction confirmed:', receipt);
      
      setMintSuccess(`Successfully minted ${lowCostQuantity} low-cost NFT${lowCostQuantity > 1 ? 's' : ''}!`);
      
      // Refresh contract data
      contractData.refreshData();
      
    } catch (err: any) {
      handleMintError(err, 'Low-cost minting');
    } finally {
      setIsLowCostMinting(false);
    }
  };

  // Connection status component
  const ConnectionStatus = () => {
    if (!hasAttemptedConnection) {
      return (
        <Card 
          className="p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 backdrop-blur-xl text-center"
          style={{
            transform: `translate3d(0, ${mousePosition.y * -2}px, 0) rotateX(${mousePosition.y * 1}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="flex flex-col items-center space-y-4">
            <Wallet className="w-12 h-12 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Connect Your Wallet</h3>
            <p className="text-white/70">Connect MetaMask to mint NFTs on the EVM blockchain</p>
            
            <GlassButton
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/30 hover:from-purple-500/30 hover:to-cyan-500/30"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect MetaMask
                </>
              )}
            </GlassButton>
          </div>
        </Card>
      );
    }

    if (connectionRejected) {
      return (
        <Card 
          className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20 backdrop-blur-xl text-center"
          style={{
            transform: `translate3d(0, ${mousePosition.y * -2}px, 0) rotateX(${mousePosition.y * 1}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="w-12 h-12 text-orange-400" />
            <h3 className="text-xl font-bold text-white">Connection Cancelled</h3>
            <p className="text-white/70">You cancelled the MetaMask connection. No worries!</p>
            
            <div className="flex space-x-3">
              <GlassButton
                onClick={() => {
                  clearError();
                  connectWallet();
                }}
                disabled={isConnecting}
                className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/30 hover:from-purple-500/30 hover:to-cyan-500/30"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </>
                )}
              </GlassButton>
              
              <GlassButton
                onClick={clearError}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Dismiss
              </GlassButton>
            </div>
          </div>
        </Card>
      );
    }

    if (!isConnected && hasAttemptedConnection) {
      return (
        <Card 
          className="p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20 backdrop-blur-xl text-center"
          style={{
            transform: `translate3d(0, ${mousePosition.y * -2}px, 0) rotateX(${mousePosition.y * 1}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <h3 className="text-xl font-bold text-white">Connection Failed</h3>
            <p className="text-white/70">Unable to connect to MetaMask</p>
            
            <GlassButton
              onClick={() => {
                clearError();
                connectWallet();
              }}
              disabled={isConnecting}
              className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/30 hover:from-purple-500/30 hover:to-cyan-500/30"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Connection
                </>
              )}
            </GlassButton>
          </div>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Connection Status */}
      {!isConnected ? (
        <ConnectionStatus />
      ) : (
        <>
          {/* Wallet Info */}
          <Card 
            className="p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/20 backdrop-blur-xl"
            style={{
              transform: `translate3d(0, ${mousePosition.y * -1}px, 0)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Wallet Connected</p>
                  <p className="text-xs text-white/60">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                EVM Network
              </Badge>
            </div>
          </Card>

          {/* Contract Not Deployed Warning */}
          {!contract && (
            <Alert className="bg-blue-500/10 border-blue-500/20 backdrop-blur-xl">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-400">
                <strong>Smart Contract Not Deployed:</strong> The EVM smart contract hasn't been deployed yet. 
                Wallet connection is working, but minting features will be available after contract deployment.
              </AlertDescription>
            </Alert>
          )}

          {/* Contract Stats */}
          {contract && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className="p-4 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
                style={{
                  transform: `translate3d(0, ${mousePosition.y * -2}px, 0) rotateX(${mousePosition.y * 1}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">LIVE</Badge>
                </div>
                <p className="text-2xl font-bold text-white">
                  {contractData.totalMinted.toLocaleString()}
                </p>
                <p className="text-sm text-white/60">
                  of {contractData.maxSupply.toLocaleString()} minted
                </p>
              </Card>

              <Card 
                className="p-4 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
                style={{
                  transform: `translate3d(0, ${mousePosition.y * -2}px, 0) rotateX(${mousePosition.y * 1}deg)`,
                  transition: 'transform 0.1s ease-out',
                  animationDelay: '0.1s'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Coins className="w-4 h-4 text-purple-400" />
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">PRICE</Badge>
                </div>
                <p className="text-2xl font-bold text-white">
                  {parseFloat(contractData.mintPrice).toFixed(4)} ETH
                </p>
                <p className="text-sm text-white/60">Regular mint price</p>
              </Card>

              <Card 
                className="p-4 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
                style={{
                  transform: `translate3d(0, ${mousePosition.y * -2}px, 0) rotateX(${mousePosition.y * 1}deg)`,
                  transition: 'transform 0.1s ease-out',
                  animationDelay: '0.2s'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-4 h-4 text-green-400" />
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">OWNED</Badge>
                </div>
                <p className="text-2xl font-bold text-white">{contractData.userBalance}</p>
                <p className="text-sm text-white/60">Your NFTs</p>
              </Card>
            </div>
          )}

          {/* Regular Minting */}
          {contract && contractData.mintingActive && (
            <Card 
              className="p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 backdrop-blur-xl"
              style={{
                transform: `translate3d(0, ${mousePosition.y * -2}px, 0) rotateX(${mousePosition.y * 1}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Regular Mint</h3>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {contractData.mintPrice} ETH
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Quantity (Max: {Math.min(10, contractData.remainingRegularMints)})
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={Math.min(10, contractData.remainingRegularMints)}
                      value={mintQuantity}
                      onChange={(e) => setMintQuantity(parseInt(e.target.value) || 1)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white w-20 text-center"
                    />
                    <span className="text-white/60">×</span>
                    <span className="text-white font-medium">{contractData.mintPrice} ETH</span>
                    <span className="text-white/60">=</span>
                    <span className="text-white font-bold">
                      {(parseFloat(contractData.mintPrice) * mintQuantity).toFixed(4)} ETH
                    </span>
                  </div>
                </div>

                <GlassButton
                  onClick={handleMint}
                  disabled={isMinting || contractData.remainingRegularMints === 0}
                  className="w-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/30 hover:from-purple-500/30 hover:to-cyan-500/30"
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4 mr-2" />
                      Mint {mintQuantity} NFT{mintQuantity > 1 ? 's' : ''}
                    </>
                  )}
                </GlassButton>

                <p className="text-xs text-white/60 text-center">
                  You have {contractData.remainingRegularMints} regular mints remaining
                </p>
              </div>
            </Card>
          )}

          {/* Low-Cost Minting */}
          {contract && contractData.lowCostMintActive && contractData.remainingLowCostMints > 0 && (
            <Card 
              className="p-6 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/20 backdrop-blur-xl"
              style={{
                transform: `translate3d(0, ${mousePosition.y * -2}px, 0) rotateX(${mousePosition.y * 1}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-400">Low-Cost Mint 🎉</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                  <Gift className="w-3 h-3 mr-1" />
                  {contractData.lowCostPrice} ETH
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Quantity (Max: {contractData.remainingLowCostMints})
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={contractData.remainingLowCostMints}
                      value={lowCostQuantity}
                      onChange={(e) => setLowCostQuantity(parseInt(e.target.value) || 1)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white w-20 text-center"
                    />
                    <span className="text-white/60">×</span>
                    <span className="text-green-400 font-medium">{contractData.lowCostPrice} ETH</span>
                    <span className="text-white/60">=</span>
                    <span className="text-green-400 font-bold">
                      {(parseFloat(contractData.lowCostPrice) * lowCostQuantity).toFixed(6)} ETH
                    </span>
                  </div>
                </div>

                <GlassButton
                  onClick={handleLowCostMint}
                  disabled={isLowCostMinting}
                  className="w-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 border-green-500/30 hover:from-green-500/30 hover:to-cyan-500/30 font-bold"
                >
                  {isLowCostMinting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Mint {lowCostQuantity} Low-Cost NFT{lowCostQuantity > 1 ? 's' : ''}!
                    </>
                  )}
                </GlassButton>

                <p className="text-xs text-green-400/80 text-center">
                  🌟 Special offer: {contractData.remainingLowCostMints} low-cost mints remaining!
                </p>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Error Messages */}
      {(web3Error || mintError) && (
        <Alert className="bg-red-500/10 border-red-500/20 backdrop-blur-xl">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">
            {web3Error || mintError}
            {(web3Error || mintError)?.includes('rejected') && (
              <div className="mt-2">
                <GlassButton
                  onClick={clearError}
                  size="sm"
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Dismiss
                </GlassButton>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Messages */}
      {mintSuccess && (
        <Alert className="bg-green-500/10 border-green-500/20 backdrop-blur-xl">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-400">
            {mintSuccess}
            {mintSuccess.includes('Hash:') && (
              <a
                href={`https://etherscan.io/tx/${mintSuccess.split('Hash: ')[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center text-cyan-400 hover:text-cyan-300"
              >
                View on Etherscan
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}