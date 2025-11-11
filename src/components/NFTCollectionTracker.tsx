import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  RefreshCw, 
  Clock,
  Coins,
  Users,
  ShoppingCart,
  Eye,
  AlertCircle,
  Zap
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface NFTTransaction {
  id: string;
  type: 'mint' | 'sale' | 'transfer';
  price?: number;
  priceUSD?: string;
  from: string;
  to: string;
  tokenId: string;
  timestamp: string;
  txHash: string;
  marketplace?: string;
}

interface CollectionAnalytics {
  address: string;
  totalSupply: number;
  totalMinted: number;
  floorPrice: number;
  floorPriceUSD: string;
  volume24h: number;
  volume24hUSD: string;
  transactions24h: number;
  uniqueTraders24h: number;
  avgPrice24h: number;
  priceChange24h: number;
  lastUpdated: string;
}

interface CollectionMetadata {
  name: string;
  description: string;
  image: string;
  externalUrl: string;
  totalSupply: number;
  verified: boolean;
}

const NFT_COLLECTION_ADDRESS = 'rM4LCbC9SSr9vSmdDqfenh1QZnKDHxAcHF';

// Fallback data for when API is unavailable
const FALLBACK_ANALYTICS: CollectionAnalytics = {
  address: NFT_COLLECTION_ADDRESS,
  totalSupply: 10000,
  totalMinted: 59,
  floorPrice: 95,
  floorPriceUSD: '63.65',
  volume24h: 2840,
  volume24hUSD: '1,902.80',
  transactions24h: 12,
  uniqueTraders24h: 8,
  avgPrice24h: 102.5,
  priceChange24h: 2.3,
  lastUpdated: new Date().toISOString()
};

const FALLBACK_METADATA: CollectionMetadata = {
  name: 'LUCHADOR LUNCH HOUR',
  description: '10K Hungry Luchador NFT Collection - Cross-Chain XRPL + EVM',
  image: '/api/placeholder/400/400',
  externalUrl: 'https://xrp.cafe/nft/rM4LCbC9SSr9vSmdDqfenh1QZnKDHxAcHF',
  totalSupply: 10000,
  verified: true
};

const RECENT_TRANSACTIONS: NFTTransaction[] = [
  {
    id: '1',
    type: 'mint',
    price: 100,
    priceUSD: '67.00',
    from: 'rM4LCbC9SSr9vSmdDqfenh1QZnKDHxAcHF',
    to: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    tokenId: '59',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    txHash: '0x1234...5678',
    marketplace: 'XRP.CAFE'
  },
  {
    id: '2',
    type: 'sale',
    price: 105,
    priceUSD: '70.35',
    from: 'rDifferentAddress123456789ABC',
    to: 'rAnotherAddress987654321XYZ',
    tokenId: '58',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    txHash: '0x8765...4321',
    marketplace: 'XRP.CAFE'
  }
];

export function NFTCollectionTracker() {
  const [analytics, setAnalytics] = useState<CollectionAnalytics>(FALLBACK_ANALYTICS);
  const [metadata, setMetadata] = useState<CollectionMetadata>(FALLBACK_METADATA);
  const [recentTxs, setRecentTxs] = useState<NFTTransaction[]>(RECENT_TRANSACTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchNFTData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching NFT collection data for:', NFT_COLLECTION_ADDRESS);
      
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-9a87ca9a`;
      
      // Try to fetch real NFT data from your backend
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      try {
        const response = await fetch(`${baseUrl}/nft-analytics`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            collectionAddress: NFT_COLLECTION_ADDRESS,
            includeTransactions: true,
            limit: 5
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          console.log('NFT analytics data received:', data);
          
          if (data.success) {
            setAnalytics(data.data.analytics);
            setMetadata(data.data.metadata);
            setRecentTxs(data.data.recentTransactions);
            setUsingFallback(false);
          } else {
            throw new Error(data.error || 'Failed to fetch NFT data');
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.warn('Real NFT data unavailable, using demo data:', fetchError);
        setUsingFallback(true);
      }
      
      setLastRefresh(new Date());
      
    } catch (err) {
      console.error('Error fetching NFT data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch NFT data');
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchNFTData();
  };

  const formatAddress = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'mint': return <Zap className="w-3 h-3 text-green-400" />;
      case 'sale': return <ShoppingCart className="w-3 h-3 text-blue-400" />;
      case 'transfer': return <Activity className="w-3 h-3 text-purple-400" />;
      default: return <Activity className="w-3 h-3 text-gray-400" />;
    }
  };

  const openXRPCafe = () => {
    window.open(`https://xrp.cafe/nft/${NFT_COLLECTION_ADDRESS}`, '_blank');
  };

  useEffect(() => {
    fetchNFTData();
    // Auto-refresh every 2 minutes for NFT data
    const interval = setInterval(fetchNFTData, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {(error || usingFallback) && (
        <Card className={`p-3 ${usingFallback ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'} backdrop-blur-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className={`w-4 h-4 ${usingFallback ? 'text-blue-400' : 'text-red-400'}`} />
              <p className={`text-sm ${usingFallback ? 'text-blue-400' : 'text-red-400'}`}>
                {usingFallback 
                  ? 'Demo Mode: Showing simulated NFT collection data' 
                  : `Error: ${error}`}
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              disabled={loading}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </Card>
      )}

      {/* Collection Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-white/10 backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎭</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{metadata.name}</h3>
                <p className="text-sm text-white/70">{formatAddress(analytics.address)}</p>
              </div>
              {metadata.verified && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <span className="mr-1">✓</span>
                  Verified
                </Badge>
              )}
            </div>
          </div>
          <Button
            onClick={openXRPCafe}
            variant="outline"
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on XRP.CAFE
          </Button>
        </div>
      </Card>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Minted */}
        <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-green-400" />
              <span className="text-white/70 text-sm">Minted</span>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              SUPPLY
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">
              {analytics.totalMinted.toLocaleString()}
            </div>
            <p className="text-xs text-white/50">
              / {analytics.totalSupply.toLocaleString()} Total
            </p>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full"
                style={{ width: `${(analytics.totalMinted / analytics.totalSupply) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Floor Price */}
        <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-white/70 text-sm">Floor Price</span>
            </div>
            <Badge className={`${analytics.priceChange24h >= 0 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {analytics.priceChange24h >= 0 ? '+' : ''}{analytics.priceChange24h.toFixed(1)}%
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">
              {analytics.floorPrice} XRP
            </div>
            <p className="text-xs text-white/50">
              ≈ ${analytics.floorPriceUSD} USD
            </p>
          </div>
        </Card>

        {/* 24h Volume */}
        <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-white/70 text-sm">24h Volume</span>
            </div>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              VOLUME
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">
              {analytics.volume24h.toLocaleString()} XRP
            </div>
            <p className="text-xs text-white/50">
              ${analytics.volume24hUSD}
            </p>
          </div>
        </Card>

        {/* 24h Activity */}
        <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-white/70 text-sm">24h Activity</span>
            </div>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              STATS
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">
              {analytics.transactions24h}
            </div>
            <p className="text-xs text-white/50">
              {analytics.uniqueTraders24h} unique traders
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-white/50" />
            <span className="text-sm text-white/50">
              Updated {formatTimeAgo(lastRefresh.toISOString())}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {recentTxs.map((tx) => (
            <div 
              key={tx.id} 
              className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              onClick={() => window.open(`https://xrpl.org/tx/${tx.txHash}`, '_blank')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(tx.type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium capitalize">{tx.type}</span>
                      <Badge 
                        variant="outline" 
                        className="text-xs border-white/20 text-white/60"
                      >
                        #{tx.tokenId}
                      </Badge>
                      {tx.marketplace && (
                        <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {tx.marketplace}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-white/50">
                      {formatAddress(tx.from)} → {formatAddress(tx.to)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {tx.price && (
                    <div className="text-white font-medium">
                      {tx.price} XRP
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    {tx.priceUSD && (
                      <span className="text-xs text-white/50">${tx.priceUSD}</span>
                    )}
                    <span className="text-xs text-white/50">
                      {formatTimeAgo(tx.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={openXRPCafe}
          variant="outline"
          className="w-full mt-4 border-white/20 text-white hover:bg-white/10"
        >
          <Eye className="w-4 h-4 mr-2" />
          View All Transactions on XRP.CAFE
        </Button>
      </Card>
    </div>
  );
}