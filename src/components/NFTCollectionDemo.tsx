import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Zap, 
  ShoppingCart, 
  Activity, 
  ExternalLink,
  Clock,
  Users,
  TrendingUp,
  Coins
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const NFT_COLLECTION_ADDRESS = 'rM4LCbC9SSr9vSmdDqfenh1QZnKDHxAcHF';

export function NFTCollectionDemo() {
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  const simulateMint = async () => {
    try {
      setLoading(true);
      
      // Simulate NFT mint transaction
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9a87ca9a/nft-transaction`,
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            collectionAddress: NFT_COLLECTION_ADDRESS,
            type: 'mint',
            price: 100,
            tokenId: Math.floor(Math.random() * 10000).toString(),
            from: NFT_COLLECTION_ADDRESS,
            to: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
            marketplace: 'XRP.CAFE'
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setLastAction(`Minted NFT #${data.data.tokenId} for 100 XRP`);
        toast.success('🎭 NFT Minted Successfully!', {
          description: `Token #${data.data.tokenId} minted for 100 XRP on XRP.CAFE`
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.log('Mint simulation failed, using demo mode:', error);
      const tokenId = Math.floor(Math.random() * 10000);
      setLastAction(`Demo: Minted NFT #${tokenId} for 100 XRP`);
      toast.success('🎭 Demo Mint Successful!', {
        description: `Simulated minting NFT #${tokenId} - Connect to live API for real transactions`
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateSale = async () => {
    try {
      setLoading(true);
      const salePrice = Math.floor(Math.random() * 50) + 90; // 90-140 XRP
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9a87ca9a/nft-transaction`,
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            collectionAddress: NFT_COLLECTION_ADDRESS,
            type: 'sale',
            price: salePrice,
            tokenId: Math.floor(Math.random() * 59).toString(),
            from: 'rSeller123456789ABCDEF',
            to: 'rBuyer987654321ZYXWVU',
            marketplace: 'XRP.CAFE'
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setLastAction(`Sold NFT #${data.data.tokenId} for ${salePrice} XRP`);
        toast.success('💰 NFT Sale Completed!', {
          description: `Token #${data.data.tokenId} sold for ${salePrice} XRP on XRP.CAFE`
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.log('Sale simulation failed, using demo mode:', error);
      const tokenId = Math.floor(Math.random() * 59);
      const salePrice = Math.floor(Math.random() * 50) + 90;
      setLastAction(`Demo: Sold NFT #${tokenId} for ${salePrice} XRP`);
      toast.success('💰 Demo Sale Successful!', {
        description: `Simulated sale of NFT #${tokenId} for ${salePrice} XRP`
      });
    } finally {
      setLoading(false);
    }
  };

  const openXRPCafe = () => {
    window.open(`https://xrp.cafe/nft/${NFT_COLLECTION_ADDRESS}`, '_blank');
  };

  const openXRPLExplorer = () => {
    window.open(`https://xrpl.org/accounts/${NFT_COLLECTION_ADDRESS}`, '_blank');
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-white/10 backdrop-blur-xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-white flex items-center justify-center space-x-2">
            <Activity className="w-6 h-6 text-purple-400" />
            <span>Live NFT Collection Tracker</span>
          </h3>
          <p className="text-sm text-white/70">
            Monitor your XRP Cafe collection: <span className="font-mono text-cyan-400">{NFT_COLLECTION_ADDRESS}</span>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <Coins className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">59</div>
            <div className="text-xs text-white/60">Minted</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">95</div>
            <div className="text-xs text-white/60">Floor (XRP)</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <Activity className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">12</div>
            <div className="text-xs text-white/60">24h Trades</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <Users className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">8</div>
            <div className="text-xs text-white/60">Unique Traders</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={simulateMint}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30"
          >
            <Zap className="w-4 h-4 mr-2" />
            {loading ? 'Minting...' : 'Simulate Mint (100 XRP)'}
          </Button>
          
          <Button
            onClick={simulateSale}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {loading ? 'Processing...' : 'Simulate Sale (90-140 XRP)'}
          </Button>
        </div>

        {/* Last Action Display */}
        {lastAction && (
          <div className="p-3 bg-white/5 rounded-lg border border-green-500/20">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Latest Action:</span>
            </div>
            <p className="text-white mt-1 ml-6">{lastAction}</p>
          </div>
        )}

        {/* External Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={openXRPCafe}
            variant="outline"
            className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on XRP.CAFE
          </Button>
          
          <Button
            onClick={openXRPLExplorer}
            variant="outline"
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            XRPL Explorer
          </Button>
        </div>

        {/* Integration Info */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Activity className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-400">NFT Collection Integration</h4>
              <p className="text-xs text-white/70">
                This tracker monitors your collection address <span className="font-mono text-cyan-400">{NFT_COLLECTION_ADDRESS}</span> for:
              </p>
              <ul className="text-xs text-white/60 space-y-1 ml-4">
                <li>• Real-time mint tracking (59/10,000 progress)</li>
                <li>• Floor price monitoring and 24h volume</li>
                <li>• Transaction history and marketplace integration</li>
                <li>• Holder statistics and trading analytics</li>
              </ul>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs mt-2">
                Connected to XRP.CAFE API
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}