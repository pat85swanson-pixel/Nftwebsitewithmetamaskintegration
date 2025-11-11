import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCw, Wallet } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  isWeb3Error?: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a Web3/MetaMask related error
    const isWeb3Error = error.message?.includes('User rejected') ||
                       error.message?.includes('MetaMask') ||
                       error.message?.includes('wallet') ||
                       error.message?.includes('ethereum') ||
                       (error as any)?.code === 4001;

    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error,
      isWeb3Error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Check if this is a Web3 error that we can handle gracefully
    const isWeb3Error = error.message?.includes('User rejected') ||
                       error.message?.includes('MetaMask') ||
                       error.message?.includes('wallet') ||
                       (error as any)?.code === 4001;

    if (isWeb3Error) {
      console.log('🔄 Web3 error caught by ErrorBoundary:', error.message);
      // For Web3 errors, we don't want to show the full error boundary
      // Instead, we'll reset automatically after a brief moment
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      }, 100);
      return;
    }

    // Log non-Web3 errors to console for debugging
    console.error('🚨 LUCHADOR LUNCH HOUR Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      isWeb3Error
    });
  }

  componentDidMount(): void {
    // Add listener for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      
      // Check if it's a Web3 related error
      if (error?.message?.includes('User rejected') ||
          error?.code === 4001 ||
          error?.message?.includes('MetaMask')) {
        
        console.log('🔄 Unhandled Web3 promise rejection caught and handled');
        event.preventDefault(); // Prevent default error handling
        
        // Don't trigger error boundary for Web3 errors
        return;
      }
      
      // For other errors, let them bubble up normally
      console.log('⚠️ Unhandled promise rejection:', error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Store reference for cleanup
    (this as any).unhandledRejectionHandler = handleUnhandledRejection;
  }

  componentWillUnmount(): void {
    // Clean up the event listener
    if ((this as any).unhandledRejectionHandler) {
      window.removeEventListener('unhandledrejection', (this as any).unhandledRejectionHandler);
    }
  }

  handleReload = (): void => {
    // Clear error state and reload the page
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  handleReset = (): void => {
    // Clear error state and try to recover
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    
    // Clear any potentially corrupted local storage
    try {
      localStorage.removeItem('luchador-current-page');
      sessionStorage.removeItem('luchador-current-page');
    } catch (error) {
      console.log('Error clearing storage:', error);
    }
  };

  render(): ReactNode {
    if (this.state.hasError && !this.state.isWeb3Error) {
      const isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 bg-black/80 border-2 border-red-500/30 backdrop-blur-xl">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AlertTriangle className="w-12 h-12 text-red-400" />
              </div>
              
              <h2 className="text-xl font-bold text-white">
                Oops! Something went wrong
              </h2>
              
              <p className="text-white/70 text-sm">
                The LUCHADOR LUNCH HOUR app encountered an unexpected error. 
                Don't worry, your wallet connection and data are safe.
              </p>

              {/* Error details in development */}
              {isDevelopment && this.state.error && (
                <details className="text-left bg-red-500/10 border border-red-500/30 rounded p-3 text-xs">
                  <summary className="text-red-400 cursor-pointer mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="text-red-300 whitespace-pre-wrap break-words">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex space-x-3">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              <p className="text-xs text-white/50 mt-4">
                If this problem persists, please try refreshing your browser or 
                clearing your browser cache.
              </p>
            </div>
          </Card>
        </div>
      );
    }

    // Special handling for Web3 errors - show a brief, non-intrusive message
    if (this.state.hasError && this.state.isWeb3Error) {
      return (
        <div className="relative">
          {this.props.children}
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            <Card className="p-3 bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-blue-400" />
                <p className="text-xs text-blue-400">
                  Wallet connection cancelled - this is normal!
                </p>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}