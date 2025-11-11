const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying LUCHADOR LUNCH HOUR NFT Contract...");

  // Contract configuration
  const contractConfig = {
    name: "LUCHADOR LUNCH HOUR",
    symbol: "LUNCH",
    baseURI: "https://api.luchadorlunchhour.com/metadata/",
    placeholderURI: "https://api.luchadorlunchhour.com/placeholder.json",
    contractURI: "https://api.luchadorlunchhour.com/contract.json"
  };

  // Get the contract factory
  const LuchadorLunchHour = await ethers.getContractFactory("LuchadorLunchHour");
  
  // Deploy the contract
  const contract = await LuchadorLunchHour.deploy(
    contractConfig.name,
    contractConfig.symbol,
    contractConfig.baseURI,
    contractConfig.placeholderURI,
    contractConfig.contractURI
  );

  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
  console.log("Contract configuration:", contractConfig);

  // Verify deployment
  const totalSupply = await contract.MAX_SUPPLY();
  const mintPrice = await contract.mintPrice();
  const lowCostPrice = await contract.lowCostPrice();
  
  console.log("Deployment verified:");
  console.log("- Max Supply:", totalSupply.toString());
  console.log("- Mint Price:", ethers.utils.formatEther(mintPrice), "ETH");
  console.log("- Low Cost Price:", ethers.utils.formatEther(lowCostPrice), "ETH");

  return {
    contractAddress: contract.address,
    contractConfig,
    contract
  };
}

// Contract ABI for frontend integration
const CONTRACT_ABI = [
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
];

module.exports = {
  main,
  CONTRACT_ABI
};

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}