import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'
import authRoutes from './auth.tsx'

const app = new Hono()

// CORS and logging middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))
app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Mount auth routes
app.route('/make-server-9a87ca9a/auth', authRoutes)

// NFT Pricing Constants
const NFT_PRICE_XRP = 100;  // Fixed: 100 XRP per NFT

// Types
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
  eth: number; // This will be calculated based on USD equivalence
  usdFromXRP: string;
  usdFromETH: string;
  ethCalculated: boolean; // Flag to show ETH amount was calculated
}

interface HolderData {
  address: string;
  network: 'XRPL' | 'EVM';
  nftCount: number;
  firstMintDate: string;
  lastActivity: string;
}

interface CollectionStats {
  totalHolders: number;
  xrplHolders: number;
  evmHolders: number;
  totalNFTs: number;
  averageNFTsPerHolder: number;
  lastUpdated: string;
}

// Fetch crypto prices from CoinGecko API
async function fetchCryptoPrices(): Promise<CryptoPrices> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ripple,ethereum&vs_currencies=usd,eth&include_last_updated_at=true'
    )
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Use live market prices for both currencies
    const xrpUsdPrice = data.ripple.usd;
    const ethUsdPrice = data.ethereum.usd; // Keep live ETH price
    
    console.log('=== LIVE CRYPTO PRICES ===');
    console.log(`XRP Market Price: $${xrpUsdPrice}`);
    console.log(`ETH Market Price: $${ethUsdPrice}`);
    console.log('=== END LIVE PRICES ===');
    
    return {
      xrp: {
        usd: xrpUsdPrice,
        eth: data.ripple.eth,
        lastUpdated: new Date(data.ripple.last_updated_at * 1000).toISOString()
      },
      eth: {
        usd: ethUsdPrice, // Use live market price
        lastUpdated: new Date(data.ethereum.last_updated_at * 1000).toISOString()
      }
    }
  } catch (error) {
    console.log('Error fetching crypto prices:', error)
    throw error
  }
}

// Calculate NFT pricing with live prices
function calculateNFTPricing(prices: CryptoPrices): NFTPricing {
  // NFT costs 100 XRP (fixed)
  const nftPriceInUSD = NFT_PRICE_XRP * prices.xrp.usd;
  
  // Calculate how much ETH is needed to equal that USD amount
  const ethAmountNeeded = nftPriceInUSD / prices.eth.usd;
  
  console.log('=== NFT PRICING CALCULATION ===');
  console.log(`NFT Price: ${NFT_PRICE_XRP} XRP`);
  console.log(`XRP Price: $${prices.xrp.usd}`);
  console.log(`NFT USD Value: $${nftPriceInUSD.toFixed(2)}`);
  console.log(`ETH Price: $${prices.eth.usd}`);
  console.log(`ETH Amount Needed: ${ethAmountNeeded.toFixed(6)} ETH`);
  console.log(`Verification: ${ethAmountNeeded.toFixed(6)} ETH × $${prices.eth.usd} = $${(ethAmountNeeded * prices.eth.usd).toFixed(2)}`);
  console.log('=== END CALCULATION ===');
  
  return {
    xrp: NFT_PRICE_XRP,
    eth: parseFloat(ethAmountNeeded.toFixed(6)), // Dynamic ETH amount
    usdFromXRP: nftPriceInUSD.toFixed(2),
    usdFromETH: (ethAmountNeeded * prices.eth.usd).toFixed(2),
    ethCalculated: true
  };
}

// Calculate fallback prices with typical values
function calculateFallbackPrices(xrpPrice: number = 0.67, ethPrice: number = 2400): { prices: CryptoPrices, nftPricing: NFTPricing } {
  const prices: CryptoPrices = {
    xrp: {
      usd: xrpPrice,
      eth: 0.0003, // Approximate XRP/ETH ratio
      lastUpdated: new Date().toISOString()
    },
    eth: {
      usd: ethPrice, // Use realistic ETH price
      lastUpdated: new Date().toISOString()
    }
  };
  
  const nftPricing = calculateNFTPricing(prices);
  
  return { prices, nftPricing };
}

// Update prices in database
async function updateStoredPrices() {
  try {
    const prices = await fetchCryptoPrices()
    const nftPricing = calculateNFTPricing(prices);
    
    await kv.set('crypto_prices', prices)
    await kv.set('nft_pricing', nftPricing)
    await kv.set('prices_last_update', new Date().toISOString())
    
    console.log('Prices updated successfully:', { prices, nftPricing })
    return { prices, nftPricing }
  } catch (error) {
    console.log('Error updating stored prices:', error)
    throw error
  }
}

// Get cached prices or fetch new ones
async function getCachedData(): Promise<{ prices: CryptoPrices, nftPricing: NFTPricing }> {
  try {
    const cachedPrices = await kv.get('crypto_prices')
    const cachedNFTPricing = await kv.get('nft_pricing')
    const lastUpdate = await kv.get('prices_last_update')
    
    // Check if cache is older than 5 minutes
    if (cachedPrices && cachedNFTPricing && lastUpdate) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      const lastUpdateDate = new Date(lastUpdate as string)
      
      if (lastUpdateDate > fiveMinutesAgo) {
        return {
          prices: cachedPrices as CryptoPrices,
          nftPricing: cachedNFTPricing as NFTPricing
        }
      }
    }
    
    // Cache is stale or doesn't exist, fetch new prices
    return await updateStoredPrices()
  } catch (error) {
    console.log('Error getting cached data:', error)
    // Return fallback with realistic values
    return calculateFallbackPrices();
  }
}

// Routes

// Get current crypto prices
app.get('/make-server-9a87ca9a/prices', async (c) => {
  try {
    const { prices, nftPricing } = await getCachedData()
    
    // Debug log to verify pricing
    console.log('=== PRICE RESPONSE DEBUG ===');
    console.log(`${nftPricing.xrp} XRP = $${nftPricing.usdFromXRP}`);
    console.log(`${nftPricing.eth} ETH = $${nftPricing.usdFromETH}`);
    console.log(`Price Difference: $${Math.abs(parseFloat(nftPricing.usdFromXRP) - parseFloat(nftPricing.usdFromETH)).toFixed(2)}`);
    console.log('=== END DEBUG ===');
    
    const response = {
      success: true,
      data: {
        crypto: prices,
        nftPricing: {
          ...nftPricing,
          details: {
            xrpPrice: prices.xrp.usd,
            ethPrice: prices.eth.usd,
            ethAmountCalculated: nftPricing.ethCalculated,
            priceDifference: Math.abs(parseFloat(nftPricing.usdFromXRP) - parseFloat(nftPricing.usdFromETH)).toFixed(4)
          }
        },
        lastUpdated: new Date().toISOString()
      }
    }
    
    return c.json(response)
  } catch (error) {
    console.log('Error fetching prices:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch crypto prices',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Add or update holder address
app.post('/make-server-9a87ca9a/holders', async (c) => {
  try {
    const body = await c.req.json()
    const { address, network, nftCount } = body
    
    if (!address || !network || typeof nftCount !== 'number') {
      return c.json({
        success: false,
        error: 'Missing required fields: address, network, nftCount'
      }, 400)
    }
    
    if (!['XRPL', 'EVM'].includes(network)) {
      return c.json({
        success: false,
        error: 'Network must be either XRPL or EVM'
      }, 400)
    }
    
    const holderKey = `holder:${network}:${address}`
    const existingHolder = await kv.get(holderKey)
    
    const holderData: HolderData = {
      address,
      network: network as 'XRPL' | 'EVM',
      nftCount,
      firstMintDate: existingHolder ? (existingHolder as HolderData).firstMintDate : new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }
    
    await kv.set(holderKey, holderData)
    
    // Update collection stats
    await updateCollectionStats()
    
    return c.json({
      success: true,
      data: holderData,
      message: existingHolder ? 'Holder updated successfully' : 'Holder added successfully'
    })
  } catch (error) {
    console.log('Error managing holder:', error)
    return c.json({
      success: false,
      error: 'Failed to manage holder data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get holder information
app.get('/make-server-9a87ca9a/holders/:network/:address', async (c) => {
  try {
    const network = c.req.param('network')
    const address = c.req.param('address')
    
    if (!['XRPL', 'EVM'].includes(network)) {
      return c.json({
        success: false,
        error: 'Network must be either XRPL or EVM'
      }, 400)
    }
    
    const holderKey = `holder:${network}:${address}`
    const holderData = await kv.get(holderKey)
    
    if (!holderData) {
      return c.json({
        success: false,
        error: 'Holder not found'
      }, 404)
    }
    
    return c.json({
      success: true,
      data: holderData
    })
  } catch (error) {
    console.log('Error fetching holder:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch holder data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get all holders
app.get('/make-server-9a87ca9a/holders', async (c) => {
  try {
    const holderEntries = await kv.getByPrefix('holder:')
    const holders = holderEntries.map(entry => entry.value as HolderData)
    
    return c.json({
      success: true,
      data: {
        holders,
        count: holders.length
      }
    })
  } catch (error) {
    console.log('Error fetching holders:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch holders data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get collection statistics  
app.get('/make-server-9a87ca9a/stats', async (c) => {
  try {
    const stats = await kv.get('collection_stats') as CollectionStats
    
    if (!stats) {
      // Generate initial stats
      await updateCollectionStats()
      const newStats = await kv.get('collection_stats') as CollectionStats
      return c.json({
        success: true,
        data: newStats || {
          totalHolders: 0,
          xrplHolders: 0,
          evmHolders: 0,
          totalNFTs: 0,
          averageNFTsPerHolder: 0,
          lastUpdated: new Date().toISOString()
        }
      })
    }
    
    return c.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.log('Error fetching stats:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch collection statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Update collection statistics
async function updateCollectionStats() {
  try {
    const holderEntries = await kv.getByPrefix('holder:')
    const holders = holderEntries.map(entry => entry.value as HolderData)
    
    const xrplHolders = holders.filter(h => h.network === 'XRPL').length
    const evmHolders = holders.filter(h => h.network === 'EVM').length
    const totalNFTs = holders.reduce((sum, holder) => sum + holder.nftCount, 0)
    
    const stats: CollectionStats = {
      totalHolders: holders.length,
      xrplHolders,
      evmHolders,
      totalNFTs,
      averageNFTsPerHolder: holders.length > 0 ? Math.round((totalNFTs / holders.length) * 100) / 100 : 0,
      lastUpdated: new Date().toISOString()
    }
    
    await kv.set('collection_stats', stats)
    console.log('Collection stats updated:', stats)
  } catch (error) {
    console.log('Error updating collection stats:', error)
  }
}

// Get current pricing debug info (admin endpoint)
app.get('/make-server-9a87ca9a/pricing-debug', async (c) => {
  try {
    const { prices, nftPricing } = await getCachedData()
    
    return c.json({
      success: true,
      debug: {
        constants: {
          NFT_PRICE_XRP
        },
        livePrices: {
          xrp_usd: prices.xrp.usd,
          eth_usd: prices.eth.usd
        },
        calculations: {
          nft_usd_value: `${NFT_PRICE_XRP} XRP × $${prices.xrp.usd} = $${nftPricing.usdFromXRP}`,
          eth_amount_needed: `$${nftPricing.usdFromXRP} ÷ $${prices.eth.usd} = ${nftPricing.eth} ETH`,
          verification: `${nftPricing.eth} ETH × $${prices.eth.usd} = $${nftPricing.usdFromETH}`,
          difference: `$${Math.abs(parseFloat(nftPricing.usdFromXRP) - parseFloat(nftPricing.usdFromETH)).toFixed(4)}`
        }
      }
    })
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to get debug info',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Force price update (admin endpoint)
app.post('/make-server-9a87ca9a/update-prices', async (c) => {
  try {
    const { prices, nftPricing } = await updateStoredPrices()
    return c.json({
      success: true,
      data: { prices, nftPricing },
      message: 'Prices updated successfully'
    })
  } catch (error) {
    console.log('Error forcing price update:', error)
    return c.json({
      success: false,
      error: 'Failed to update prices',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Health check
app.get('/make-server-9a87ca9a/health', (c) => {
  return c.json({
    success: true,
    message: 'LUCHADOR LUNCH HOUR API is running',
    timestamp: new Date().toISOString()
  })
})

// Initialize prices on startup
updateStoredPrices().catch(error => {
  console.log('Failed to initialize prices on startup:', error)
})

Deno.serve(app.fetch)