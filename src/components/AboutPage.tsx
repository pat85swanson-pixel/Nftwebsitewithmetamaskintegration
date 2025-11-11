import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { GlassButton } from './ui/glass-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Users, Crown, Code, Twitter, Github, MessageCircle, Coins, Shield, Zap, Lock, TrendingUp, Globe, Send, Leaf, Heart, Star, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SocialLinksUnderLogo } from './SocialLinksUnderLogo';
import luchadorImage from 'figma:asset/d96f0d49bf7e9a063cb897d69419742d0758ac55.png';
import lauraImage from 'figma:asset/beb0dfadb7af9b6be20a2b77e75353fa525bce03.png';
import luchadorCharacterImage from 'figma:asset/9179ae957d7da0b3fb4033e947be60af2067306f.png';
import nbImage from 'figma:asset/4bd013c76a80ee86478c7e522e3dda0531881127.png';
import honeyImage from 'figma:asset/a6375c4c95746c24535a3df0dfdee91acd53b4f8.png';
import brothersKeeperImage from 'figma:asset/34d127d82fa6080aa674e60d2eee8adf2d243973.png';
import supawcoolImage from 'figma:asset/1cb487aa3c957d55f243b459fdd24868c15964e1.png';
import kydSisterImage from 'figma:asset/0988b521c87b8c3dc51fddbd8c6f67bf8e9963b9.png';
import { useState, useEffect } from 'react';

export function AboutPage() {
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

  const teamMembers = [
    {
      name: "Luchador",
      role: "Project Creator, Head Developer, web3 and Smart Contract Developer",
      image: luchadorCharacterImage,
      bio: "Responsible for all project decisions, creativity, vision, all art and web development. The hungry mastermind behind the wrestling revolution.",
      twitter: "https://x.com/HUNGRYLUCHADORS",
      discord: "https://discord.gg/JPrgqHt8"
    },
    {
      name: "Laura",
      role: "Project Director and Community Mod",
      image: lauraImage,
      bio: "Career catalyst/ Modding the blockchain and crypto space for growth",
      telegram: "https://t.me/LAURA_MODXRP"
    },
    {
      name: "NB",
      role: "Trusted Community KOL",
      image: nbImage,
      bio: "Key opinion leader bridging communities and amplifying the hungry luchador movement across all blockchain ecosystems.",
      twitter: "https://x.com/NBweb3_"
    },
    {
      name: "Averi",
      role: "Project Funder & Strategic Investor",
      image: kydSisterImage,
      bio: "Averi is her name, she's a project funder who always helps fuel the hungry luchador vision with strategic investments and unwavering support for the community.",
      twitter: "https://x.com/kydsister_xrp"
    }
  ];

  // WEB3 FRENS profiles - All three members now complete
  const web3Frens = [
    {
      name: "HONEY",
      role: "Community Champion",
      image: honeyImage,
      bio: "She's as cool as can BEE! She always drops by with a hive full of good vibez and warm energy!",
      twitter: "https://x.com/honey_xrp",
      discord: "honey_xrp"
    },
    {
      name: "Brother's Keeper", 
      role: "A-1 Day 1",
      image: brothersKeeperImage,
      bio: "He's been here since day one with the loyalty any crypto bro would love! Always liking and retweeting content, Showing up every time on time!",
      twitter: "https://x.com/Carpe_99_Diem",
      telegram: "https://t.me/MonteCrypto589"
    },
    {
      name: "SUPAWCOOL",
      role: "Yappin Buddy",
      image: supawcoolImage,
      bio: "We get our yap on from time to time. My guy keeps me going with genuine yappin engagements. In the NFT world he's the king of custom Paw Buddy style NFTs so you should definitely check him out!",
      twitter: "https://x.com/supawcool",
      website: "https://supawcool.com"
    }
  ];

  const handleTwitterClick = () => {
    window.open('https://x.com/HUNGRYLUCHADORS', '_blank');
  };

  const handleDiscordClick = () => {
    window.open('https://discord.gg/JPrgqHt8', '_blank');
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

      {/* Luchador Image at Top with 3D effects (same as home page) */}
      <div 
        className="text-center mb-12"
        style={{
          transform: `translate3d(0, ${mousePosition.y * -5}px, 0) perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="relative max-w-md mx-auto hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl animate-pulse"></div>
          <ImageWithFallback
            src={luchadorImage}
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

      {/* About Hungry Luchadors Section */}
      <div 
        className="text-center mb-16"
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
          About Hungry Luchadors
        </h1>
        <p 
          className="text-xl text-white/70 max-w-3xl mx-auto backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10"
          style={{
            transform: `translate3d(0, ${mousePosition.y * -2}px, 0)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          We're unleashing 10,000 unique Hungry Luchadors into the blockchain arena - 
          legendary masked fighters with an insatiable appetite for victory, ready to throwdown anywhere!
        </p>
      </div>

      {/* Team Section with 3D Cards - Moved up after About section */}
      <div 
        className="mb-16"
        style={{
          transform: `translate3d(0, ${mousePosition.y * -6}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <h2 
          className="text-5xl md:text-7xl font-bold text-purple-400 mb-12 text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse"
          style={{
            textShadow: '0 0 30px rgba(139, 92, 246, 0.3), 0 0 60px rgba(6, 182, 212, 0.2)',
            transform: `perspective(500px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          Meet the Lucha Gang
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => {
            const CardContent = (
              <Card 
                className="p-6 bg-white/5 border-white/10 backdrop-blur-xl text-center hover:bg-white/10 transition-all duration-500 transform-gpu hover:scale-105 hover:-translate-y-4 group"
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
                  transition: 'transform 0.1s ease-out',
                  animationDelay: `${index * 0.1}s`,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
                }}
              >
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full blur-lg animate-pulse"></div>
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="relative w-20 h-20 rounded-full object-cover border-2 border-white/20 group-hover:border-cyan-400/50 transition-all duration-300"
                    style={{
                      filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.2))'
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">{member.name}</h3>
                <div className="mb-4 px-3 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs group-hover:bg-cyan-500/30 transition-colors duration-300 inline-block max-w-full">
                  <span className="whitespace-normal text-center leading-tight">{member.role}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">{member.bio}</p>
                
                {/* Multiple social media icons for Luchador */}
                {(member as any).twitter && (member as any).discord && (
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-center space-x-3">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open((member as any).twitter, '_blank');
                        }}
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open((member as any).twitter, '_blank');
                          }
                        }}
                      >
                        <Twitter className="w-4 h-4 text-cyan-400 hover:text-cyan-300" />
                      </div>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open((member as any).discord, '_blank');
                        }}
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open((member as any).discord, '_blank');
                          }
                        }}
                      >
                        <MessageCircle className="w-4 h-4 text-cyan-400 hover:text-cyan-300" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Single social media icon for other members */}
                {member.twitter && !(member as any).discord && (
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Twitter className="w-4 h-4 mx-auto text-cyan-400" />
                  </div>
                )}
                {member.telegram && (
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Send className="w-4 h-4 mx-auto text-cyan-400" />
                  </div>
                )}
              </Card>
            );

            // Handle social links - if member has multiple social links (like Luchador), don't make card clickable
            if ((member as any).twitter && (member as any).discord) {
              // Luchador has both Twitter and Discord - don't make card clickable, use individual icon clicks
              return <div key={index}>{CardContent}</div>;
            } else if (member.twitter || member.telegram) {
              // Other members with single social link - make card clickable
              const socialLink = member.twitter || member.telegram;
              return (
                <div 
                  key={index}
                  onClick={() => window.open(socialLink, '_blank')}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.open(socialLink, '_blank');
                    }
                  }}
                >
                  {CardContent}
                </div>
              );
            }

            return <div key={index}>{CardContent}</div>;
          })}
        </div>
      </div>

      {/* WEB3 FRENS Section with same 3D effects */}
      <div 
        className="mb-16"
        style={{
          transform: `translate3d(0, ${mousePosition.y * -6}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <h2 
          className="text-5xl md:text-7xl font-bold text-purple-400 mb-12 text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse"
          style={{
            textShadow: '0 0 30px rgba(139, 92, 246, 0.3), 0 0 60px rgba(6, 182, 212, 0.2)',
            transform: `perspective(500px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          WEB3 FRENS
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {web3Frens.map((fren, index) => {
            const CardContent = (
              <Card 
                className="p-6 bg-white/5 border-white/10 backdrop-blur-xl text-center hover:bg-white/10 transition-all duration-500 transform-gpu hover:scale-105 hover:-translate-y-4 group"
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
                  transition: 'transform 0.1s ease-out',
                  animationDelay: `${index * 0.1}s`,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
                }}
              >
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full blur-lg animate-pulse"></div>
                  <ImageWithFallback
                    src={fren.image}
                    alt={fren.name}
                    className="relative w-20 h-20 rounded-full object-cover border-2 border-white/20 group-hover:border-green-400/50 transition-all duration-300"
                    style={{
                      filter: 'drop-shadow(0 0 15px rgba(34, 197, 94, 0.2))'
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">{fren.name}</h3>
                <div className="mb-4 px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs group-hover:bg-green-500/30 transition-colors duration-300 inline-block max-w-full">
                  <span className="whitespace-normal text-center leading-tight">{fren.role}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">{fren.bio}</p>
                
                {/* Social media icons for HONEY (Twitter + Discord) */}
                {fren.twitter && fren.discord && (
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-center space-x-3">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(fren.twitter, '_blank');
                        }}
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(fren.twitter, '_blank');
                          }
                        }}
                      >
                        <Twitter className="w-4 h-4 text-green-400 hover:text-green-300" />
                      </div>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://discord.com/users/${fren.discord}`, '_blank');
                        }}
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(`https://discord.com/users/${fren.discord}`, '_blank');
                          }
                        }}
                      >
                        <MessageCircle className="w-4 h-4 text-green-400 hover:text-green-300" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Social media icons for Brother's Keeper (Twitter + Telegram) */}
                {fren.twitter && fren.telegram && !fren.discord && !(fren as any).website && (
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-center space-x-3">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(fren.twitter, '_blank');
                        }}
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(fren.twitter, '_blank');
                          }
                        }}
                      >
                        <Twitter className="w-4 h-4 text-green-400 hover:text-green-300" />
                      </div>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(fren.telegram, '_blank');
                        }}
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(fren.telegram, '_blank');
                          }
                        }}
                      >
                        <Send className="w-4 h-4 text-green-400 hover:text-green-300" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Social media icons for SUPAWCOOL (Twitter + Website) */}
                {fren.twitter && (fren as any).website && (
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-center space-x-3">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(fren.twitter, '_blank');
                        }}
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(fren.twitter, '_blank');
                          }
                        }}
                      >
                        <Twitter className="w-4 h-4 text-green-400 hover:text-green-300" />
                      </div>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open((fren as any).website, '_blank');
                        }}
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open((fren as any).website, '_blank');
                          }
                        }}
                      >
                        <Globe className="w-4 h-4 text-green-400 hover:text-green-300" />
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );

            // For profiles with multiple social links, don't make card clickable
            if ((fren.twitter && fren.discord) || (fren.twitter && fren.telegram) || (fren.twitter && (fren as any).website)) {
              return <div key={index}>{CardContent}</div>;
            }

            return <div key={index}>{CardContent}</div>;
          })}
        </div>
      </div>

      {/* NFT & Blockchain Education Section - Moved to bottom */}
      <div 
        className="mb-16"
        style={{
          transform: `translate3d(0, ${mousePosition.y * -4}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Understanding NFTs &amp; Blockchain</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            New to the NFT arena? Learn about the technology powering Hungry Luchadors and why blockchain matters for digital collectibles.
          </p>
        </div>
        
        <Card 
          className="p-8 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform-gpu hover:scale-[1.02] hover:-translate-y-2"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
            transition: 'transform 0.1s ease-out',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 246, 0.1)'
          }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              {
                value: "what-are-nfts",
                icon: Coins,
                title: "What are NFTs?",
                content: (
                  <>
                    <p className="mb-4">
                      NFTs (Non-Fungible Tokens) are unique digital certificates that prove ownership of digital items like art, music, or collectibles. 
                      Think of them as digital certificates of authenticity - just like how a championship belt proves a luchador's victory, 
                      an NFT proves you own a specific digital asset.
                    </p>
                    <p>
                      Each Hungry Luchador NFT is completely unique, with distinct characteristics, fighting styles, and hunger levels. 
                      When you own a Hungry Luchador NFT, you're not just buying an image - you're claiming ownership of a legendary fighter 
                      in our digital wrestling federation!
                    </p>
                  </>
                )
              },
              {
                value: "blockchain-fundamentals",
                icon: Shield,
                title: "Blockchain Fundamentals",
                content: (
                  <>
                    <p className="mb-4">
                      Blockchain is a revolutionary technology that acts as a digital ledger, recording transactions across multiple computers 
                      in a way that makes them nearly impossible to change or hack. Think of it as an unbreakable wrestling record book 
                      that everyone can verify but no one can cheat.
                    </p>
                    <p className="mb-4">
                      <strong>Key Features:</strong>
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                      <li><strong>Decentralization:</strong> No single authority controls the network</li>
                      <li><strong>Transparency:</strong> All transactions are publicly visible</li>
                      <li><strong>Immutability:</strong> Once recorded, data cannot be altered</li>
                      <li><strong>Security:</strong> Cryptographic protection ensures data integrity</li>
                    </ul>
                    <p>
                      Every Hungry Luchador NFT is secured by this technology, ensuring your digital fighter's authenticity and ownership history is permanently recorded.
                    </p>
                  </>
                )
              },
              {
                value: "dual-chain",
                icon: Zap,
                title: "Why Dual-Chain (XRPL & EVM)?",
                content: (
                  <>
                    <p className="mb-4">
                      Hungry Luchadors operates on both XRP Ledger (XRPL) and EVM-compatible chains, giving you the best of both worlds:
                    </p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-cyan-400 mb-2">XRP Ledger Benefits:</h4>
                      <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>Lightning-fast transactions (3-5 seconds)</li>
                        <li>Ultra-low fees (fractions of a penny)</li>
                        <li>Eco-friendly and energy efficient</li>
                        <li>Built-in DEX and native tokens</li>
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-purple-400 mb-2">EVM Chain Benefits:</h4>
                      <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>Wide ecosystem compatibility</li>
                        <li>MetaMask integration</li>
                        <li>DeFi protocol integration</li>
                        <li>Smart contract flexibility</li>
                      </ul>
                    </div>
                    <p>
                      This dual-chain approach ensures maximum accessibility, utility, and future-proofing for your Hungry Luchador collection!
                    </p>
                  </>
                )
              }
            ].map((item) => (
              <AccordionItem 
                key={item.value} 
                value={item.value}
                className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <AccordionTrigger 
                  className="px-6 py-4 text-left hover:no-underline group"
                  style={{
                    transform: `translate3d(0, ${mousePosition.y * -1}px, 0)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <item.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                      {item.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-white/70 leading-relaxed">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>

      {/* Call to Action */}
      <div 
        className="text-center"
        style={{
          transform: `translate3d(0, ${mousePosition.y * -2}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <Card 
          className="p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20 backdrop-blur-xl"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
            transition: 'transform 0.1s ease-out',
            boxShadow: '0 25px 50px -12px rgba(6, 182, 212, 0.3)'
          }}
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Crown className="w-8 h-8 text-cyan-400" />
            <h3 className="text-3xl font-bold text-cyan-400">Join the Revolution</h3>
            <Crown className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Ready to step into the ring? Join thousands of collectors in the most exciting NFT wrestling federation on the XRP Ledger. 
            Mint your hungry luchador today and become part of crypto history! 🚀
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <GlassButton
              onClick={handleTwitterClick}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30"
            >
              <Twitter className="w-5 h-5 mr-2" />
              Follow on X
            </GlassButton>
            <GlassButton
              onClick={handleDiscordClick}
              className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Join Discord
            </GlassButton>
          </div>
        </Card>
      </div>
    </div>
  );
}