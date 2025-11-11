// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title LuchadorLunchHour
 * @dev ERC721 NFT contract for the Hungry Luchador collection
 * Features: Public minting, owner minting, dynamic pricing, holder tracking
 */
contract LuchadorLunchHour is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;

    // =============================================================
    //                           CONSTANTS
    // =============================================================
    
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MAX_PER_WALLET = 20;
    uint256 public constant RESERVED_TOKENS = 100; // For team/partnerships
    
    // =============================================================
    //                           STORAGE
    // =============================================================
    
    Counters.Counter private _tokenIdCounter;
    
    // Pricing
    uint256 public mintPrice = 0.01 ether; // Starting price
    uint256 public lowCostPrice = 0.00008 ether; // Special low-cost mints
    bool public lowCostMintActive = true;
    uint256 public lowCostMintLimit = 6; // Max per wallet for low-cost
    
    // Minting state
    bool public mintingActive = false;
    bool public revealed = false;
    
    // Metadata
    string private _baseTokenURI;
    string private _contractURI;
    string private _placeholderURI;
    
    // Tracking
    mapping(address => uint256) public mintedPerWallet;
    mapping(address => uint256) public lowCostMintedPerWallet;
    mapping(uint256 => bool) public isLowCostMint;
    
    // Holder tracking for analytics
    address[] private _holders;
    mapping(address => bool) private _isHolder;
    mapping(address => uint256[]) private _holderTokens;
    
    // =============================================================
    //                           EVENTS
    // =============================================================
    
    event MintPriceUpdated(uint256 newPrice);
    event LowCostPriceUpdated(uint256 newPrice);
    event MintingStateChanged(bool active);
    event LowCostMintStateChanged(bool active);
    event TokenMinted(address indexed to, uint256 tokenId, bool isLowCost);
    event MetadataRevealed();
    
    // =============================================================
    //                           CONSTRUCTOR
    // =============================================================
    
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        string memory placeholderURI,
        string memory contractURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseURI;
        _placeholderURI = placeholderURI;
        _contractURI = contractURI;
        
        // Start token IDs at 1
        _tokenIdCounter.increment();
    }
    
    // =============================================================
    //                           MINTING
    // =============================================================
    
    /**
     * @dev Public minting function for regular price
     */
    function mint(uint256 quantity) external payable nonReentrant {
        require(mintingActive, "Minting is not active");
        require(quantity > 0 && quantity <= 10, "Invalid quantity");
        require(_tokenIdCounter.current() + quantity <= MAX_SUPPLY, "Exceeds max supply");
        require(mintedPerWallet[msg.sender] + quantity <= MAX_PER_WALLET, "Exceeds wallet limit");
        require(msg.value >= mintPrice * quantity, "Insufficient payment");
        
        mintedPerWallet[msg.sender] += quantity;
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            
            _safeMint(msg.sender, tokenId);
            _updateHolderTracking(msg.sender, tokenId);
            
            emit TokenMinted(msg.sender, tokenId, false);
        }
        
        // Refund excess payment
        if (msg.value > mintPrice * quantity) {
            payable(msg.sender).transfer(msg.value - (mintPrice * quantity));
        }
    }
    
    /**
     * @dev Low-cost minting function for special promotion
     */
    function lowCostMint(uint256 quantity) external payable nonReentrant {
        require(lowCostMintActive, "Low-cost minting is not active");
        require(quantity > 0 && quantity <= lowCostMintLimit, "Invalid quantity");
        require(_tokenIdCounter.current() + quantity <= MAX_SUPPLY, "Exceeds max supply");
        require(lowCostMintedPerWallet[msg.sender] + quantity <= lowCostMintLimit, "Exceeds low-cost limit");
        require(msg.value >= lowCostPrice * quantity, "Insufficient payment");
        
        lowCostMintedPerWallet[msg.sender] += quantity;
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            
            isLowCostMint[tokenId] = true;
            _safeMint(msg.sender, tokenId);
            _updateHolderTracking(msg.sender, tokenId);
            
            emit TokenMinted(msg.sender, tokenId, true);
        }
        
        // Refund excess payment
        if (msg.value > lowCostPrice * quantity) {
            payable(msg.sender).transfer(msg.value - (lowCostPrice * quantity));
        }
    }
    
    /**
     * @dev Owner minting for reserved tokens
     */
    function ownerMint(address to, uint256 quantity) external onlyOwner {
        require(_tokenIdCounter.current() + quantity <= MAX_SUPPLY, "Exceeds max supply");
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            
            _safeMint(to, tokenId);
            _updateHolderTracking(to, tokenId);
            
            emit TokenMinted(to, tokenId, false);
        }
    }
    
    // =============================================================
    //                      HOLDER TRACKING
    // =============================================================
    
    /**
     * @dev Update holder tracking when tokens are minted or transferred
     */
    function _updateHolderTracking(address to, uint256 tokenId) private {
        if (!_isHolder[to]) {
            _holders.push(to);
            _isHolder[to] = true;
        }
        _holderTokens[to].push(tokenId);
    }
    
    /**
     * @dev Remove holder tracking when all tokens are transferred away
     */
    function _removeHolderTracking(address from, uint256 tokenId) private {
        // Remove token from holder's list
        uint256[] storage tokens = _holderTokens[from];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
        
        // If no more tokens, remove from holders list
        if (tokens.length == 0) {
            _isHolder[from] = false;
            for (uint256 i = 0; i < _holders.length; i++) {
                if (_holders[i] == from) {
                    _holders[i] = _holders[_holders.length - 1];
                    _holders.pop();
                    break;
                }
            }
        }
    }
    
    /**
     * @dev Get all current holders
     */
    function getHolders() external view returns (address[] memory) {
        return _holders;
    }
    
    /**
     * @dev Get tokens owned by a holder
     */
    function getHolderTokens(address holder) external view returns (uint256[] memory) {
        return _holderTokens[holder];
    }
    
    /**
     * @dev Get total number of unique holders
     */
    function getTotalHolders() external view returns (uint256) {
        return _holders.length;
    }
    
    /**
     * @dev Check if address is a holder
     */
    function isHolderAddress(address addr) external view returns (bool) {
        return _isHolder[addr];
    }
    
    // =============================================================
    //                           ADMIN
    // =============================================================
    
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }
    
    function setLowCostPrice(uint256 newPrice) external onlyOwner {
        lowCostPrice = newPrice;
        emit LowCostPriceUpdated(newPrice);
    }
    
    function toggleMinting() external onlyOwner {
        mintingActive = !mintingActive;
        emit MintingStateChanged(mintingActive);
    }
    
    function toggleLowCostMinting() external onlyOwner {
        lowCostMintActive = !lowCostMintActive;
        emit LowCostMintStateChanged(lowCostMintActive);
    }
    
    function setLowCostMintLimit(uint256 newLimit) external onlyOwner {
        lowCostMintLimit = newLimit;
    }
    
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }
    
    function setPlaceholderURI(string memory newPlaceholderURI) external onlyOwner {
        _placeholderURI = newPlaceholderURI;
    }
    
    function setContractURI(string memory newContractURI) external onlyOwner {
        _contractURI = newContractURI;
    }
    
    function reveal() external onlyOwner {
        revealed = true;
        emit MetadataRevealed();
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // =============================================================
    //                           METADATA
    // =============================================================
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        if (!revealed) {
            return _placeholderURI;
        }
        
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function contractURI() public view returns (string memory) {
        return _contractURI;
    }
    
    // =============================================================
    //                           VIEW FUNCTIONS
    // =============================================================
    
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter.current() - 1;
    }
    
    function mintedByAddress(address addr) external view returns (uint256) {
        return mintedPerWallet[addr];
    }
    
    function lowCostMintedByAddress(address addr) external view returns (uint256) {
        return lowCostMintedPerWallet[addr];
    }
    
    function remainingLowCostMints(address addr) external view returns (uint256) {
        if (!lowCostMintActive) return 0;
        return lowCostMintLimit - lowCostMintedPerWallet[addr];
    }
    
    function remainingRegularMints(address addr) external view returns (uint256) {
        if (!mintingActive) return 0;
        return MAX_PER_WALLET - mintedPerWallet[addr];
    }
    
    // =============================================================
    //                           OVERRIDES
    // =============================================================
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Update holder tracking on transfer
        if (from != address(0) && to != address(0)) {
            _removeHolderTracking(from, tokenId);
            _updateHolderTracking(to, tokenId);
        }
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}