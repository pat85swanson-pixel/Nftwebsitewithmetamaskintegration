import { Hono } from 'npm:hono'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

interface AuthUser {
  address: string;
  network: string;
  walletType: 'metamask' | 'xaman';
  sessionToken: string;
  authenticated: boolean;
  lastAuth: string;
  nonce: string;
}

interface SignatureVerificationRequest {
  address: string;
  message: string;
  signature: string;
  network: string;
}

// Generate random session token
function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate nonce
function generateNonce(): string {
  return Math.random().toString(36).substring(7);
}

// Detect wallet type from address format
function detectWalletType(address: string): 'metamask' | 'xaman' {
  // XRPL addresses start with 'r' and are 25-34 characters
  if (address.startsWith('r') && address.length >= 25 && address.length <= 34) {
    return 'xaman';
  }
  // Ethereum addresses start with '0x' and are 42 characters
  if (address.startsWith('0x') && address.length === 42) {
    return 'metamask';
  }
  // Default to metamask for unknown formats
  return 'metamask';
}

// Verify Ethereum signature
async function verifyEthereumSignature(address: string, message: string, signature: string): Promise<boolean> {
  try {
    // Basic validation for Ethereum signatures
    const signatureRegex = /^0x[0-9a-fA-F]{130}$/;
    if (!signatureRegex.test(signature)) {
      return false;
    }
    
    const addressRegex = /^0x[0-9a-fA-F]{40}$/;
    if (!addressRegex.test(address)) {
      return false;
    }
    
    // Check if message contains the address
    if (!message.includes(address)) {
      return false;
    }
    
    // Check if message is recent (within 5 minutes)
    const timestampMatch = message.match(/Timestamp: (.+)/);
    if (timestampMatch) {
      const messageTime = new Date(timestampMatch[1]);
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      if (messageTime < fiveMinutesAgo || messageTime > now) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.log('Ethereum signature verification error:', error);
    return false;
  }
}

// Verify XRPL signature
async function verifyXRPLSignature(address: string, message: string, signature: string): Promise<boolean> {
  try {
    // Basic validation for XRPL addresses
    if (!address.startsWith('r') || address.length < 25 || address.length > 34) {
      return false;
    }
    
    // XRPL signatures are typically hex-encoded
    const signatureRegex = /^[0-9a-fA-F]+$/;
    if (!signatureRegex.test(signature.replace('0x', ''))) {
      return false;
    }
    
    // Check if message contains the address
    if (!message.includes(address)) {
      return false;
    }
    
    // Check if message is recent (within 5 minutes)
    const timestampMatch = message.match(/Timestamp: (.+)/);
    if (timestampMatch) {
      const messageTime = new Date(timestampMatch[1]);
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      if (messageTime < fiveMinutesAgo || messageTime > now) {
        return false;
      }
    }
    
    // In a real implementation, you would use xrpl library to verify the signature
    // For now, we'll do basic validation and accept valid-looking signatures
    return true;
  } catch (error) {
    console.log('XRPL signature verification error:', error);
    return false;
  }
}

// Universal signature verification
async function verifySignature(address: string, message: string, signature: string): Promise<boolean> {
  const walletType = detectWalletType(address);
  
  if (walletType === 'xaman') {
    return verifyXRPLSignature(address, message, signature);
  } else {
    return verifyEthereumSignature(address, message, signature);
  }
}

// Verify signature and authenticate user
app.post('/verify', async (c) => {
  try {
    const body = await c.req.json() as SignatureVerificationRequest;
    const { address, message, signature, network } = body;
    
    if (!address || !message || !signature) {
      return c.json({
        success: false,
        error: 'Missing required fields: address, message, signature'
      }, 400);
    }
    
    // Detect wallet type from address
    const walletType = detectWalletType(address);
    
    // Verify the signature
    const isValidSignature = await verifySignature(address, message, signature);
    
    if (!isValidSignature) {
      return c.json({
        success: false,
        error: 'Invalid signature'
      }, 401);
    }
    
    // Generate session token
    const sessionToken = generateSessionToken();
    const nonce = generateNonce();
    
    // Store user session
    const authUser: AuthUser = {
      address: address.toLowerCase(),
      network: network || (walletType === 'xaman' ? 'XRPL' : 'EVM'),
      walletType,
      sessionToken,
      authenticated: true,
      lastAuth: new Date().toISOString(),
      nonce
    };
    
    const userKey = `auth:${address.toLowerCase()}`;
    const sessionKey = `session:${sessionToken}`;
    
    await Promise.all([
      kv.set(userKey, authUser),
      kv.set(sessionKey, authUser),
      // Set expiration for session (24 hours)
      kv.set(`${sessionKey}:expires`, new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
    ]);
    
    console.log('User authenticated successfully:', address, 'Wallet type:', walletType);
    
    return c.json({
      success: true,
      data: {
        address: authUser.address,
        network: authUser.network,
        walletType: authUser.walletType,
        sessionToken: authUser.sessionToken,
        authenticated: true,
        lastAuth: authUser.lastAuth
      },
      message: `${walletType === 'xaman' ? 'XRPL' : 'EVM'} authentication successful`
    });
    
  } catch (error) {
    console.log('Auth verification error:', error);
    return c.json({
      success: false,
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Validate session token
app.post('/validate', async (c) => {
  try {
    const body = await c.req.json();
    const { sessionToken } = body;
    
    if (!sessionToken) {
      return c.json({
        success: false,
        error: 'Session token required'
      }, 400);
    }
    
    const sessionKey = `session:${sessionToken}`;
    const authUser = await kv.get(sessionKey) as AuthUser | null;
    
    if (!authUser) {
      return c.json({
        success: false,
        error: 'Invalid session token'
      }, 401);
    }
    
    // Check if session has expired
    const expirationKey = `${sessionKey}:expires`;
    const expiration = await kv.get(expirationKey) as string | null;
    
    if (expiration && new Date(expiration) < new Date()) {
      // Clean up expired session
      await Promise.all([
        kv.del(sessionKey),
        kv.del(expirationKey),
        kv.del(`auth:${authUser.address}`)
      ]);
      
      return c.json({
        success: false,
        error: 'Session expired'
      }, 401);
    }
    
    return c.json({
      success: true,
      data: {
        address: authUser.address,
        network: authUser.network,
        walletType: authUser.walletType,
        authenticated: authUser.authenticated,
        lastAuth: authUser.lastAuth
      },
      message: 'Session valid'
    });
    
  } catch (error) {
    console.log('Session validation error:', error);
    return c.json({
      success: false,
      error: 'Session validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Logout user
app.post('/logout', async (c) => {
  try {
    const body = await c.req.json();
    const { sessionToken } = body;
    
    if (!sessionToken) {
      return c.json({
        success: false,
        error: 'Session token required'
      }, 400);
    }
    
    const sessionKey = `session:${sessionToken}`;
    const authUser = await kv.get(sessionKey) as AuthUser | null;
    
    if (authUser) {
      // Clean up all session data
      await Promise.all([
        kv.del(sessionKey),
        kv.del(`${sessionKey}:expires`),
        kv.del(`auth:${authUser.address}`)
      ]);
      
      console.log('User logged out:', authUser.address, 'Wallet type:', authUser.walletType);
    }
    
    return c.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.log('Logout error:', error);
    return c.json({
      success: false,
      error: 'Logout failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get user profile
app.get('/profile/:address', async (c) => {
  try {
    const address = c.req.param('address');
    
    if (!address) {
      return c.json({
        success: false,
        error: 'Address required'
      }, 400);
    }
    
    const userKey = `auth:${address.toLowerCase()}`;
    const authUser = await kv.get(userKey) as AuthUser | null;
    
    if (!authUser) {
      return c.json({
        success: false,
        error: 'User not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      data: {
        address: authUser.address,
        network: authUser.network,
        walletType: authUser.walletType,
        authenticated: authUser.authenticated,
        lastAuth: authUser.lastAuth
      }
    });
    
  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// List all authenticated users with wallet type breakdown
app.get('/users', async (c) => {
  try {
    const authEntries = await kv.getByPrefix('auth:');
    const users = authEntries.map(entry => {
      const user = entry.value as AuthUser;
      return {
        address: user.address,
        network: user.network,
        walletType: user.walletType,
        authenticated: user.authenticated,
        lastAuth: user.lastAuth
      };
    });
    
    const metamaskUsers = users.filter(u => u.walletType === 'metamask');
    const xamanUsers = users.filter(u => u.walletType === 'xaman');
    
    return c.json({
      success: true,
      data: {
        users,
        count: users.length,
        authenticatedCount: users.filter(u => u.authenticated).length,
        breakdown: {
          metamask: metamaskUsers.length,
          xaman: xamanUsers.length
        }
      }
    });
    
  } catch (error) {
    console.log('Users fetch error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default app;