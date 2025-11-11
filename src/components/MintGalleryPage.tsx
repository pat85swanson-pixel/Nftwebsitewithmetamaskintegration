import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { GlassButton } from './ui/glass-button';
import { ExternalLink, Crown, Zap, Gift, Sparkles, Coins } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SocialLinksUnderLogo } from './SocialLinksUnderLogo';
import { CryptoPriceDisplay } from './CryptoPriceDisplay';
import luchadorLogo from 'figma:asset/d96f0d49bf7e9a063cb897d69419742d0758ac55.png';
import freeMintLuchador1 from 'figma:asset/fb91a346e210708111c99fc0540e6b24b37108fc.png';
import freeMintLuchador2 from 'figma:asset/43357792579ace4d98664859567c03140cd87b4b.png';
import freeMintLuchador3 from 'figma:asset/f277ab435ec5d6227f46d19421767059f257e926.png';
import freeMintLuchador4 from 'figma:asset/3736afd338c442f37d93a171debc2a1298238f7d.png';
import freeMintLuchador5 from 'figma:asset/d371fe99a782e6987619e7877df6589609fba7ff.png';
import freeMintLuchador6 from 'figma:asset/873b47d3aa8009b337d42ae73655e0e9c63a71f7.png';

export function MintGalleryPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for 3D effects (same as home page)
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

  // Free Mint NFT data (actual collection pieces)
  const freeMintData = [
    {
      id: 1,
      name: "Skull Crusher Champion",
      image: freeMintLuchador1,
      rarity: "Legendary",
      category: "Champion",
      available: true,
      traits: ["Skull Mask", "Yellow Cape", "Ice Cream Power"],
      description: "The legendary skull crusher with mysterious ice cream powers"
    },
    {
      id: 2,
      name: "Blue Demon Warrior",
      image: freeMintLuchador2,
      rarity: "Epic", 
      category: "Demon",
      available: true,
      traits: ["Blue Mask", "Demon Horns", "Triple Scoop"],
      description: "Ancient blue demon wielding the power of the sacred triple scoop"
    },
    {
      id: 3,
      name: "Donut Slasher",
      image: freeMintLuchador3,
      rarity: "Rare",
      category: "Slasher",
      available: true,
      traits: ["Hockey Mask", "Donut Power", "Pink Gear"],
      description: "The unstoppable donut slasher with an insatiable appetite"
    },
    {
      id: 4,
      name: "Ice Cream Hero",
      image: freeMintLuchador4,
      rarity: "Epic",
      category: "Hero",
      available: true,
      traits: ["Blue Cape", "Ice Cream Stack", "Champion Spirit"],
      description: "The heroic blue champion who fights hunger with delicious ice cream treats"
    },
    {
      id: 5,
      name: "Donut Guardian",
      image: freeMintLuchador5,
      rarity: "Legendary",
      category: "Guardian",
      available: true,
      traits: ["Golden Armor", "Sacred Donut", "Pink Might"],
      description: "The mighty guardian protecting the sacred pink donut from all evil forces"
    },
    {
      id: 6,
      name: "LEGO Lunch Champion",
      image: freeMintLuchador6,
      rarity: "Epic",
      category: "Builder",
      available: true,
      traits: ["Block Style", "Hot Dog Power", "Rainbow Mask"],
      description: "The legendary block-building champion who constructs victories with hot dog fuel"
    }
  ];

  const totalSupply = 10000;
  const minted = 59;

  const handleExternalMint = () => {
    window.open('https://xrp.cafe/collection/luchadorlunchhour', '_blank');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div 
      className="container mx-auto px-4 py-12 relative overflow-hidden"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Floating Orbs Background (same as home page) */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"
          style={{
            transform: `translate3d(${mousePosition.x * 20}px, ${mousePosition.y * 20}px, 0) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        ></div>
        <div 
          className="absolute top-60 right-32 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg animate-bounce"
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

      {/* Luchador Logo */}
      <div 
        className="text-center mb-8 relative z-10"
        style={{
          transform: `translate3d(0, ${mousePosition.y * -5}px, 0) perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="relative max-w-md mx-auto hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl animate-pulse"></div>
          <ImageWithFallback
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

      {/* Hero Section */}
      <div 
        className="text-center mb-12 relative z-10"
        style={{
          transform: `translate3d(0, ${mousePosition.y * -5}px, 0) rotateX(${mousePosition.y * 2}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="flex justify-center space-x-4 mb-4">
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            <Crown className="w-3 h-3 mr-1" />
            Browse & Collect 10K Hungry Champions
          </Badge>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Coins className="w-3 h-3 mr-1" />
            Mint on XRP Ledger
          </Badge>
        </div>
        <h1 
          className="text-4xl md:text-6xl font-bold text-purple-400 mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse"
          style={{
            textShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
            transform: `perspective(500px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          Hungry Luchador Gallery
        </h1>
        <p 
          className="text-xl text-white/70 max-w-2xl mx-auto mb-8 backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10"
          style={{
            transform: `translate3d(0, ${mousePosition.y * -2}px, 0)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          Discover your legendary Hungry Luchador collection! Mint directly on the XRP Ledger 
          for ultra-fast, eco-friendly transactions with minimal fees.
        </p>
        
        {/* Progress Bar */}
        <div 
          className="max-w-md mx-auto mb-8"
          style={{
            transform: `translate3d(0, ${mousePosition.y * -1}px, 0) rotateX(${mousePosition.y * 1}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>{minted.toLocaleString()} hungry luchadores minted</span>
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
      </div>

      {/* Live Crypto Prices */}
      <CryptoPriceDisplay />

      {/* Simplified Main Mint Section */}
      <div 
        className="mb-16 relative z-10 text-center"
        style={{
          transform: `translate3d(0, ${mousePosition.y * -3}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="max-w-lg mx-auto">
          <GlassButton
            onClick={handleExternalMint}
            size="lg"
            className="px-16 py-8 text-2xl font-bold bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 hover:from-cyan-500/30 hover:to-purple-500/30 hover:border-cyan-400/50 transform-gpu hover:scale-105 hover:-translate-y-2 transition-all duration-500"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
              transition: 'transform 0.1s ease-out',
              boxShadow: '0 25px 50px -12px rgba(6, 182, 212, 0.3)'
            }}
          >
            <Zap className="w-8 h-8 mr-4" />
            🚀 MINT ON XRP.CAFE 🚀
            <ExternalLink className="w-6 h-6 ml-4" />
          </GlassButton>
          
          <p className="text-white/60 text-lg mt-6 max-w-md mx-auto">
            Mint your Hungry Luchador NFT directly on the XRP Ledger
          </p>
        </div>
      </div>

      {/* FREE MINTS Section */}
      <div 
        className="mb-16 relative z-10"
        style={{
          transform: `translate3d(0, ${mousePosition.y * -3}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center space-x-4 mb-6">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Gift className="w-3 h-3 mr-1" />
              LOW-COST MINTS AVAILABLE
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Only 0.00008 XRP
            </Badge>
          </div>
          
          <h2 
            className="text-3xl md:text-5xl font-bold text-green-400 mb-4 bg-gradient-to-r from-green-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent"
            style={{
              textShadow: '0 0 30px rgba(34, 197, 94, 0.3)',
              transform: `perspective(500px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            🎁 LOW-COST MINTS 🎁
          </h2>
          
          <p 
            className="text-lg text-white/70 max-w-2xl mx-auto backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10"
            style={{
              transform: `translate3d(0, ${mousePosition.y * -1}px, 0)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            🚀 **Limited Low-Cost Mint Collection!** 🚀<br/>
            Get these exclusive Hungry Luchador NFTs for just <span className="text-green-400 font-bold">0.00008 XRP</span>! 
            Ultra-affordable minting at a fraction of the regular price. First come, first served!
          </p>
        </div>

        {/* Free Mint Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 max-w-full mx-auto">
          {freeMintData.map((nft, index) => (
            <Card 
              key={nft.id} 
              className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border-green-500/30 backdrop-blur-xl overflow-hidden hover:bg-gradient-to-br hover:from-green-500/20 hover:to-cyan-500/20 transition-all duration-500 transform-gpu hover:scale-105 hover:-translate-y-4 group shadow-2xl hover:shadow-green-500/30"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
                transition: 'transform 0.1s ease-out',
                animationDelay: `${index * 0.1}s`,
                boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.2)'
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Low Cost Badge */}
                <Badge className="absolute top-3 left-3 bg-green-500/90 text-white border-green-400 font-bold animate-pulse">
                  <Gift className="w-3 h-3 mr-1" />
                  0.00008
                </Badge>
                
                {/* Rarity Badge */}
                <Badge className={`absolute top-3 right-3 ${getRarityColor(nft.rarity)}`}>
                  {nft.rarity}
                </Badge>

                {/* Floating Sparkles */}
                <div className="absolute top-16 left-6 animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="absolute top-20 right-8 animate-bounce" style={{ animationDelay: '1s' }}>
                  <Sparkles className="w-3 h-3 text-green-400" />
                </div>
                <div className="absolute bottom-20 left-8 animate-bounce" style={{ animationDelay: '1.5s' }}>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-white mb-2 text-lg">{nft.name}</h3>
                <p className="text-white/70 text-sm mb-4">{nft.description}</p>
                
                {/* Traits */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {nft.traits.map((trait, traitIndex) => (
                    <Badge 
                      key={traitIndex}
                      className="bg-white/10 text-white/80 border-white/20 text-xs"
                    >
                      {trait}
                    </Badge>
                  ))}
                </div>

                {/* Low Cost Mint Button */}
                <GlassButton
                  onClick={handleExternalMint}
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 border-green-500/30 hover:from-green-500/30 hover:to-cyan-500/30 hover:border-green-400/50 font-bold"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  MINT FOR 0.00008!
                  <ExternalLink className="w-4 h-4 ml-2" />
                </GlassButton>
              </div>
            </Card>
          ))}
        </div>

        {/* Free Mint Info */}
        <div 
          className="text-center mt-8 p-6 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-2xl border border-green-500/20 max-w-4xl mx-auto"
          style={{
            transform: `translate3d(0, ${mousePosition.y * -2}px, 0)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <h3 className="text-xl font-bold text-green-400 mb-3">🔥 Low-Cost Mint Details 🔥</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
            <div>
              <p className="font-semibold text-white mb-1">💰 Cost</p>
              <p>Only 0.00008 XRP + network fees</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">⏰ Availability</p>
              <p>Limited time - First come, first served</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">🎯 Network</p>
              <p>XRP Ledger via XRP.CAFE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div 
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10"
        style={{
          transform: `translate3d(0, ${mousePosition.y * -3}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {[
          { value: freeMintData.length, label: "Low-Cost Mint Options", color: "green" },
          { value: "100 XRP", label: "Regular Mint Price", color: "purple" },
          { value: totalSupply.toLocaleString(), label: "Total Collection", color: "blue" },
          { value: minted.toLocaleString(), label: "Already Minted", color: "cyan" }
        ].map((stat, index) => (
          <Card 
            key={index}
            className="p-6 bg-white/5 border-white/10 backdrop-blur-xl text-center hover:scale-105 hover:-translate-y-2 transition-all duration-500 transform-gpu group"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg) rotateY(${mousePosition.x * 1}deg)`,
              transition: 'transform 0.1s ease-out',
              animationDelay: `${index * 0.1}s`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
            }}
          >
            <h3 className={`text-2xl font-bold text-${stat.color}-400 mb-2 group-hover:scale-110 transition-transform duration-300`}>
              {stat.value}
            </h3>
            <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">{stat.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}