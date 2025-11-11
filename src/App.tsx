import React, { useState, useEffect } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { AboutPage } from './components/AboutPage';
import { MintGalleryPage } from './components/MintGalleryPage';
import { WhitePaperPage } from './components/WhitePaperPage';
import { Header } from './components/Header';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Web3Provider } from './components/Web3Provider';
import { GlobalPriceTicker } from './components/GlobalPriceTicker';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [appError, setAppError] = useState<string | null>(null);

  // Handle initial app entry
  const handleEnterApp = (): void => {
    setShowWelcomeOverlay(false);
    setIsInitialLoad(false);
  };

  // Navigate to specific page and ensure we're in the main app
  const handleNavigateToPage = (page: string): void => {
    setCurrentPage(page);
    setShowWelcomeOverlay(false);
    setIsInitialLoad(false);
  };

  // Enhanced error classification and handling
  const isWeb3UserRejectionError = (error: any): boolean => {
    if (!error) return false;
    
    const errorMsg = error.message?.toLowerCase() || '';
    const errorCode = error.code;
    
    return (
      errorCode === 4001 ||
      errorCode === 'ACTION_REJECTED' ||
      errorMsg.includes('user rejected') ||
      errorMsg.includes('user denied') ||
      errorMsg.includes('user cancelled') ||
      errorMsg.includes('cancelled by user') ||
      errorMsg.includes('rejected by user') ||
      errorMsg.includes('request rejected') ||
      errorMsg.includes('user abort') ||
      errorMsg.includes('user cancel') ||
      errorMsg.includes('metamask tx signature')
    );
  };

  const isWeb3ConnectionError = (error: any): boolean => {
    if (!error) return false;
    
    const errorMsg = error.message?.toLowerCase() || '';
    
    return (
      errorMsg.includes('metamask') ||
      errorMsg.includes('wallet') ||
      errorMsg.includes('ethereum') ||
      errorMsg.includes('web3') ||
      errorMsg.includes('provider') ||
      errorMsg.includes('chain') ||
      errorMsg.includes('network')
    );
  };

  // Global error handler for unhandled promises
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log('🚨 Unhandled promise rejection details:', {
        reason: event.reason,
        message: event.reason?.message,
        code: event.reason?.code,
        type: typeof event.reason
      });
      
      // Check if it's a Web3/MetaMask user rejection
      if (isWeb3UserRejectionError(event.reason)) {
        console.log('✅ Web3 user rejection handled gracefully - preventing error display');
        event.preventDefault(); // Prevent the error from showing in console
        return; // Don't show any error to user - this is normal behavior
      }
      
      // Check if it's any other Web3 related error
      if (isWeb3ConnectionError(event.reason)) {
        console.log('🔄 Web3 connection error caught and handled gracefully');
        event.preventDefault();
        
        // Only show user-friendly message for connection issues, not rejections
        setAppError('Having trouble connecting to your wallet. This is normal - you can try again anytime.');
        setTimeout(() => setAppError(null), 4000);
        return;
      }
      
      // Handle other types of errors
      if (event.reason?.message && !isWeb3UserRejectionError(event.reason)) {
        console.log('🔄 General error caught:', event.reason.message);
        event.preventDefault();
        setAppError('Something went wrong. Please refresh if issues persist.');
        setTimeout(() => setAppError(null), 4000);
      }
    };

    const handleError = (event: ErrorEvent) => {
      console.log('🚨 Global error details:', {
        error: event.error,
        message: event.error?.message,
        code: event.error?.code,
        filename: event.filename,
        lineno: event.lineno
      });
      
      // Check for Web3 user rejection errors
      if (isWeb3UserRejectionError(event.error)) {
        console.log('✅ Web3 user rejection in global error handler - preventing error display');
        event.preventDefault();
        return; // Don't show any error to user
      }
      
      // Check for Web3 connection errors
      if (isWeb3ConnectionError(event.error)) {
        console.log('🔄 Web3 connection error in global error handler');
        event.preventDefault();
        setAppError('Wallet connection issue. This is normal - you can try connecting again.');
        setTimeout(() => setAppError(null), 4000);
        return;
      }
      
      // Handle other errors
      if (event.error?.message && !isWeb3UserRejectionError(event.error)) {
        event.preventDefault();
        setAppError('An unexpected error occurred. Please refresh if issues persist.');
        setTimeout(() => setAppError(null), 4000);
      }
    };

    // Enhanced console error interception
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.error = (...args: any[]) => {
      const errorMsg = args[0]?.toString?.() || '';
      
      // Suppress Web3 user rejection errors from console
      if (isWeb3UserRejectionError({ message: errorMsg })) {
        console.log('🔇 Suppressed Web3 user rejection from console:', errorMsg);
        return;
      }
      
      // Allow other errors through
      originalConsoleError.apply(console, args);
    };
    
    console.warn = (...args: any[]) => {
      const warnMsg = args[0]?.toString?.() || '';
      
      // Suppress Web3 user rejection warnings from console
      if (isWeb3UserRejectionError({ message: warnMsg })) {
        console.log('🔇 Suppressed Web3 user rejection warning from console:', warnMsg);
        return;
      }
      
      // Allow other warnings through
      originalConsoleWarn.apply(console, args);
    };

    // Add global error listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      
      // Restore console methods
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  // Effect to handle any initialization logic
  useEffect(() => {
    const initializeApp = () => {
      try {
        // Check for any saved state or perform initial setup
        const savedPage = sessionStorage.getItem('luchador-current-page');
        if (savedPage && savedPage !== 'home') {
          setCurrentPage(savedPage);
          setShowWelcomeOverlay(false);
          setIsInitialLoad(false);
        }
      } catch (error) {
        console.log('Error initializing app:', error);
        // Fallback to default state
        setCurrentPage('home');
        setShowWelcomeOverlay(true);
        setIsInitialLoad(true);
      }
    };

    initializeApp();
  }, []);

  // Save current page to session storage for persistence
  useEffect(() => {
    try {
      sessionStorage.setItem('luchador-current-page', currentPage);
    } catch (error) {
      console.log('Error saving current page:', error);
    }
  }, [currentPage]);

  // Enhanced Web3Provider wrapper with comprehensive error handling
  const Web3ProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    try {
      return (
        <div
          onError={(event: any) => {
            console.log('🛡️ Web3Provider wrapper caught error:', event);
            
            if (isWeb3UserRejectionError(event.error)) {
              console.log('✅ Web3Provider user rejection suppressed');
              event.preventDefault();
              return;
            }
          }}
        >
          <Web3Provider>
            {children}
          </Web3Provider>
        </div>
      );
    } catch (error) {
      console.log('Web3Provider initialization error:', error);
      
      if (isWeb3UserRejectionError(error)) {
        console.log('✅ Web3Provider init user rejection suppressed');
        return <>{children}</>;
      }
      
      return <>{children}</>;
    }
  };

  // App error display (only for non-Web3 user rejection errors)
  const AppErrorDisplay = () => {
    if (!appError) return null;
    
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
        <div className="bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-400 font-medium">Info</span>
          </div>
          <p className="text-white/80 text-sm">{appError}</p>
          <button
            onClick={() => setAppError(null)}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  };

  // Always render with consistent header layout
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* App-level error display */}
        <AppErrorDisplay />
        
        {/* Global Price Ticker */}
        <GlobalPriceTicker />
        
        {/* Wrap everything in enhanced Web3Provider */}
        <Web3ProviderWrapper>
          {/* Consistent Header across all pages */}
          <Header 
            currentPage={currentPage} 
            setCurrentPage={handleNavigateToPage}
          />
          
          {/* Page Content with consistent layout */}
          <div className="relative">
            {currentPage === 'home' && (
              <WelcomePage 
                onEnter={handleEnterApp}
                setCurrentPage={setCurrentPage}
                showHeader={true}
              />
            )}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'mint' && <MintGalleryPage />}
            {currentPage === 'whitepaper' && <WhitePaperPage />}
          </div>
        </Web3ProviderWrapper>
      </div>
    </ErrorBoundary>
  );
}