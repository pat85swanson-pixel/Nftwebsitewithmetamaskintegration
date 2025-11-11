import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  Wallet, 
  ChevronDown, 
  Copy, 
  LogOut, 
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface WalletUser {
  address: string;
  balance?: string;
  network: string;
  walletType: 'metamask' | 'xaman';
  isAuthenticated: boolean;
  sessionToken?: string;
}

declare global {
  interface Window {
    ethereum?: any;
    xumm?: any;
  }
}

export function WalletConnect() {
  const [user, setUser] = useState<WalletUser | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickedOpen, setClickedOpen] = useState(false); // Track if dropdown was opened via click
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check for previously connected wallet on component mount
  useEffect(() => {
    const checkPreviousConnection = async () => {
      try {
        const savedWalletType = localStorage.getItem('luchador-wallet-type');
        const savedConnection = localStorage.getItem('luchador-wallet-connection');
        
        if (savedWalletType && savedConnection) {
          const connectionData = JSON.parse(savedConnection);
          
          // Verify the connection is still valid
          if (savedWalletType === 'metamask' && window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0 && accounts[0] === connectionData.address) {
              // Restore MetaMask connection
              setUser(connectionData);
              toast.success('MetaMask wallet reconnected');
            }
          } else if (savedWalletType === 'xaman') {
            // For Xaman, we'll just restore the saved state (in real implementation, you'd verify with Xaman)
            setUser(connectionData);
            toast.success('Xaman wallet reconnected');
          }
        }
      } catch (error) {
        console.log('Could not restore previous wallet connection:', error);
        // Clear invalid saved data
        clearAllWalletData();
      }
    };

    checkPreviousConnection();
  }, []);

  // Clear all wallet-related data (helper function)
  const clearAllWalletData = () => {
    try {
      localStorage.removeItem('luchador-wallet-connection');
      localStorage.removeItem('luchador-wallet-type');
      localStorage.removeItem('luchador-wallet-session');
      localStorage.removeItem('luchador-xaman-connection');
      localStorage.removeItem('luchador-metamask-connection');
      // Clear any other potential wallet storage keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('luchador-') && key.includes('wallet')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.log('Error clearing wallet data:', error);
    }
  };

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Check if Xaman is installed (simplified check)
  const isXamanInstalled = () => {
    // Note: Xaman typically uses deep links or browser redirect, not direct injection
    return typeof window !== 'undefined';
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-3)}`;
  };

  // Get network name
  const getNetworkName = (chainId: string, walletType: string) => {
    if (walletType === 'xaman') return 'XRPL';
    
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
      setError('MetaMask is not installed');
      toast.error('Please install MetaMask to continue');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });

      const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);

      const newUser = {
        address: accounts[0],
        balance: balanceInEth,
        network: getNetworkName(chainId, 'metamask'),
        walletType: 'metamask' as const,
        isAuthenticated: false
      };

      setUser(newUser);

      // Save connection to localStorage
      localStorage.setItem('luchador-wallet-type', 'metamask');
      localStorage.setItem('luchador-wallet-connection', JSON.stringify(newUser));

      // Auto-authenticate for simplicity
      await authenticateUser(accounts[0], 'metamask');
      
      setIsDropdownOpen(false);
      setClickedOpen(false);
      toast.success('MetaMask connected successfully!');
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      setError(error.message || 'Failed to connect to MetaMask');
      toast.error('Failed to connect to MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect to Xaman (XRPL)
  const connectXaman = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Clear any previous connections first
      clearAllWalletData();

      // For now, we'll simulate XRPL connection
      // In a real implementation, you'd integrate with Xaman SDK or use deep links
      
      // Simulate XRPL address format
      const mockXrplAddress = 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH';
      
      const newUser = {
        address: mockXrplAddress,
        balance: '1,250',
        network: 'XRPL Mainnet',
        walletType: 'xaman' as const,
        isAuthenticated: false
      };

      setUser(newUser);

      // Save connection to localStorage with specific Xaman keys
      localStorage.setItem('luchador-wallet-type', 'xaman');
      localStorage.setItem('luchador-wallet-connection', JSON.stringify(newUser));
      localStorage.setItem('luchador-xaman-connection', JSON.stringify({
        ...newUser,
        connectedAt: new Date().toISOString()
      }));

      // Auto-authenticate
      await authenticateUser(mockXrplAddress, 'xaman');
      
      setIsDropdownOpen(false);
      setClickedOpen(false);
      toast.success('Xaman connected successfully!');
      
      // In real implementation, you would:
      // 1. Open Xaman app via deep link
      // 2. Request user approval
      // 3. Get signed transaction/proof
      // 4. Verify on backend
      
    } catch (error: any) {
      console.error('Error connecting to Xaman:', error);
      setError(error.message || 'Failed to connect to Xaman');
      toast.error('Failed to connect to Xaman');
    } finally {
      setIsConnecting(false);
    }
  };

  // Authenticate user with backend
  const authenticateUser = async (address: string, walletType: string) => {
    try {
      // Create mock signature for authentication
      const message = `Authenticate with LUCHADOR LUNCH HOUR\nAddress: ${address}\nTimestamp: ${new Date().toISOString()}`;
      const mockSignature = '0x' + Array(130).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9a87ca9a/auth/verify`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address,
            message,
            signature: mockSignature,
            network: walletType === 'xaman' ? 'XRPL' : 'EVM'
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const updatedUser = {
          ...user!,
          isAuthenticated: true,
          sessionToken: data.data.sessionToken
        };
        setUser(updatedUser);
        
        // Update localStorage with authenticated state
        localStorage.setItem('luchador-wallet-connection', JSON.stringify(updatedUser));
        if (walletType === 'xaman') {
          localStorage.setItem('luchador-xaman-connection', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  // Enhanced disconnect function with specific Xaman handling
  const disconnect = async () => {
    try {
      setIsConnecting(true); // Show loading state during disconnect
      
      const walletType = user?.walletType;
      
      // Handle MetaMask specific disconnect
      if (user?.walletType === 'metamask' && window.ethereum) {
        try {
          // Request user to disconnect in MetaMask (if supported)
          await window.ethereum.request({
            method: 'wallet_revokePermissions',
            params: [{ eth_accounts: {} }],
          });
        } catch (revokeError) {
          // Fallback: Just clear local state if revoke isn't supported
          console.log('Wallet revoke not supported, clearing local state only');
        }
      }

      // Handle Xaman specific disconnect
      if (user?.walletType === 'xaman') {
        // In a real implementation, you might:
        // 1. Call Xaman API to revoke session
        // 2. Clear Xaman-specific storage
        // 3. Notify Xaman app of disconnect
        console.log('Disconnecting Xaman wallet...');
        
        // Clear Xaman-specific storage
        try {
          localStorage.removeItem('luchador-xaman-connection');
          localStorage.removeItem('luchador-xaman-session');
        } catch (xamanStorageError) {
          console.log('Error clearing Xaman storage:', xamanStorageError);
        }
      }

      // If user has a session token, logout on backend
      if (user?.sessionToken) {
        try {
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-9a87ca9a/auth/logout`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sessionToken: user.sessionToken,
                walletType: user.walletType
              }),
            }
          );
        } catch (backendError) {
          console.log('Backend logout failed, but proceeding with local disconnect');
        }
      }

      // Clear ALL wallet-related local storage
      clearAllWalletData();

      // Clear component state
      setUser(null);
      setError(null);
      setIsDropdownOpen(false);
      setClickedOpen(false);
      
      toast.success(`${walletType === 'metamask' ? 'MetaMask' : 'Xaman'} wallet disconnected successfully!`);
      
      // Force a small delay to ensure all cleanup is complete
      setTimeout(() => {
        setIsConnecting(false);
      }, 500);
      
    } catch (error) {
      console.error('Error disconnecting:', error);
      
      // Force clear everything even if there were errors
      clearAllWalletData();
      setUser(null);
      setError(null);
      setIsDropdownOpen(false);
      setClickedOpen(false);
      setIsConnecting(false);
      
      toast.error('Wallet disconnected (with some errors)');
    }
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    if (user?.address) {
      await navigator.clipboard.writeText(user.address);
      toast.success('Address copied');
      setIsDropdownOpen(false);
      setClickedOpen(false);
    }
  };

  // Enhanced switch wallet function that properly disconnects first
  const switchWallet = async () => {
    try {
      const currentWalletType = user?.walletType;
      
      // Call the full disconnect function first
      await disconnect();
      
      // Wait a moment for disconnect to complete, then show connection options
      setTimeout(() => {
        setIsDropdownOpen(true);
        setClickedOpen(true);
      }, 600);
      
      toast.success(`${currentWalletType === 'metamask' ? 'MetaMask' : 'Xaman'} disconnected - Please select a new wallet`);
    } catch (error) {
      console.error('Error switching wallet:', error);
      // Fallback: force clear state
      clearAllWalletData();
      setUser(null);
      setError(null);
      setTimeout(() => {
        setIsDropdownOpen(true);
        setClickedOpen(true);
      }, 300);
      toast.error('Wallet switched (forced disconnect)');
    }
  };

  // Handle button click - primary interaction method
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isConnecting) return;
    
    // Toggle dropdown state
    const newDropdownState = !isDropdownOpen;
    setIsDropdownOpen(newDropdownState);
    setClickedOpen(newDropdownState);
    
    // If opening dropdown, prevent mouse leave from closing it immediately
    if (newDropdownState) {
      setIsHovered(true);
    }
  };

  // Handle mouse enter - only for unconnected wallets
  const handleMouseEnter = () => {
    setIsHovered(true);
    // Only auto-open on hover if no user is connected and not already clicked open
    if (!user && !clickedOpen) {
      setIsDropdownOpen(true);
    }
  };

  // Handle mouse leave - more intelligent closing
  const handleMouseLeave = () => {
    setIsHovered(false);
    
    // Only close dropdown after delay if it wasn't opened by click
    // and if we're not hovering over the dropdown itself
    setTimeout(() => {
      if (!isHovered && !clickedOpen) {
        setIsDropdownOpen(false);
      } else if (!isHovered && clickedOpen) {
        // For clicked dropdowns, only close if we're really leaving the component area
        const dropdownElement = dropdownRef.current;
        if (dropdownElement && !dropdownElement.matches(':hover')) {
          setIsDropdownOpen(false);
          setClickedOpen(false);
        }
      }
    }, 150);
  };

  // Handle dropdown mouse enter/leave
  const handleDropdownMouseEnter = () => {
    setIsHovered(true);
  };

  const handleDropdownMouseLeave = () => {
    setIsHovered(false);
    // Close dropdown after delay when leaving dropdown area
    setTimeout(() => {
      if (!isHovered) {
        setIsDropdownOpen(false);
        setClickedOpen(false);
      }
    }, 150);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.wallet-dropdown')) {
        setIsDropdownOpen(false);
        setClickedOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div 
        className="relative wallet-dropdown"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={dropdownRef}
      >
        {/* Connect Wallet Button - Smaller and More Compact */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg blur-sm"></div>
          <button
            onClick={handleButtonClick}
            disabled={isConnecting}
            className="relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 group transform-gpu bg-white/10 border-2 border-white/20 backdrop-blur-xl shadow-xl text-white/80 hover:text-white hover:bg-white/15 hover:scale-105 hover:border-white/30"
          >
            {/* Background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button content */}
            <div className="relative flex items-center space-x-1.5 z-10">
              {isConnecting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Wallet className="w-3 h-3" />
              )}
              <span className="whitespace-nowrap">Connect</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </div>
            
            {/* Hover shimmer effect */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </div>
          </button>
          
          {/* Outer glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <Card 
            className="absolute top-full right-0 mt-2 w-72 p-4 bg-black/80 border-2 border-white/20 backdrop-blur-xl z-50 shadow-2xl"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                setClickedOpen(false);
              }}
              className="absolute top-2 right-2 p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4 mt-2">
              <h3 className="text-white font-medium text-sm mb-4">Choose Wallet</h3>
              
              {/* Enhanced MetaMask Option */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg blur-sm"></div>
                <button
                  onClick={connectMetaMask}
                  disabled={!isMetaMaskInstalled() || isConnecting}
                  className="relative w-full p-4 rounded-lg border-2 border-orange-500/30 text-white hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-300 group transform-gpu hover:scale-105 backdrop-blur-sm"
                >
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-between z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-lg flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">MetaMask</div>
                        <div className="text-xs text-white/60">Ethereum & EVM Networks</div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-orange-400" />
                  </div>
                </button>
              </div>

              {/* Enhanced Xaman Option */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg blur-sm"></div>
                <button
                  onClick={connectXaman}
                  disabled={isConnecting}
                  className="relative w-full p-4 rounded-lg border-2 border-blue-500/30 text-white hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-300 group transform-gpu hover:scale-105 backdrop-blur-sm"
                >
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-between z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Xaman</div>
                        <div className="text-xs text-white/60">XRP Ledger Network</div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-blue-400" />
                  </div>
                </button>
              </div>

              {/* Installation Notice */}
              {!isMetaMaskInstalled() && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-xs text-yellow-400">
                    MetaMask not detected. 
                    <button 
                      onClick={() => window.open('https://metamask.io/download/', '_blank')}
                      className="text-cyan-400 hover:underline ml-1 font-medium"
                    >
                      Install here
                    </button>
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div 
      className="relative wallet-dropdown"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      {/* Connected Wallet Button - Smaller and More Compact */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg blur-sm"></div>
        <button
          onClick={handleButtonClick}
          disabled={isConnecting}
          className="relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 group transform-gpu bg-gradient-to-r from-cyan-500/40 to-purple-500/40 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/25 text-white hover:scale-105"
        >
          {/* Background glow for connected state */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur-md"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg"></div>
          
          {/* Button content */}
          <div className="relative flex items-center space-x-1.5 z-10">
            {isConnecting ? (
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
            ) : (
              <div className={`w-2 h-2 rounded-full ${
                user.walletType === 'metamask' ? 'bg-orange-500' : 'bg-blue-500'
              }`}></div>
            )}
            <span className="whitespace-nowrap">{formatAddress(user.address)}</span>
            {user.isAuthenticated && !isConnecting && (
              <CheckCircle className="w-2.5 h-2.5 text-green-400" />
            )}
            <ChevronDown className="w-2.5 h-2.5" />
          </div>
          
          {/* Hover shimmer effect */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </div>
        </button>
        
        {/* Connected state glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 rounded-lg blur-xl opacity-50"></div>
      </div>

      {/* Connected Wallet Dropdown */}
      {isDropdownOpen && (
        <Card 
          className="absolute top-full right-0 mt-2 w-80 p-4 bg-black/80 border-2 border-white/20 backdrop-blur-xl z-50 shadow-2xl"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              setClickedOpen(false);
            }}
            className="absolute top-2 right-2 p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-4 mt-2">
            {/* Wallet Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-5 h-5 rounded-full ${
                  user.walletType === 'metamask' ? 'bg-orange-500' : 'bg-blue-500'
                }`}></div>
                <span className="text-white font-medium text-sm">
                  {user.walletType === 'metamask' ? 'MetaMask' : 'Xaman'}
                </span>
              </div>
              <Badge 
                className={`text-xs ${
                  user.isAuthenticated 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }`}
              >
                {user.isAuthenticated ? 'Authenticated' : 'Connected'}
              </Badge>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-xs">Address:</span>
                <Button
                  onClick={copyAddress}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-cyan-400 hover:bg-cyan-400/10"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="font-mono text-xs text-cyan-400 bg-white/5 p-3 rounded border border-white/10">
                {user.address}
              </div>
            </div>

            {/* Network & Balance */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/70">Network:</span>
                <div className="text-white font-medium">{user.network}</div>
              </div>
              <div>
                <span className="text-white/70">Balance:</span>
                <div className="text-white font-medium">
                  {user.balance} {user.walletType === 'metamask' ? 'ETH' : 'XRP'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-2 border-t border-white/10">
              <Button
                onClick={switchWallet}
                variant="outline"
                size="sm"
                disabled={isConnecting}
                className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              >
                {isConnecting ? (
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                ) : (
                  <Wallet className="w-3 h-3 mr-2" />
                )}
                Switch Wallet
              </Button>
              <Button
                onClick={disconnect}
                variant="outline"
                size="sm"
                disabled={isConnecting}
                className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                {isConnecting ? (
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                ) : (
                  <LogOut className="w-3 h-3 mr-2" />
                )}
                Disconnect
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}