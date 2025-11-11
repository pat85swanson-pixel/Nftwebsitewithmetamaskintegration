import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Home, Zap, Users, FileText, Menu, X } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { 
      name: 'Home', 
      key: 'home',
      icon: Home
    },
    { 
      name: 'About', 
      key: 'about',
      icon: Users
    },
    { 
      name: 'Whitepaper', 
      key: 'whitepaper',
      icon: FileText
    },
    { 
      name: 'Mint', 
      key: 'mint',
      icon: Zap
    }
  ];

  const handleNavigate = (page: string) => {
    console.log('Navigating to:', page);
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="w-full px-4">
        <div className="flex h-16 items-center justify-center">
          {/* Desktop Layout - Navigation Perfectly Centered */}
          <div className="hidden xl:block w-full">
            <div className="relative max-w-7xl mx-auto">
              {/* Enhanced glassmorphism background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-2xl blur-sm pointer-events-none"></div>
              <div className="relative px-8 py-2 bg-white/10 border-2 border-white/20 rounded-2xl backdrop-blur-xl shadow-2xl">
                {/* Inner glow effect */}
                <div className="absolute inset-1 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 rounded-xl pointer-events-none"></div>
                
                {/* Navigation Section - Perfectly Centered */}
                <div className="flex items-center justify-center w-full">
                  <div className="flex items-center space-x-8">
                    {navigation.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleNavigate(item.key);
                          }}
                          className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 group transform-gpu cursor-pointer whitespace-nowrap ${
                            currentPage === item.key
                              ? 'text-white bg-gradient-to-r from-cyan-500/40 to-purple-500/40 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/25 scale-105'
                              : 'text-white/80 hover:text-white hover:bg-white/15 hover:scale-105 border-2 border-transparent hover:border-white/20'
                          }`}
                          style={{ pointerEvents: 'auto' }}
                        >
                          {/* Background glow for active state */}
                          {currentPage === item.key && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md pointer-events-none"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl pointer-events-none"></div>
                            </>
                          )}
                          
                          {/* Button content */}
                          <div className="relative flex items-center space-x-2 z-10 pointer-events-none">
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </div>
                          
                          {/* Active indicator dot */}
                          {currentPage === item.key && (
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse pointer-events-none"></div>
                          )}
                          
                          {/* Hover shimmer effect */}
                          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Wallet Section - Absolute Positioned Right */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <WalletConnect />
                </div>
              </div>
              
              {/* Outer shadow/glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 rounded-2xl blur-xl opacity-50 pointer-events-none"></div>
            </div>
          </div>

          {/* Large Screen Layout - Navigation Centered */}
          <div className="hidden lg:block xl:hidden w-full">
            <div className="relative max-w-6xl mx-auto">
              {/* Navigation - Perfectly Centered */}
              <div className="flex items-center justify-center w-full">
                <div className="flex items-center space-x-6 p-2 bg-white/10 border-2 border-white/20 rounded-xl backdrop-blur-xl shadow-xl">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNavigate(item.key);
                        }}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                          currentPage === item.key
                            ? 'text-white bg-gradient-to-r from-cyan-500/40 to-purple-500/40 border border-cyan-400/50 shadow-lg'
                            : 'text-white/80 hover:text-white hover:bg-white/15 border border-transparent hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 pointer-events-none" />
                          <span>{item.name}</span>
                        </div>
                        {currentPage === item.key && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 pointer-events-none"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wallet - Absolute Positioned Right */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <WalletConnect />
              </div>
            </div>
          </div>

          {/* Medium Screen Layout - Navigation Centered */}
          <div className="hidden md:block lg:hidden w-full">
            <div className="relative w-full">
              {/* Navigation - Centered */}
              <div className="flex items-center justify-center w-full">
                <div className="flex items-center space-x-3 p-2 bg-white/10 border-2 border-white/20 rounded-xl backdrop-blur-xl shadow-xl">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNavigate(item.key);
                        }}
                        className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                          currentPage === item.key
                            ? 'text-white bg-gradient-to-r from-cyan-500/40 to-purple-500/40 border border-cyan-400/50 shadow-lg'
                            : 'text-white/80 hover:text-white hover:bg-white/15 border border-transparent hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5">
                          <Icon className="w-4 h-4 pointer-events-none" />
                          <span className="text-xs">{item.name}</span>
                        </div>
                        {currentPage === item.key && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 pointer-events-none"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wallet - Absolute Positioned Right */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <WalletConnect />
              </div>
            </div>
          </div>

          {/* Mobile Layout - Menu Left, Wallet Right */}
          <div className="md:hidden w-full flex items-center justify-between">
            {/* Menu Button - Left */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 border-2 border-white/20 text-white hover:bg-white/15 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Wallet - Right */}
            <div className="flex items-center">
              <WalletConnect />
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10 z-50">
            <div className="p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavigate(item.key)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                      currentPage === item.key
                        ? 'text-white bg-gradient-to-r from-cyan-500/40 to-purple-500/40 border border-cyan-400/50'
                        : 'text-white/80 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}