// Contract configuration for easy updates
export const CONTRACT_CONFIG = {
  // Update these addresses after deploying your contracts
  addresses: {
    // Testnet addresses
    sepolia: '0x0000000000000000000000000000000000000000', // Update after deployment
    mumbai: '0x0000000000000000000000000000000000000000', // Update after deployment
    
    // Mainnet addresses  
    ethereum: '0x0000000000000000000000000000000000000000', // Update after deployment
    polygon: '0x0000000000000000000000000000000000000000', // Update after deployment
  },
  
  // Network configurations
  networks: {
    1: { name: 'Ethereum Mainnet', key: 'ethereum' },
    11155111: { name: 'Sepolia Testnet', key: 'sepolia' },
    137: { name: 'Polygon', key: 'polygon' },
    80001: { name: 'Mumbai Testnet', key: 'mumbai' },
  },
  
  // Default network for development
  defaultNetwork: 11155111, // Sepolia
  
  // Contract ABI
  abi: [
    "function mint(uint256 quantity) external payable",
    "function lowCostMint(uint256 quantity) external payable",
    "function totalMinted() external view returns (uint256)",
    "function mintPrice() external view returns (uint256)",
    "function lowCostPrice() external view returns (uint256)",
    "function mintingActive() external view returns (bool)",
    "function lowCostMintActive() external view returns (bool)",
    "function mintedByAddress(address addr) external view returns (uint256)",
    "function lowCostMintedByAddress(address addr) external view returns (uint256)",
    "function remainingLowCostMints(address addr) external view returns (uint256)",
    "function remainingRegularMints(address addr) external view returns (uint256)",
    "function getHolders() external view returns (address[])",
    "function getHolderTokens(address holder) external view returns (uint256[])",
    "function getTotalHolders() external view returns (uint256)",
    "function isHolderAddress(address addr) external view returns (bool)",
    "function balanceOf(address owner) external view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
    "function tokenURI(uint256 tokenId) external view returns (string)",
    "function ownerOf(uint256 tokenId) external view returns (address)",
    "function totalSupply() external view returns (uint256)",
    "function MAX_SUPPLY() external view returns (uint256)",
    "function MAX_PER_WALLET() external view returns (uint256)",
    "function lowCostMintLimit() external view returns (uint256)",
    "event TokenMinted(address indexed to, uint256 tokenId, bool isLowCost)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
  ]
};

// Helper function to get contract address for current network
export const getContractAddress = (chainId: number): string => {
  const networkKey = CONTRACT_CONFIG.networks[chainId as keyof typeof CONTRACT_CONFIG.networks]?.key;
  if (!networkKey) {
    console.warn(`Unsupported network: ${chainId}`);
    return '0x0000000000000000000000000000000000000000';
  }
  
  return CONTRACT_CONFIG.addresses[networkKey as keyof typeof CONTRACT_CONFIG.addresses] || 
         '0x0000000000000000000000000000000000000000';
};

// Helper function to check if contract is deployed on network
export const isContractDeployed = (chainId: number): boolean => {
  const address = getContractAddress(chainId);
  return address !== '0x0000000000000000000000000000000000000000';
};

// Instructions for deployment
export const DEPLOYMENT_INSTRUCTIONS = {
  message: `
🚀 **LUCHADOR LUNCH HOUR Contract Deployment Instructions**

1. **Install Dependencies:**
   \`cd contracts && npm install\`

2. **Configure Environment:**
   \`cp .env.example .env\`
   - Add your private key (without 0x prefix)
   - Add RPC URLs for your target networks
   - Add Etherscan API key for verification

3. **Deploy to Testnet (Sepolia):**
   \`npm run deploy:testnet\`

4. **Deploy to Mainnet:**
   \`npm run deploy:mainnet\`

5. **Update Contract Addresses:**
   After deployment, update the addresses in:
   - \`/utils/contractConfig.ts\`
   - Set REACT_APP_CONTRACT_ADDRESS environment variable

6. **Verify Contract:**
   \`npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "LUCHADOR LUNCH HOUR" "LUNCH" "baseURI" "placeholderURI" "contractURI"\`

📝 **Note:** Update the contract addresses in contractConfig.ts after each deployment!
  `,
  
  supportedNetworks: [
    'Ethereum Mainnet (Chain ID: 1)',
    'Sepolia Testnet (Chain ID: 11155111)',
    'Polygon (Chain ID: 137)',
    'Mumbai Testnet (Chain ID: 80001)'
  ]
};