import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heart, ExternalLink, Filter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function GalleryPage() {
  const [filter, setFilter] = useState('all');
  const [likedItems, setLikedItems] = useState<number[]>([]);

  const nftData = [
    {
      id: 1,
      name: "Hambriento Dragón #0001",
      price: "2.5 ETH",
      rarity: "Legendary",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
      category: "dragon"
    },
    {
      id: 2,
      name: "Fuego Famélico #0042",
      price: "1.8 ETH",
      rarity: "Rare",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop",
      category: "fire"
    },
    {
      id: 3,
      name: "Tigre Voraz #0123",
      price: "3.2 ETH",
      rarity: "Epic",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      category: "animal"
    },
    {
      id: 4,
      name: "Rey Hambriento #0067",
      price: "1.5 ETH",
      rarity: "Common",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      category: "classic"
    },
    {
      id: 5,
      name: "Águila Sedienta #0089",
      price: "4.1 ETH",
      rarity: "Legendary",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      category: "animal"
    },
    {
      id: 6,
      name: "Diablo Glotón #0156",
      price: "2.3 ETH",
      rarity: "Rare",
      image: "https://images.unsplash.com/photo-1566398652962-e64fa40cd4b1?w=400&h=400&fit=crop",
      category: "fire"
    },
    {
      id: 7,
      name: "Serpiente Insaciable #0201",
      price: "2.8 ETH",
      rarity: "Epic",
      image: "https://images.unsplash.com/photo-1635776062043-223faf322554?w=400&h=400&fit=crop",
      category: "dragon"
    },
    {
      id: 8,
      name: "Lobo Devorador #0298",
      price: "3.5 ETH",
      rarity: "Epic",
      image: "https://images.unsplash.com/photo-1614732414444-096040ec8c29?w=400&h=400&fit=crop",
      category: "animal"
    },
    {
      id: 9,
      name: "Emperador Faminto #0456",
      price: "1.9 ETH",
      rarity: "Rare",
      image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop",
      category: "classic"
    }
  ];

  const toggleLike = (id: number) => {
    setLikedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredNFTs = filter === 'all' 
    ? nftData 
    : nftData.filter(nft => nft.category === filter);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-purple-400 mb-4">
          Hungry Luchador Gallery
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Explore 10,000 unique Hungry Luchadors ready to feast on victory inside and outside the ring
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          className={filter === 'all' 
            ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0' 
            : 'border-white/20 text-white hover:bg-white/10'
          }
        >
          <Filter className="w-4 h-4 mr-2" />
          All Hungry
        </Button>
        <Button
          onClick={() => setFilter('dragon')}
          variant={filter === 'dragon' ? 'default' : 'outline'}
          className={filter === 'dragon' 
            ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0' 
            : 'border-white/20 text-white hover:bg-white/10'
          }
        >
          Dragon
        </Button>
        <Button
          onClick={() => setFilter('animal')}
          variant={filter === 'animal' ? 'default' : 'outline'}
          className={filter === 'animal' 
            ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0' 
            : 'border-white/20 text-white hover:bg-white/10'
          }
        >
          Animal
        </Button>
        <Button
          onClick={() => setFilter('fire')}
          variant={filter === 'fire' ? 'default' : 'outline'}
          className={filter === 'fire' 
            ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0' 
            : 'border-white/20 text-white hover:bg-white/10'
          }
        >
          Fire
        </Button>
        <Button
          onClick={() => setFilter('classic')}
          variant={filter === 'classic' ? 'default' : 'outline'}
          className={filter === 'classic' 
            ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0' 
            : 'border-white/20 text-white hover:bg-white/10'
          }
        >
          Classic
        </Button>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNFTs.map((nft) => (
          <Card key={nft.id} className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden hover:bg-white/10 transition-all duration-300 group">
            <div className="relative overflow-hidden">
              <ImageWithFallback
                src={nft.image}
                alt={nft.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <Button
                    onClick={() => toggleLike(nft.id)}
                    variant="outline"
                    size="icon"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        likedItems.includes(nft.id) ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Badge className={`absolute top-4 right-4 ${getRarityColor(nft.rarity)}`}>
                {nft.rarity}
              </Badge>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{nft.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-cyan-400">{nft.price}</span>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredNFTs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/60 text-lg">No hungry luchadores found in this category.</p>
        </div>
      )}
    </div>
  );
}