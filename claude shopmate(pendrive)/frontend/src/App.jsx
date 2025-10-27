import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, TrendingUp, Shield, Zap, Filter, X, Star, Package, ExternalLink, ArrowRight } from 'lucide-react';

const ShopMate = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100000,
    minRating: 0,
    category: 'all',
    dealsOnly: false,
    sort: 'relevance'
  });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setShowWelcome(false);

    try {
      const response = await fetch(`http://localhost:4000/api/products?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      const fetchedProducts = data.products || [];
      setProducts(fetchedProducts);
      setSummary(data.summary || 'Search complete!');
      
      // Save products to localStorage for comparison page
      if (fetchedProducts.length > 0) {
        localStorage.setItem('shopmate_products', JSON.stringify(fetchedProducts));
      }
    } catch (error) {
      console.error('Error:', error);
      setSummary('Unable to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    if (p.rating < filters.minRating) return false;
    if (filters.dealsOnly && !p.discount) return false;
    return true;
  }).sort((a, b) => {
    switch(filters.sort) {
      case 'price_low': return a.price - b.price;
      case 'price_high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 100000,
      minRating: 0,
      category: 'all',
      dealsOnly: false,
      sort: 'relevance'
    });
  };

  const goToComparePage = () => {
    window.location.href = './compare.html';
  };

  // NEW FUNCTION: Clears results and shows the welcome screen
  const goToHome = () => {
    setQuery('');
    setProducts([]);
    setSummary('');
    setShowWelcome(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* START OF CHANGE: Replace div with button and add onClick handler */}
            <button 
              onClick={goToHome}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <ShoppingCart className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              <h1 className="text-3xl font-bold text-white group-hover:text-yellow-300 transition-colors">ShopMate</h1>
            </button>
            {/* END OF CHANGE */}
            
            <div className="flex items-center gap-4">
              <button
                onClick={goToComparePage}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
              >
                <ArrowRight className="w-5 h-5" />
                Compare Products
              </button>
              <div className="text-white text-sm">Your AI Shopping Buddy 🛒</div>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Screen */}
      {showWelcome && (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
          <h2 className="text-5xl font-bold text-white mb-4">
            Find the Best Deals, Instantly! ✨
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Search across Amazon, Flipkart, eBay, and more in one place
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <TrendingUp className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Best Prices</h3>
              <p className="text-white/80 text-sm">Compare prices across all major stores</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Shield className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Verified Deals</h3>
              <p className="text-white/80 text-sm">Only authentic offers and discounts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Zap className="w-12 h-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">AI Powered</h3>
              <p className="text-white/80 text-sm">Smart recommendations just for you</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for laptops, phones, shoes, books..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-2xl text-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-2xl disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-4 bg-white/20 backdrop-blur-lg text-white rounded-2xl font-semibold hover:bg-white/30 transition-all"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Filters</h3>
              <button onClick={resetFilters} className="text-white/80 hover:text-white text-sm">
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-white text-sm mb-2 block">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">Minimum Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({...filters, minRating: Number(e.target.value)})}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                >
                  <option value={0}>Any</option>
                  <option value={3}>3★ & above</option>
                  <option value={4}>4★ & above</option>
                  <option value={4.5}>4.5★ & above</option>
                </select>
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({...filters, sort: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">Special Offers</label>
                <label className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.dealsOnly}
                    onChange={(e) => setFilters({...filters, dealsOnly: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-white text-sm">Deals Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Summary */}
      {summary && !showWelcome && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">AI Recommendation</h4>
                <p className="text-gray-600">{summary}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare Button */}
      {!showWelcome && filteredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Want to compare products?</h4>
                <p className="text-white/70 text-sm">Select any 2 products and get AI-powered comparison</p>
              </div>
            </div>
            <button
              onClick={goToComparePage}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-2xl transition-all flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Go to Compare Page
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!showWelcome && (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-xl font-semibold">
              {filteredProducts.length} Products Found
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 group"
              >
                <div className="relative">
                  <img
                    src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {product.store}
                  </div>
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    {product.rating > 0 && (
                      <>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {product.rating.toFixed(1)} ({product.reviews || 0})
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-800">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Package className={`w-4 h-4 ${product.stock ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm ${product.stock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all group-hover:shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      View Deal
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl text-white font-semibold mb-2">No products found</h3>
              <p className="text-white/80">Try adjusting your filters or search for something else</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-lg border-t border-white/20 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/80 text-sm">
          <p>© 2025 ShopMate - Your Personal Shopping Assistant | Powered by AI</p>
          <p className="mt-2">Searching across Amazon, Flipkart, eBay, Walmart & more</p>
        </div>
      </footer>
    </div>
  );
};

export default ShopMate;