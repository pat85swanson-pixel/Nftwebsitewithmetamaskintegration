import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { GlassButton } from './ui/glass-button';
import { Badge } from './ui/badge';
import { 
  Wallet, 
  LogOut, 
  User, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface User {
  address: string;
  ensName?: string;
  balance?: string;
  network: string;
  isAuthenticated: boolean;
  sessionToken?: string;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function MetaMaskAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullAddress, setShowFullAddress] = useState(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Format address for display
  const formatAddress = (address: string, full = false) => {
    if (!address) return '';
    if (full) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get network name
  const getNetworkName = (chainId: string) => {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum',
      '0x89': 'Polygon',
      '0xa4b1': 'Arbitrum',
      '0x38': 'BSC',
      '0xa': 'Optimism'
    };
    return networks[chainId] || 'Unknown Network';
  };

  // Connect to MetaMask
  const connectMetaMask = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Get network info
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      // Get balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });

      const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);

      setUser({
        address: accounts[0],
        balance: balanceInEth,
        network: getNetworkName(chainId),
        isAuthenticated: false
      });

      toast.success('MetaMask connected successfully!');
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      setError(error.message || 'Failed to connect to MetaMask');
      toast.error('Failed to connect to MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  // Authenticate with signature
  const authenticateUser = async () => {
    if (!user?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsAuthenticating(true);
      setError(null);

      // Create message to sign
      const message = `Sign this message to authenticate with LUCHADOR LUNCH HOUR

Address: ${user.address}
Timestamp: ${new Date().toISOString()}
Nonce: ${Math.random().toString(36).substring(7)}

This request will not trigger a blockchain transaction or cost any gas fees.`;

      // Request signature
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, user.address],
      });

      // Verify signature with backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9a87ca9a/auth/verify`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: user.address,
            message,
            signature,
            network: user.network
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Update user state with session token
      setUser(prev => ({
        ...prev!,
        isAuthenticated: true,
        sessionToken: data.data.sessionToken
      }));

      toast.success('Successfully authenticated!');
    } catch (error: any) {
      console.error('Error authenticating:', error);
      setError(error.message || 'Authentication failed');
      toast.error('Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    try {
      // Logout from backend if authenticated
      if (user?.sessionToken) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-9a87ca9a/auth/logout`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionToken: user.sessionToken
            }),
          }
        );
      }

      setUser(null);
      setError(null);
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Error disconnecting wallet');
    }
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    if (user?.address) {
      await navigator.clipboard.writeText(user.address);
      toast.success('Address copied to clipboard');
    }
  };

  // Check for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (user && accounts[0] !== user.address) {
          // Address changed, need to re-authenticate
          setUser(prev => ({
            ...prev!,
            address: accounts[0],
            isAuthenticated: false,
            sessionToken: undefined
          }));
          toast.info('Account changed. Please authenticate again.');
        }
      };

      const handleChainChanged = (chainId: string) => {
        if (user) {
          setUser(prev => ({
            ...prev!,
            network: getNetworkName(chainId),
            isAuthenticated: false,
            sessionToken: undefined
          }));
          toast.info('Network changed. Please authenticate again.');
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [user]);

  // Auto-connect if previously connected
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectMetaMask();
          }
        })
        .catch(console.error);
    }
  }, []);

  if (!isMetaMaskInstalled()) {
    return (
      <Card className="p-6 bg-red-500/10 border-red-500/20 backdrop-blur-xl">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">MetaMask Required</h3>
          <p className="text-white/70 text-sm">
            Please install MetaMask to connect your wallet and access Web3 features.
          </p>
          <Button
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Install MetaMask
          </Button>
        </div>
      </Card>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <GlassButton
          onClick={connectMetaMask}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30"
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4 mr-2" />
          )}
          Connect MetaMask
        </GlassButton>
        
        {error && (
          <Card className="p-3 bg-red-500/10 border-red-500/20 backdrop-blur-xl">
            <p className="text-red-400 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </p>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Wallet Status Card */}
      <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-xl">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">MetaMask</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                className={`${
                  user.isAuthenticated 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }`}
              >
                {user.isAuthenticated ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <Shield className="w-3 h-3 mr-1" />
                )}
                {user.isAuthenticated ? 'Authenticated' : 'Connected'}
              </Badge>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">Wallet Address:</span>
              <Button
                onClick={copyAddress}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 p-1 h-6"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <div 
              className="font-mono text-sm text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors"
              onClick={() => setShowFullAddress(!showFullAddress)}
            >
              {formatAddress(user.address, showFullAddress)}
            </div>
          </div>

          {/* Network & Balance */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/70">Network:</span>
              <div className="text-white font-medium">{user.network}</div>
            </div>
            <div>
              <span className="text-white/70">Balance:</span>
              <div className="text-white font-medium">{user.balance} ETH</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Authentication Actions */}
      <div className="flex space-x-2">
        {!user.isAuthenticated ? (
          <GlassButton
            onClick={authenticateUser}
            disabled={isAuthenticating}
            className="flex-1 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border-green-500/30 hover:from-green-500/30 hover:to-cyan-500/30"
          >
            {isAuthenticating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            Sign & Authenticate
          </GlassButton>
        ) : (
          <Badge className="flex-1 bg-green-500/20 text-green-400 border-green-500/30 justify-center py-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            Fully Authenticated
          </Badge>
        )}
        
        <Button
          onClick={disconnect}
          variant="outline"
          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400/50"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-3 bg-red-500/10 border-red-500/20 backdrop-blur-xl">
          <p className="text-red-400 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </p>
        </Card>
      )}

      {/* Authentication Instructions */}
      {user && !user.isAuthenticated && (
        <Card className="p-4 bg-blue-500/10 border-blue-500/20 backdrop-blur-xl">
          <div className="space-y-2">
            <h4 className="text-blue-400 font-medium flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Authentication Required
            </h4>
            <p className="text-white/70 text-sm">
              Sign a message to prove wallet ownership and access exclusive features:
            </p>
            <ul className="text-white/60 text-xs space-y-1 ml-4">
              <li>• Free NFT minting privileges</li>
              <li>• Access to holder-only content</li>
              <li>• Community features and updates</li>
              <li>• No gas fees for signature</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}