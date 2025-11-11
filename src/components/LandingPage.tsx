import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Wallet, Zap, CheckCircle, AlertCircle } from 'lucide-react';

export function LandingPage() {
  const [connectedWallets, setConnectedWallets] = useState({
    metamask: null as string | null,
    xaman: null as string | null
  });
  const [isConnecting, setIsConnecting] = useState({
    metamask: false,
    xaman: false
  });

  const handleConnectMetaMask = async () => {
    setIsConnecting(prev => ({ ...prev, metamask: true }));
    
    try {
      // Check if MetaMask is installed
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          // Request account access
          const accounts = await (window as any).ethereum.request({
            method: 'eth_requestAccounts',
          });
          
          if (accounts.length > 0) {
            setConnectedWallets(prev => ({ ...prev, metamask: accounts[0] }));
            setIsConnecting(prev => ({ ...prev, metamask: false }));
            alert(`¡Órale! MetaMask connected successfully!\nAddress: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`);
          }
        } catch (error: any) {
          console.error('MetaMask connection error:', error);
          setIsConnecting(prev => ({ ...prev, metamask: false }));
          
          if (error.code === 4001) {
            alert('MetaMask connection was rejected by user.');
          } else {
            alert('Failed to connect to MetaMask. Please try again.');
          }
        }
      } else {
        // Simulate MetaMask connection for demo purposes
        setTimeout(() => {
          setConnectedWallets(prev => ({ ...prev, metamask: '0x742d35Cc6Aa00532Df4a9F4b8e0Dd2a4' }));
          setIsConnecting(prev => ({ ...prev, metamask: false }));
          alert('¡Órale! MetaMask connected successfully! (Demo mode - install MetaMask for real connection)');
        }, 2000);
      }
    } catch (error) {
      setIsConnecting(prev => ({ ...prev, metamask: false }));
      alert('Failed to connect MetaMask wallet. Please try again.');
    }
  };

  const handleConnectXaman = async () => {
    setIsConnecting(prev => ({ ...prev, xaman: true }));
    
    try {
      // Check if Xaman is available (this would be the actual Xaman SDK in production)
      if (typeof window !== 'undefined' && (window as any).xaman) {
        // Real Xaman connection would go here
        try {
          const result = await (window as any).xaman.payload.create({
            TransactionType: 'SignIn'
          });
          
          if (result.response.account) {
            setConnectedWallets(prev => ({ ...prev, xaman: result.response.account }));
            setIsConnecting(prev => ({ ...prev, xaman: false }));
            alert(`¡Órale! Xaman connected successfully!\nAddress: ${result.response.account}`);
          }
        } catch (error) {
          console.error('Xaman connection error:', error);
          setIsConnecting(prev => ({ ...prev, xaman: false }));
          alert('Failed to connect to Xaman. Please try again.');
        }
      } else {
        // Simulate Xaman wallet connection for demo purposes
        setTimeout(() => {
          setConnectedWallets(prev => ({ ...prev, xaman: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH' }));
          setIsConnecting(prev => ({ ...prev, xaman: false }));
          alert('¡Órale! Xaman connected successfully! (Demo mode - install Xaman for real connection)');
        }, 2000);
      }
    } catch (error) {
      setIsConnecting(prev => ({ ...prev, xaman: false }));
      alert('Failed to connect Xaman wallet. Please try again.');
    }
  };

  const handleDisconnectWallet = (walletType: 'metamask' | 'xaman') => {
    setConnectedWallets(prev => ({ ...prev, [walletType]: null }));
    alert(`${walletType === 'metamask' ? 'MetaMask' : 'Xaman'} wallet disconnected successfully!`);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative px-4 py-12 text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Logo Section */}
        <div className="relative z-10 mb-12">
          <div className="flex justify-center mb-8">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop"
              alt="Luchador Lunch Hour Logo"
              className="w-32 h-32 rounded-full shadow-2xl border-4 border-cyan-400/50 animate-bounce"
            />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 animate-pulse">
            LUCHADOR LUNCH HOUR
          </h1>
          
          <p className="text-2xl md:text-3xl text-purple-300 mb-4 animate-fade-in">
            10K Hungry Champions
          </p>

          {/* Multi-Chain Badge */}
          <div className="flex justify-center space-x-4 mb-8">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              EVM Compatible
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              XRPL Native
            </Badge>
          </div>
        </div>

        {/* Three Overlapping Luchadors */}
        <div className="relative flex justify-center items-center mb-16">
          {/* Left Luchador */}
          <div className="absolute left-0 z-10 transform -translate-x-8">
            <div className="w-60 h-60 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-transparent rounded-full blur-xl"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1594736797933-d0201ba2fe65?w=240&h=240&fit=crop"
                alt="Hungry Luchador Left"
                className="relative rounded-full w-full h-full shadow-2xl border-2 border-cyan-400/50 animate-float"
              />
            </div>
          </div>

          {/* Center Luchador (Main) */}
          <div className="z-20">
            <div className="w-80 h-80 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/40 to-cyan-400/40 rounded-full blur-xl animate-pulse"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=320&h=320&fit=crop"
                alt="Hungry Luchador Center"
                className="relative rounded-full w-full h-full shadow-2xl border-4 border-purple-400/50 animate-bounce-slow"
              />
            </div>
          </div>

          {/* Right Luchador */}
          <div className="absolute right-0 z-10 transform translate-x-8">
            <div className="w-60 h-60 relative">
              <div className="absolute inset-0 bg-gradient-to-l from-blue-400/30 to-transparent rounded-full blur-xl"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=240&h=240&fit=crop"
                alt="Hungry Luchador Right"
                className="relative rounded-full w-full h-full shadow-2xl border-2 border-blue-400/50 animate-float-reverse"
              />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>4,237 Hungry Luchadores</span>
            <span>10,000 Total</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-1000 shadow-lg"
              style={{ width: '42.37%' }}
            ></div>
          </div>
          <p className="text-xs text-white/50 mt-2">42.37% Minted</p>
        </div>

        {/* Multi-Chain Wallet Connection */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Ready to Enter the Ring?</h2>
            <p className="text-center text-white/70 mb-8">Connect your wallet to mint your Hungry Luchador NFT</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* EVM/MetaMask Section */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">MetaMask</h3>
                      <p className="text-sm text-white/60">EVM Network</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">ETH</Badge>
                </div>
                
                {!connectedWallets.metamask ? (
                  <div className="space-y-4">
                    <Button
                      onClick={handleConnectMetaMask}
                      disabled={isConnecting.metamask}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 text-lg rounded-xl border-0 shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      {isConnecting.metamask ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Connecting to MetaMask...
                        </div>
                      ) : (
                        <>
                          <Wallet className="w-5 h-5 mr-3" />
                          Connect to MetaMask
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-white/60">
                        Price: <span className="text-blue-400 font-semibold">0.08 ETH</span> per NFT
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        (~$200 USD equivalent)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        <p className="text-green-400 font-semibold">MetaMask Connected!</p>
                      </div>
                      <p className="text-sm text-white/60 font-mono">{formatAddress(connectedWallets.metamask)}</p>
                    </div>
                    <Button
                      onClick={() => handleDisconnectWallet('metamask')}
                      variant="outline"
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                    >
                      Disconnect MetaMask
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-white/60">
                        Ready to mint on <span className="text-blue-400 font-semibold">EVM Network</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* XRPL/Xaman Section */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-xl p-6 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Xaman</h3>
                      <p className="text-sm text-white/60">XRPL Network</p>
                    </div>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">XRP</Badge>
                </div>
                
                {!connectedWallets.xaman ? (
                  <div className="space-y-4">
                    <Button
                      onClick={handleConnectXaman}
                      disabled={isConnecting.xaman}
                      className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white py-4 text-lg rounded-xl border-0 shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      {isConnecting.xaman ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Connecting to Xaman...
                        </div>
                      ) : (
                        <>
                          <Wallet className="w-5 h-5 mr-3" />
                          Connect to Xaman
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-white/60">
                        Price: <span className="text-cyan-400 font-semibold">300 XRP</span> per NFT
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        (~$200 USD equivalent)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        <p className="text-green-400 font-semibold">Xaman Connected!</p>
                      </div>
                      <p className="text-sm text-white/60 font-mono">{formatAddress(connectedWallets.xaman)}</p>
                    </div>
                    <Button
                      onClick={() => handleDisconnectWallet('xaman')}
                      variant="outline"
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                    >
                      Disconnect Xaman
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-white/60">
                        Ready to mint on <span className="text-cyan-400 font-semibold">XRPL Network</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Connection Status Summary */}
            <div className="mt-8 text-center">
              {connectedWallets.metamask && connectedWallets.xaman ? (
                <div className="flex items-center justify-center text-green-400">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <p className="font-semibold">Both wallets connected! You can mint on either network.</p>
                </div>
              ) : connectedWallets.metamask || connectedWallets.xaman ? (
                <div className="flex items-center justify-center text-yellow-400">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <p>One wallet connected. Connect both for full multi-chain access!</p>
                </div>
              ) : (
                <p className="text-white/60">
                  Connect to either wallet to start minting • Free mints available (6 per wallet) • Cross-chain compatibility
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(-32px); }
          50% { transform: translateY(-20px) translateX(-32px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) translateX(32px); }
          50% { transform: translateY(-20px) translateX(32px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}