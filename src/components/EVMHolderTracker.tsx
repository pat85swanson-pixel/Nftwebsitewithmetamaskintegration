import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useWeb3, useContract } from './Web3Provider';
import { ethers } from 'ethers';
import { 
  Users, 
  RefreshCw, 
  ExternalLink, 
  Wallet,
  TrendingUp,
  Eye,
  Grid3X3
} from 'lucide-react';

interface HolderData {
  address: string;
  tokenCount: number;
  tokens: number[];
  isCurrentUser?: boolean;
}

interface EVMHolderTrackerProps {
  className?: string;
}

export function EVMHolderTracker({ className = '' }: EVMHolderTrackerProps) {
  const { isConnected, account, contract } = useWeb3();
  const contractData = useContract();
  
  const [holders, setHolders] = useState<HolderData[]>([]);
  const [totalHolders, setTotalHolders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
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

  // Fetch holder data from contract
  const fetchHolderData = async () => {
    if (!contract || !isConnected) {
      setError('Contract not connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching holder data...');
      
      // Get total holders count
      const totalHoldersCount = await contract.getTotalHolders();
      setTotalHolders(totalHoldersCount.toNumber());

      // Get all holder addresses
      const holderAddresses = await contract.getHolders();
      console.log('Holder addresses:', holderAddresses);

      // Fetch data for each holder
      const holdersData: HolderData[] = [];
      
      for (const address of holderAddresses) {
        try {
          const [tokens, balance] = await Promise.all([
            contract.getHolderTokens(address),
            contract.balanceOf(address)
          ]);

          holdersData.push({
            address,
            tokenCount: balance.toNumber(),
            tokens: tokens.map((token: ethers.BigNumber) => token.toNumber()),
            isCurrentUser: address.toLowerCase() === account?.toLowerCase()
          });
        } catch (err) {
          console.warn(`Failed to fetch data for holder ${address}:`, err);
        }
      }

      // Sort by token count (descending), then by address
      holdersData.sort((a, b) => {
        if (b.tokenCount !== a.tokenCount) {
          return b.tokenCount - a.tokenCount;
        }
        return a.address.localeCompare(b.address);
      });

      setHolders(holdersData);
      setLastUpdated(new Date());
      console.log('Holder data updated:', holdersData);

    } catch (err: any) {
      console.error('Failed to fetch holder data:', err);
      setError(err.reason || err.message || 'Failed to fetch holder data');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on component mount and when contract changes
  useEffect(() => {
    if (contract && isConnected) {
      fetchHolderData();
    }
  }, [contract, isConnected, account]);

  // Helper functions
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getEtherscanLink = (address: string) => {
    // This should be dynamic based on the network
    const networkPrefix = '';
    return `https://${networkPrefix}etherscan.io/address/${address}`;
  };

  const getHolderRank = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  if (!isConnected) {
    return (
      <Card 
        className={`p-6 bg-white/5 border-white/10 backdrop-blur-xl text-center ${className}`}
        style={{
          transform: `translate3d(0, ${mousePosition.y * -2}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Holder Tracking</h3>
        <p className="text-white/60">Connect your wallet to view NFT holder statistics</p>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 backdrop-blur-xl"
          style={{
            transform: `translate3d(0, ${mousePosition.y * -1}px, 0) rotateX(${mousePosition.y * 1}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">LIVE</Badge>
          </div>
          <p className="text-2xl font-bold text-white">{totalHolders}</p>
          <p className="text-sm text-white/60">Total Holders</p>
        </Card>

        <Card 
          className="p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/20 backdrop-blur-xl"
          style={{
            transform: `translate3d(0, ${mousePosition.y * -1}px, 0) rotateX(${mousePosition.y * 1}deg)`,
            transition: 'transform 0.1s ease-out',
            animationDelay: '0.1s'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <Grid3X3 className="w-5 h-5 text-green-400" />
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">MINTED</Badge>
          </div>
          <p className="text-2xl font-bold text-white">{contractData.totalMinted}</p>
          <p className="text-sm text-white/60">Total NFTs</p>
        </Card>

        <Card 
          className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20 backdrop-blur-xl"
          style={{
            transform: `translate3d(0, ${mousePosition.y * -1}px, 0) rotateX(${mousePosition.y * 1}deg)`,
            transition: 'transform 0.1s ease-out',
            animationDelay: '0.2s'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">AVG</Badge>
          </div>
          <p className="text-2xl font-bold text-white">
            {totalHolders > 0 ? (contractData.totalMinted / totalHolders).toFixed(1) : '0'}
          </p>
          <p className="text-sm text-white/60">NFTs per Holder</p>
        </Card>
      </div>

      {/* Holder List */}
      <Card 
        className="p-6 bg-white/5 border-white/10 backdrop-blur-xl"
        style={{
          transform: `translate3d(0, ${mousePosition.y * -2}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">NFT Holders</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {lastUpdated && (
              <span className="text-xs text-white/60">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button
              onClick={fetchHolderData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
            <p className="text-white/60">Loading holder data...</p>
          </div>
        ) : holders.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60">No holders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {holders.map((holder, index) => (
              <div
                key={holder.address}
                className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
                  holder.isCurrentUser
                    ? 'bg-gradient-to-r from-green-500/20 to-cyan-500/20 border-green-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                style={{
                  transform: `translate3d(0, ${mousePosition.y * -0.5}px, 0)`,
                  transition: 'transform 0.1s ease-out',
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-white/80 min-w-[3rem]">
                      {getHolderRank(index)}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-4 h-4 text-purple-400" />
                      <span className="font-mono text-white">
                        {formatAddress(holder.address)}
                      </span>
                      {holder.isCurrentUser && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          YOU
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-white font-bold">{holder.tokenCount} NFTs</p>
                      <p className="text-xs text-white/60">
                        Tokens: {holder.tokens.slice(0, 3).join(', ')}
                        {holder.tokens.length > 3 && `... +${holder.tokens.length - 3} more`}
                      </p>
                    </div>

                    <a
                      href={getEtherscanLink(holder.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                    </a>
                  </div>
                </div>

                {/* Show token details for current user */}
                {holder.isCurrentUser && holder.tokens.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-white/60 mb-2">Your NFT Token IDs:</p>
                    <div className="flex flex-wrap gap-1">
                      {holder.tokens.map((tokenId) => (
                        <Badge
                          key={tokenId}
                          className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                        >
                          #{tokenId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}