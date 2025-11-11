import { useState, useEffect, useRef } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoPrices {
  xrp: {
    usd: number;
  };
  eth: {
    usd: number;
  };
}

const FALLBACK_PRICES: CryptoPrices = {
  xrp: { usd: 0.67 },
  eth: { usd: 2400 }
};

export function GlobalPriceTicker() {
  const [prices, setPrices] = useState<CryptoPrices>(FALLBACK_PRICES);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPrices = async () => {
    if (!isMountedRef.current) return;

    try {
      setLoading(true);
      
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 10000);

      // Try to fetch from CoinGecko directly (simple fallback)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ripple,ethereum&vs_currencies=usd',
        {
          signal: abortControllerRef.current.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        if (isMountedRef.current && data.ripple && data.ethereum) {
          setPrices({
            xrp: { usd: data.ripple.usd },
            eth: { usd: data.ethereum.usd }
          });
        }
      }
    } catch (error) {
      // Silently fail and keep using fallback/previous prices
      console.log('Price fetch failed, using fallback:', error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial fetch
    fetchPrices();
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      if (isMountedRef.current) {
        fetchPrices();
      }
    }, 300000);
    
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="fixed top-20 left-4 z-40 flex flex-col space-y-2">
      {/* XRP Price */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 min-w-[120px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-cyan-400 text-xs font-medium">XRP</span>
            <DollarSign className="w-3 h-3 text-green-400" />
          </div>
          <span className="text-white text-sm font-bold">
            ${prices.xrp.usd.toFixed(3)}
          </span>
        </div>
      </div>

      {/* ETH Price */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 min-w-[120px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-blue-400 text-xs font-medium">ETH</span>
            <DollarSign className="w-3 h-3 text-green-400" />
          </div>
          <span className="text-white text-sm font-bold">
            ${prices.eth.usd.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-1">
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}