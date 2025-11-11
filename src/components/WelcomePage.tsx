import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { GlassButton } from './ui/glass-button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Wallet, Download, AlertTriangle, Shield, Zap, Leaf, DollarSign, Eye, BookOpen, ShoppingBag, Minus, Plus, Crown, FileText } from 'lucide-react';
import { Header } from './Header';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SocialLinksUnderLogo } from './SocialLinksUnderLogo';
import luchador1 from 'figma:asset/344e9808f03aff30e20a899fcc54feae1aa05c8d.png';
import luchador2 from 'figma:asset/42943818dc68564fc93d97eaf9f4dc299ac1ba99.png';
import luchador3 from 'figma:asset/5b7871ca5c355496d2694cd5e6b4d88d8aa7da7e.png';
import luchadorLogo from 'figma:asset/d96f0d49bf7e9a063cb897d69419742d0758ac55.png';

interface WelcomePageProps {
  onEnter: () => void;
  setCurrentPage: (page: string) => void;
  showHeader?: boolean;
}

export function WelcomePage({ onEnter, setCurrentPage, showHeader = false }: WelcomePageProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasXummWallet, setHasXummWallet] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [mintQuantity, setMintQuantity] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const mintPrice = 0.05; // ETH
  const maxMint = 10;
  const totalSupply = 10000;
  const minted = 59;

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

  // Check for XUMM wallet on component mount
  useEffect(() => {
    const checkXummWallet = () => {
      if (typeof window !== 'undefined') {
        // In a real implementation, this would check for XUMM SDK or xApp
        const hasXummInstalled = typeof window.xumm !== 'undefined' || localStorage.getItem('xumm_connected');
        setHasXummWallet(hasXummInstalled);
        setIsChecking(false);
      }
    };

    // Check immediately
    checkXummWallet();

    // Also check after a short delay in case XUMM loads slowly
    const timer = setTimeout(checkXummWallet, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock XUMM wallet connection (replace with real implementation)
  const connectWallet = async () => {
    if (!hasXummWallet) {
      return;
    }

    setIsConnecting(true);
    
    try {
      // Mock connection - replace with real XUMM integration
      setTimeout(() => {
        setWalletAddress('rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH');
        localStorage.setItem('xumm_connected', 'true');
        setIsConnecting(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to connect XUMM wallet:', error);
      setIsConnecting(false);
    }
  };

  const handleMint = async () => {
    setIsMinting(true);
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      alert(`¡Órale! Successfully minted ${mintQuantity} Hungry Luchador${mintQuantity > 1 ? 's' : ''}!`);
    }, 3000);
  };

  const adjustQuantity = (change: number) => {
    const newQuantity = mintQuantity + change;
    if (newQuantity >= 1 && newQuantity <= maxMint) {
      setMintQuantity(newQuantity);
    }
  };

  const handleEnterSite = () => {
    onEnter();
  };

  const handleBrowseWithoutWallet = () => {
    // Allow users to browse the site without connecting wallet
    onEnter();
  };

  const openXummDownload = () => {
    window.open('https://xumm.app/', '_blank');
  };

  const handleNavigateToMint = () => {
    setCurrentPage('mint');
    onEnter();
  };

  const handleNavigateToAbout = () => {
    setCurrentPage('about');
    onEnter();
  };

  const handleNavigateToWhitepaper = () => {
    setCurrentPage('whitepaper');
    onEnter();
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-cyan-400/30"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      
      <div 
        className={`relative overflow-hidden ${showHeader ? 'min-h-screen' : 'min-h-screen'}`}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Floating Orbs Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className={`absolute ${showHeader ? 'top-32' : 'top-20'} left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse`}
            style={{
              transform: `translate3d(${mousePosition.x * 20}px, ${mousePosition.y * 20}px, 0) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          ></div>
          <div 
            className={`absolute ${showHeader ? 'top-72' : 'top-60'} right-32 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg animate-bounce`}
            style={{
              transform: `translate3d(${mousePosition.x * -15}px, ${mousePosition.y * -15}px, 0)`,
              transition: 'transform 0.1s ease-out',
              animationDelay: '1s'
            }}
          ></div>
          <div 
            className="absolute bottom-32 left-1/3 w-20 h-20 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-lg animate-pulse"
            style={{
              transform: `translate3d(${mousePosition.x * 25}px, ${mousePosition.y * -10}px, 0)`,
              transition: 'transform 0.1s ease-out',
              animationDelay: '2s'
            }}
          ></div>
        </div>

        <div className={`container max-w-6xl mx-auto px-4 ${showHeader ? 'py-8' : 'py-12'} relative z-10`}>
          {/* Hero Section with 3D Transform */}
          <div 
            className="text-center mb-16"
            style={{
              transform: `translate3d(0, ${mousePosition.y * -5}px, 0) rotateX(${mousePosition.y * 2}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30 backdrop-blur-sm hover:scale-110 transition-transform duration-300">
              <Crown className="w-3 h-3 mr-1" />
              10K Hungry Champions
            </Badge>
            
            {/* Logo with same styling as AboutPage */}
            <div 
              className="text-center mb-12"
              style={{
                transform: `translate3d(0, ${mousePosition.y * -5}px, 0) perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="relative max-w-md mx-auto hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl animate-pulse"></div>
                <img
                  src={luchadorLogo}
                  alt="LUCHADOR LUNCH HOUR - Official Hungry Luchador Mask Logo"
                  className="relative rounded-2xl w-full shadow-2xl hover:shadow-cyan-500/30 transition-shadow duration-500"
                  style={{
                    filter: 'drop-shadow(0 0 25px rgba(139, 92, 246, 0.3))'
                  }}
                />
              </div>
              
              {/* Social Links Under Logo */}
              <SocialLinksUnderLogo />
            </div>
            
            <h1 
              className="text-5xl md:text-7xl font-bold text-purple-400 mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse"
              style={{
                textShadow: '0 0 30px rgba(139, 92, 246, 0.3), 0 0 60px rgba(6, 182, 212, 0.2)',
                transform: `perspective(500px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              Hungry Luchadors
            </h1>
            <p 
              className="text-xl text-white/70 mb-8 max-w-2xl mx-auto backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10"
              style={{
                transform: `translate3d(0, ${mousePosition.y * -3}px, 0)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              GET READY FOR A BLOCKCHAIN BELLY BUSTER!
              Ready to mint a masterpiece of lunchtime mayhem?!
              Luchador Lunch Hour throws down 10K unique NFTS.
              Each with a hunger and a taste for victory!
              These luchadors aren't just masked marvels, they're midday meal mavens!
              lets's strap on our virtual web3 luchador mask and enter 
              the ring for some DING DING DING grub worthy action.
              Get ready to rumble, punch, grapple, wrestle and trade 
              your way to the top for Lunch Hour Glory!
            </p>
            
            {/* Progress Bar with 3D Effect */}
            <div 
              className="max-w-md mx-auto mb-8"
              style={{
                transform: `translate3d(0, ${mousePosition.y * -2}px, 0) rotateX(${mousePosition.y * 1}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>{minted.toLocaleString()} hungry luchadores</span>
                <span>{totalSupply.toLocaleString()} total</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 border border-white/20 backdrop-blur-sm overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    width: `${(minted / totalSupply) * 100}%`,
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons with Liquid Glass Effect - Only show when not using header */}
            {!showHeader && (
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <GlassButton
                  onClick={handleNavigateToWhitepaper}
                  size="lg"
                  variant="outline"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Whitepaper
                </GlassButton>
                <GlassButton
                  onClick={handleNavigateToMint}
                  size="lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Mint & Gallery
                </GlassButton>
                <GlassButton
                  onClick={handleNavigateToAbout}
                  size="lg"
                  variant="outline"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  About
                </GlassButton>
              </div>
            )}
          </div>

          {/* Mint Section with 3D Cards */}
          <div 
            className="grid lg:grid-cols-2 gap-12 items-center mb-16"
            style={{
              transform: `translate3d(0, ${mousePosition.y * -8}px, 0)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="order-2 lg:order-1">
              <Card 
                className="p-8 bg-white/5 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform-gpu hover:scale-105 hover:-translate-y-2"
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
                  transition: 'transform 0.1s ease-out',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 246, 0.1)'
                }}
              >
                {!hasXummWallet ? (
                  // XUMM not installed - Show mint preview but require wallet
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-orange-500/30 transition-shadow duration-300">
                      <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Xaman or MetaMask Wallet Required</h2>
                    <p className="text-white/70 mb-6">
                      You need Xaman (XRPL) or MetaMask (EVM) wallet to mint NFTs and join the Hungry Luchador arena. 
                      Choose your preferred blockchain - XRPL for fast, low-cost transactions or Ethereum for widespread compatibility.
                    </p>
                  </div>
                ) : !walletAddress ? (
                  // XUMM installed but not connected
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-300">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Connect Your XRP Wallet</h2>
                    <p className="text-white/70 mb-6">
                      Connect your XUMM wallet to verify your identity and start minting 
                      exclusive Hungry Luchador NFTs on the XRP Ledger!
                    </p>
                    <div className="space-y-4">
                      <GlassButton
                        onClick={connectWallet}
                        disabled={isConnecting}
                        size="lg"
                        className="w-full"
                      >
                        {isConnecting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Connecting to XUMM...
                          </div>
                        ) : (
                          <>
                            <Wallet className="w-5 h-5 mr-2" />
                            Connect XUMM Wallet
                          </>
                        )}
                      </GlassButton>
                    </div>
                  </div>
                ) : (
                  // Wallet connected - Show mint interface
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">Feed Your Hunger</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white/70 mb-2">Quantity</label>
                        <div className="flex items-center space-x-4 justify-center">
                          <GlassButton
                            onClick={() => adjustQuantity(-1)}
                            disabled={mintQuantity <= 1}
                            variant="outline"
                            size="icon"
                          >
                            <Minus className="w-4 h-4" />
                          </GlassButton>
                          <span className="text-2xl font-bold text-white w-12 text-center">
                            {mintQuantity}
                          </span>
                          <GlassButton
                            onClick={() => adjustQuantity(1)}
                            disabled={mintQuantity >= maxMint}
                            variant="outline"
                            size="icon"
                          >
                            <Plus className="w-4 h-4" />
                          </GlassButton>
                        </div>
                        <p className="text-sm text-white/50 mt-1 text-center">Max {maxMint} per transaction</p>
                      </div>

                      <div className="border-t border-white/10 pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-white/70">Price per Hungry Luchador</span>
                          <span className="text-white">{mintPrice} ETH</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-lg font-semibold text-white">Total</span>
                          <span className="text-2xl font-bold text-cyan-400">
                            {(mintPrice * mintQuantity).toFixed(3)} ETH
                          </span>
                        </div>
                      </div>

                      <GlassButton
                        onClick={handleMint}
                        disabled={isMinting}
                        size="lg"
                        className="w-full"
                      >
                        {isMinting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            ¡Luchando!...
                          </div>
                        ) : (
                          `Mint ${mintQuantity} Hungry Luchador${mintQuantity > 1 ? 's' : ''}`
                        )}
                      </GlassButton>

                      <div className="text-center pt-4">
                        <GlassButton
                          onClick={handleEnterSite}
                          variant="outline"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          Enter the Arena
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            <div className="order-1 lg:order-2">
              <div 
                className="relative"
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * -3}deg) rotateY(${mousePosition.x * -3}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                {/* Three Luchador Images with Enhanced 3D Effects */}
                <div className="relative">
                  {/* Main center luchador */}
                  <div 
                    className="relative z-20 mx-auto w-80 h-80 hover:scale-110 transition-transform duration-500"
                    style={{
                      transform: `translate3d(${mousePosition.x * 10}px, ${mousePosition.y * 10}px, 20px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-2xl blur-xl animate-pulse"></div>
                    <img
                      src={luchador2}
                      alt="Hungry Luchador Champion 1"
                      className="relative rounded-2xl w-full h-full object-cover shadow-2xl border-2 border-purple-400/50 hover:border-purple-400/80 transition-all duration-300"
                      style={{
                        filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))'
                      }}
                    />
                  </div>
                  
                  {/* Left luchador */}
                  <div 
                    className="absolute -left-8 top-16 z-10 w-60 h-60 hover:scale-105 transition-transform duration-500"
                    style={{
                      transform: `translate3d(${mousePosition.x * -8}px, ${mousePosition.y * 8}px, 10px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-2xl blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <img
                      src={luchador1}
                      alt="Hungry Luchador Champion 2"
                      className="relative rounded-2xl w-full h-full object-cover shadow-xl border-2 border-cyan-400/40 opacity-80 hover:opacity-100 transition-all duration-300"
                      style={{
                        filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.3))'
                      }}
                    />
                  </div>
                  
                  {/* Right luchador */}
                  <div 
                    className="absolute -right-8 top-20 z-10 w-60 h-60 hover:scale-105 transition-transform duration-500"
                    style={{
                      transform: `translate3d(${mousePosition.x * 8}px, ${mousePosition.y * -8}px, 10px) rotateX(${mousePosition.y * -3}deg) rotateY(${mousePosition.x * -3}deg)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-yellow-500/30 rounded-2xl blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <img
                      src={luchador3}
                      alt="Hungry Luchador Champion 3"
                      className="relative rounded-2xl w-full h-full object-cover shadow-xl border-2 border-orange-400/40 opacity-80 hover:opacity-100 transition-all duration-300"
                      style={{
                        filter: 'drop-shadow(0 0 15px rgba(251, 146, 60, 0.3))'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section with 3D Cards */}
          <div 
            className="grid md:grid-cols-3 gap-8"
            style={{
              transform: `translate3d(0, ${mousePosition.y * -5}px, 0)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {[
              { icon: Shield, title: "Legendary Hunger", description: "Each Hungry Luchador has an insatiable appetite for victory and unique fighting styles", color: "cyan" },
              { icon: Zap, title: "Inside & Outside Ring", description: "Ready to throwdown anywhere - from the wrestling ring to street fights and beyond", color: "blue" },
              { icon: Crown, title: "Championship Feast", description: "Holders feast on exclusive tournaments, rewards, and championship opportunities", color: "purple" }
            ].map((feature, index) => (
              <Card 
                key={index}
                className="p-6 bg-white/5 backdrop-blur-xl border-white/10 text-center hover:bg-white/10 transition-all duration-500 transform-gpu hover:scale-105 hover:-translate-y-4 group"
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
                  transition: 'transform 0.1s ease-out',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <feature.icon 
                  className={`w-12 h-12 text-${feature.color}-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  style={{
                    filter: `drop-shadow(0 0 10px rgba(${feature.color === 'cyan' ? '6, 182, 212' : feature.color === 'blue' ? '59, 130, 246' : '139, 92, 246'}, 0.4))`
                  }}
                />
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">{feature.title}</h3>
                <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}