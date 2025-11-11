import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { FileText, Target, Users, Crown, Zap, TrendingUp, Shield, AlertTriangle, Link, Network } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SocialLinksUnderLogo } from './SocialLinksUnderLogo';
import luchadorLogo from 'figma:asset/d96f0d49bf7e9a063cb897d69419742d0758ac55.png';

export function WhitePaperPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const sections = [
    {
      id: 'abstract',
      title: 'Abstract',
      icon: FileText,
      content: `Luchador Lunch Hour is a groundbreaking collection of 10,000 unique NFTs depicting vibrant and colorful luchadors enjoying a midday meal. This multi-chain project operates on both XRPL and EVM-compatible networks, making it accessible to a broader community of collectors and enthusiasts. The project aims to build a strong and engaged community around the playful aesthetic of Mexican wrestling culture, coupled with the relatable and universally enjoyed concept of lunchtime. Beyond the digital collectibles themselves, Luchador Lunch Hour will offer holders exclusive access to community events, merchandise, and future project expansions, fostering a dynamic and rewarding ecosystem across multiple blockchain networks.`
    },
    {
      id: 'introduction',
      title: '1. Introduction',
      icon: Target,
      content: `The NFT space is constantly evolving, with projects seeking to offer more than just digital art. Luchador Lunch Hour distinguishes itself by combining a captivating visual style with a clear community-focused vision and innovative multi-chain deployment. We celebrate the rich culture of luchadors, infusing it with a lighthearted, relatable twist – the universal experience of lunchtime. This project is more than just a collection; it's a gateway to a vibrant community and a platform for future creative endeavors that bridges the gap between XRPL and EVM ecosystems.`
    },
    {
      id: 'blockchain',
      title: '2. Multi-Chain Architecture',
      icon: Network,
      content: `Luchador Lunch Hour leverages the strengths of both XRPL and EVM-compatible blockchains to provide maximum accessibility and utility:`,
      list: [
        'XRPL Integration: Native NFT support with low transaction costs and energy-efficient consensus mechanisms.',
        'EVM Compatibility: Seamless integration with Ethereum ecosystem, including MetaMask and popular marketplaces.',
        'Cross-Chain Interoperability: Future-ready infrastructure for potential bridging capabilities.',
        'Dual Wallet Support: Native support for both Xaman (XRPL) and MetaMask (EVM) wallets.',
        'Unified Experience: Consistent user experience regardless of chosen blockchain.'
      ]
    },
    {
      id: 'vision',
      title: '3. Project Vision',
      icon: Crown,
      content: `Our vision is to create a thriving multi-chain community centered around the unique and entertaining world of Luchador Lunch Hour.`,
      list: [
        'Deliver High-Quality, Unique NFTs: Each of the 10,000 NFTs will be meticulously generated, ensuring a diverse and engaging collection available on both networks.',
        'Build a Strong Multi-Chain Community: We prioritize community engagement across both XRPL and EVM ecosystems through interactive events, exclusive content, and open communication.',
        'Foster Long-Term Value: We are committed to developing a sustainable ecosystem that provides ongoing value to our holders regardless of their blockchain preference.',
        'Pioneer Cross-Chain Innovation: Explore future expansions that leverage the unique capabilities of both XRPL and EVM networks.'
      ]
    },
    {
      id: 'collection',
      title: '4. NFT Collection Details',
      icon: Zap,
      content: `Collection Size: 10,000 unique NFTs (distributed across both chains).

Art Style: A vibrant, cartoonish style that blends the iconic imagery of humorous Luchadors with lunchtime goodies.

Generation Process: The NFTs will be algorithmically generated using a combination of hand-drawn assets and sophisticated generation scripts optimized for both XRPL and EVM standards.

Pricing Structure:
• XRPL: 300 XRP per NFT (~$200 USD equivalent)
• EVM: 0.08 ETH per NFT (~$200 USD equivalent)`,
      traits: [
        'Masks',
        'Outfits', 
        'Lunch items',
        'Backgrounds',
        'Accessories'
      ],
      note: 'Rarity will be determined by the frequency of these traits, with some combinations being exceptionally rare across both blockchain networks.'
    },
    {
      id: 'utility',
      title: '5. Utility and Community Benefits',
      icon: Users,
      content: `Holding a Luchador Lunch Hour NFT will unlock a range of benefits regardless of which blockchain you choose:`,
      list: [
        'Exclusive Community Access: Holders will gain access to a private Discord server and other community platforms.',
        'Cross-Chain Merchandise Drops: Exclusive merchandise featuring Luchador Lunch Hour characters and designs.',
        'Multi-Network Airdrops: Regular airdrops of new NFTs and other digital assets compatible with your chosen network.',
        'Unified Voting Rights: Participation in community votes regarding future project directions across both chains.',
        'Access to Future Experiences: Priority access to future project expansions, including potential metaverse integrations, games, and animated content.',
        'Collaborations: We aim to collaborate with artists, brands, and other NFT projects from both XRPL and EVM ecosystems.',
        'IRL Events: Cross-community meetups and events for all holders regardless of blockchain preference.'
      ]
    }
  ];

  const roadmapPhases = [
    {
      phase: 'Phase 1: Multi-Chain Development and Community Building',
      items: [
        'Finalize art development and generation scripts for both XRPL and EVM.',
        'Deploy smart contracts and establish NFT standards for both networks.',
        'Build a strong online presence and engage with both XRPL and EVM communities.',
        'Establish a robust Discord server and unified community platform.'
      ]
    },
    {
      phase: 'Phase 2: Dual-Chain NFT Launch and Distribution',
      items: [
        'Launch the 10,000 NFT collection across both XRPL and EVM networks.',
        'Implement fair distribution strategies for both blockchain ecosystems.',
        'Onboard new community members from diverse blockchain backgrounds.',
        'Establish cross-chain marketplace presence.'
      ]
    },
    {
      phase: 'Phase 3: Cross-Chain Community Engagement',
      items: [
        'Launch exclusive merchandise drops for all holders.',
        'Organize unified community events and cross-chain giveaways.',
        'Implement voting rights and community governance spanning both networks.',
        'Develop cross-chain utility features.'
      ]
    },
    {
      phase: 'Phase 4: Advanced Multi-Chain Features',
      items: [
        'Explore potential cross-chain bridging capabilities.',
        'Develop metaverse integrations compatible with both ecosystems.',
        'Create animated content and storytelling that celebrates both communities.',
        'Partner with projects from both XRPL and EVM spaces.',
        'Continue expanding the brand across multiple blockchain networks.'
      ]
    }
  ];

  return (
    <div 
      className="container mx-auto px-4 py-12 relative overflow-hidden"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Floating Orbs Background */}
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

      {/* Header */}
      <div 
        className="text-center mb-12 relative z-10"
        style={{
          transform: `translate3d(0, ${mousePosition.y * -3}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <h1 
          className="text-4xl md:text-6xl font-bold text-purple-400 mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse"
          style={{
            textShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
            transform: `perspective(500px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          Whitepaper
        </h1>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 mb-16">
        {sections.map((section, index) => (
          <Card 
            key={section.id}
            className="p-8 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform-gpu hover:scale-[1.02] hover:-translate-y-2 relative z-10"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg) rotateY(${mousePosition.x * 1}deg)`,
              transition: 'transform 0.1s ease-out',
              animationDelay: `${index * 0.1}s`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.1)'
            }}
          >
            <div className="flex items-center mb-6">
              <section.icon className="w-6 h-6 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            </div>
            
            <div className="text-white/80 leading-relaxed">
              {section.content.split('\n\n').map((paragraph, pIndex) => (
                <p key={pIndex} className="mb-4">{paragraph}</p>
              ))}
              
              {section.list && (
                <ul className="space-y-3 mt-6">
                  {section.list.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {section.traits && (
                <div className="mt-6">
                  <p className="font-semibold text-white mb-3">Traits and Rarity: Each Luchador will possess a unique combination of traits, including:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {section.traits.map((trait, traitIndex) => (
                      <Badge key={traitIndex} className="bg-purple-500/20 text-purple-400 border-purple-500/30 justify-center">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-cyan-400 italic">{section.note}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Roadmap Section */}
      <Card 
        className="p-8 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform-gpu hover:scale-[1.02] hover:-translate-y-2 mb-8 relative z-10"
        style={{
          transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg) rotateY(${mousePosition.x * 1}deg)`,
          transition: 'transform 0.1s ease-out',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.1)'
        }}
      >
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 text-cyan-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">6. Roadmap</h2>
        </div>
        
        <div className="space-y-6">
          {roadmapPhases.map((phase, index) => (
            <div key={index} className="border-l-2 border-cyan-500/30 pl-6 relative">
              <div className="absolute -left-2 top-2 w-3 h-3 bg-cyan-400 rounded-full"></div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">{phase.phase}</h3>
              <ul className="space-y-2">
                {phase.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start text-white/70">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Tokenomics Section */}
      <Card 
        className="p-8 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform-gpu hover:scale-[1.02] hover:-translate-y-2 mb-8 relative z-10"
        style={{
          transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg) rotateY(${mousePosition.x * 1}deg)`,
          transition: 'transform 0.1s ease-out',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.1)'
        }}
      >
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 text-cyan-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">7. Tokenomics & Revenue Model</h2>
        </div>
        <div className="text-white/80 leading-relaxed">
          <p className="mb-4">
            Luchador Lunch Hour operates as a pure NFT collection without additional tokens. Revenue streams are designed to support long-term community development and cross-chain ecosystem growth.
          </p>
          <ul className="space-y-3 mt-6">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span><strong className="text-cyan-400">Primary Sales:</strong> Initial mint revenue from both XRPL and EVM networks</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span><strong className="text-cyan-400">Secondary Sales:</strong> Royalty percentage from marketplace transactions on both chains</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span><strong className="text-cyan-400">Community Wallet:</strong> Funded through secondary sales to support ongoing development and community events</span>
            </li>
          </ul>
        </div>
      </Card>

      {/* Conclusion, Disclaimer, Contact */}
      <div className="space-y-6">
        <Card 
          className="p-6 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform-gpu hover:scale-[1.02] hover:-translate-y-2 relative z-10"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg) rotateY(${mousePosition.x * 1}deg)`,
            transition: 'transform 0.1s ease-out',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
          }}
        >
          <div className="flex items-center mb-4">
            <Crown className="w-5 h-5 text-cyan-400 mr-2" />
            <h3 className="text-xl font-bold text-white">8. Conclusion</h3>
          </div>
          <p className="text-white/80 leading-relaxed">
            Luchador Lunch Hour represents the future of NFT projects by embracing multi-chain accessibility and community-first values. By operating on both XRPL and EVM networks, we're building bridges between blockchain communities while celebrating the vibrant culture of Lucha Libre and the universal joy of lunchtime. We are committed to building a sustainable, cross-chain ecosystem that provides ongoing value and entertainment to our holders regardless of their blockchain preference. Join us on this exciting multi-chain journey as we create a unique and engaging world that spans the entire Web3 ecosystem.
          </p>
        </Card>

        <Card 
          className="p-6 bg-red-500/10 border-red-500/30 backdrop-blur-xl shadow-2xl relative z-10"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg) rotateY(${mousePosition.x * 1}deg)`,
            transition: 'transform 0.1s ease-out',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
          }}
        >
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <h3 className="text-xl font-bold text-red-400">9. Disclaimer</h3>
          </div>
          <p className="text-red-200/80 leading-relaxed">
            Investing in NFTs carries inherent risks across all blockchain networks. This whitepaper is for informational purposes only and does not constitute financial advice. Multi-chain operations involve additional complexities and potential risks. Please conduct your own research and understand the specific risks associated with both XRPL and EVM networks before making any investment decisions.
          </p>
        </Card>

        <Card 
          className="p-6 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform-gpu hover:scale-[1.02] hover:-translate-y-2 relative z-10"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg) rotateY(${mousePosition.x * 1}deg)`,
            transition: 'transform 0.1s ease-out',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
          }}
        >
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-cyan-400 mr-2" />
            <h3 className="text-xl font-bold text-white">10. Contact Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-white/70">
            <div>
              <p><strong className="text-cyan-400">Website:</strong> [Insert Website Address]</p>
              <p><strong className="text-cyan-400">Discord:</strong> https://discord.gg/luchadorlunchhour</p>
            </div>
            <div>
              <p><strong className="text-cyan-400">Twitter:</strong> https://x.com/HUNGRYLUCHADORS</p>
              <p><strong className="text-cyan-400">Email:</strong> luchadorlunchhour@gmail.com</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}