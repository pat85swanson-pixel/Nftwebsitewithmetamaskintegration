import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Users, Coins, AlertCircle, RefreshCw, Info, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CryptoPrices {
  xrp: {
    usd: number;
    eth: number;
    lastUpdated: string;
  };
  eth: {
    usd: number;
    lastUpdated: string;
  };
}

interface NFTPricing {
  xrp: number;
  eth: number; // Calculated amount
  usdFromXRP: string;
  usdFromETH: string;
  ethCalculated?: boolean;
  details?: {
    xrpPrice: number;
    ethPrice: number;
    ethAmountCalculated: boolean;
    priceDifference: string;
  };
}

interface CollectionStats {
  totalHolders: number;
  xrplHolders: number;
  evmHolders: number;
  totalNFTs: number;
  averageNFTsPerHolder: number;
  lastUpdated: string;
}

// NFT pricing constants
const NFT_PRICE_XRP = 100;

// Function to calculate realistic fallback pricing
const calculateFallbackData = (xrpPrice: number = 0.67, ethPrice: number = 2400) => {
  const nftUSDValue = NFT_PRICE_XRP * xrpPrice;
  const ethAmountNeeded = nftUSDValue / ethPrice;
  
  const prices: CryptoPrices = {
    xrp: {
      usd: xrpPrice,
      eth: 0.0003,
      lastUpdated: new Date().toISOString()
    },
    eth: {
      usd: ethPrice,
      lastUpdated: new Date().toISOString()
    }
  };
  
  const nftPricing: NFTPricing = {
    xrp: NFT_PRICE_XRP,
    eth: parseFloat(ethAmountNeeded.toFixed(6)),
    usdFromXRP: nftUSDValue.toFixed(2),
    usdFromETH: (ethAmountNeeded * ethPrice).toFixed(2),
    ethCalculated: true
  };
  
  return { prices, nftPricing };
};

// Fallback data with realistic values
const { prices: FALLBACK_PRICES, nftPricing: FALLBACK_NFT_PRICING } = calculateFallbackData();

const FALLBACK_STATS: CollectionStats = {
  totalHolders: 14,
  xrplHolders: 14,
  evmHolders: 0,
  totalNFTs: 4237,
  averageNFTsPerHolder: 3.4,
  lastUpdated: new Date().toISOString()
};

export function CryptoPriceDisplay() {
  const [prices, setPrices] = useState<CryptoPrices | null>(null);
  const [nftPricing, setNftPricing] = useState<NFTPricing | null>(null);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);
  
  // Use ref to track component mount status and abort controller
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = async (isRetry = false) => {
    // Don't fetch if component is unmounted
    if (!isMountedRef.current) return;

    try {
      setLoading(true);
      if (!isRetry) {
        setError(null);
        setUsingFallback(false);
      }
      
      console.log('Fetching crypto data from server...');
      
      // Check if we have the required configuration
      if (!projectId || !publicAnonKey) {
        throw new Error('Missing Supabase configuration');
      }
      
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller with longer timeout
      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 15000);
      
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-9a87ca9a`;
      console.log('Making requests to:', baseUrl);
      
      try {
        // Fetch prices and stats with better error handling
        const fetchWithTimeout = async (url: string) => {
          try {
            const response = await fetch(url, {
              headers: { 
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json'
              },
              signal: abortControllerRef.current?.signal
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return response;
          } catch (fetchError) {
            if (fetchError instanceof Error) {
              if (fetchError.name === 'AbortError') {
                throw new Error('Request timed out - server may be slow');
              } else if (fetchError.message.includes('Failed to fetch')) {
                throw new Error('Network connection failed');
              }
            }
            throw fetchError;
          }
        };

        // Fetch prices first (most important)
        let pricesData = null;
        try {
          const pricesResponse = await fetchWithTimeout(`${baseUrl}/prices`);
          pricesData = await pricesResponse.json();
          
          if (pricesData.success && isMountedRef.current) {
            setPrices(pricesData.data.crypto);
            setNftPricing(pricesData.data.nftPricing);
            console.log('Live prices updated successfully:', pricesData.data.nftPricing);
          }
        } catch (pricesError) {
          console.warn('Prices fetch failed:', pricesError);
          // Use fallback for prices
          if (isMountedRef.current) {
            setPrices(FALLBACK_PRICES);
            setNftPricing(FALLBACK_NFT_PRICING);
            setUsingFallback(true);
          }
        }

        // Fetch stats (less critical)
        try {
          const statsResponse = await fetchWithTimeout(`${baseUrl}/stats`);
          const statsData = await statsResponse.json();
          
          if (statsData.success && isMountedRef.current) {
            setStats(statsData.data);
          }
        } catch (statsError) {
          console.warn('Stats fetch failed:', statsError);
          if (isMountedRef.current) {
            setStats(FALLBACK_STATS);
            setUsingFallback(true);
          }
        }

        clearTimeout(timeoutId);
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
      
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return;

      // Use fallback data on error
      setPrices(FALLBACK_PRICES);
      setNftPricing(FALLBACK_NFT_PRICING);
      setStats(FALLBACK_STATS);
      setUsingFallback(true);
      
      // Set user-friendly error message
      let errorMessage = 'Failed to fetch live data - using cached prices';
      if (err instanceof Error) {
        if (err.message.includes('timed out')) {
          errorMessage = 'Request timed out - using cached prices';
        } else if (err.message.includes('Network')) {
          errorMessage = 'Network connection issue - using cached prices';
        }
      }
      
      setError(errorMessage);
      
      // Retry logic with exponential backoff (only if not a timeout)
      if (!isRetry && retryCount < 2 && !err?.message.includes('timed out')) {
        const retryDelay = Math.pow(2, retryCount) * 2000; // 2s, 4s
        console.log(`Retrying in ${retryDelay}ms (attempt ${retryCount + 1}/2)`);
        setTimeout(() => {
          if (isMountedRef.current) {
            setRetryCount(prev => prev + 1);
            fetchData(true);
          }
        }, retryDelay);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleManualRefresh = () => {
    setRetryCount(0);
    setError(null);
    fetchData();
  };

  // Effect to handle data fetching
  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial fetch
    fetchData();
    
    // Set up interval for periodic refresh (every 5 minutes)
    const interval = setInterval(() => {
      if (isMountedRef.current) {
        fetchData();
      }
    }, 300000);
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
      
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (loading && !prices) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-4 bg-white/5 border-white/10 backdrop-blur-xl animate-pulse">
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-6 bg-white/10 rounded mb-2"></div>
            <div className="h-3 bg-white/10 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  // Check if prices are perfectly aligned (difference less than $0.01)
  const isPerfectParity = nftPricing && Math.abs(parseFloat(nftPricing.usdFromXRP) - parseFloat(nftPricing.usdFromETH)) < 0.01;

  return (
    <div className="mb-8">
      {/* Error/Warning Banner */}
      {(error || usingFallback) && (
        <Card className={`p-3 mb-4 ${usingFallback ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'} backdrop-blur-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className={`w-4 h-4 ${usingFallback ? 'text-yellow-400' : 'text-red-400'}`} />
              <p className={`text-sm ${usingFallback ? 'text-yellow-400' : 'text-red-400'}`}>
                {error || 'Using cached data - Live prices temporarily unavailable'}
              </p>
            </div>
            <Button
              onClick={handleManualRefresh}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              disabled={loading}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Perfect Pricing Parity Success Banner */}
      {isPerfectParity && nftPricing && (
        <Card className="p-3 mb-4 bg-green-500/10 border-green-500/20 backdrop-blur-xl">
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-green-400" />
            <p className="text-sm text-green-400">
              ✨ Perfect USD Parity: {nftPricing.xrp} XRP = {nftPricing.eth} ETH = ${nftPricing.usdFromXRP} USD
              {nftPricing.details?.priceDifference && parseFloat(nftPricing.details.priceDifference) > 0 && (
                <span className="ml-2 text-xs opacity-70">
                  (Difference: ${nftPricing.details.priceDifference})
                </span>
              )}
            </p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* XRP Price Card */}
        <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-cyan-400" />
              <span className="text-white/70 text-sm">XRP Price</span>
            </div>
            <Badge className={`${usingFallback ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'}`}>
              {usingFallback ? 'CACHED' : 'LIVE'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-xl font-bold text-white">
              ${prices?.xrp.usd.toFixed(4) || '0.0000'}
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            NFT: {nftPricing?.xrp} XRP = ${nftPricing?.usdFromXRP}
          </p>
        </Card>

        {/* ETH Price Card (Live Market Price) */}
        <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-blue-400" />
              <span className="text-white/70 text-sm">ETH Price</span>
            </div>
            <Badge className={`${usingFallback ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
              {usingFallback ? 'CACHED' : 'LIVE'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-xl font-bold text-white">
              ${prices?.eth.usd.toLocaleString() || '0'}
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            NFT: {nftPricing?.eth} ETH = ${nftPricing?.usdFromETH}
          </p>
          {nftPricing?.ethCalculated && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-xs text-cyan-400 flex items-center">
                <Calculator className="w-3 h-3 mr-1" />
                ETH amount calculated for USD parity
              </p>
            </div>
          )}
        </Card>

        {/* Collection Stats Card */}
        <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-white/70 text-sm">Holders</span>
            </div>
            <Badge className={`${usingFallback ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
              {usingFallback ? 'CACHED' : 'STATS'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">
              {stats?.totalHolders.toLocaleString() || 0}
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            XRPL: {stats?.xrplHolders || 0} | EVM: {stats?.evmHolders || 0}
          </p>
        </Card>
      </div>
      
      {/* Loading indicator during refresh */}
      {loading && prices && (
        <div className="text-center mt-2">
          <span className="text-xs text-white/50 flex items-center justify-center">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Updating prices...
          </span>
        </div>
      )}
    </div>
  );
}