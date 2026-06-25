import React, { useState, useEffect, useRef } from "react";
import "./EcommerceUI.css";
import AdBackground from "../common/AdBackground";

const CATEGORIES = [
  { id: 1, name: "Electronics", icon: "📱", count: 42 },
  { id: 2, name: "Fashion", icon: "👗", count: 68 },
  { id: 3, name: "Home & Living", icon: "🏠", count: 35 },
  { id: 4, name: "Beauty", icon: "💄", count: 28 },
  { id: 5, name: "Sports", icon: "⚽", count: 22 },
  { id: 6, name: "Books", icon: "📚", count: 55 },
  { id: 7, name: "Accessories", icon: "⌚", count: 31 },
  { id: 8, name: "Groceries", icon: "🛒", count: 44 },
];

const PRODUCTS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: [
    "Premium Wireless Headphones", "Designer Silk Dress", "Smart Home Speaker",
    "Leather Weekend Bag", "Minimalist Watch", "Organic Skincare Set",
    "Ergonomic Office Chair", "Handcrafted Ceramic Vase", "Portable Bluetooth Speaker",
    "Cashmere Sweater", "Stainless Steel Water Bottle", "Indoor Plant Pot Set",
    "Wireless Charging Pad", "Aviator Sunglasses", "Artisan Coffee Beans",
    "Yoga Mat Premium", "Scented Candle Collection", "Leather Wallet",
    "Canvas Backpack", "Bamboo Cutting Board", "Smart Fitness Tracker",
    "Wool Blend Scarf", "Desk Organizer Set", "Essential Oil Diffuser",
  ][i],
  price: 29 + Math.floor(Math.random() * 200),
  originalPrice: 79 + Math.floor(Math.random() * 300),
  discount: 15 + Math.floor(Math.random() * 40),
  rating: (3.5 + Math.random() * 1.5).toFixed(1),
  reviews: 20 + Math.floor(Math.random() * 200),
  category: CATEGORIES[i % 8].name,
  image: `https://picsum.photos/seed/product${i + 1}/400/400`,
}));

const REVIEWS = [
  { name: "Sarah Johnson", avatar: "S", rating: 5, text: "Absolutely love the quality! The packaging was beautiful and delivery was faster than expected.", date: "2 days ago" },
  { name: "Michael Chen", avatar: "M", rating: 4, text: "Great product for the price. The material feels premium and the design is exactly as shown.", date: "1 week ago" },
  { name: "Priya Sharma", avatar: "P", rating: 5, text: "Exceeded my expectations. The attention to detail is amazing and customer service was very helpful.", date: "3 days ago" },
  { name: "James Wilson", avatar: "J", rating: 4, text: "Good quality and fast shipping. The size fits perfectly.", date: "5 days ago" },
  { name: "Ananya Patel", avatar: "A", rating: 5, text: "Been using this for a week now and I'm impressed. Great value for money.", date: "1 day ago" },
  { name: "David Kim", avatar: "D", rating: 4, text: "Solid purchase. Works as described and looks great.", date: "2 weeks ago" },
];

function EcommerceUI() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("popular");
  const [subscribed, setSubscribed] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const checkoutRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    if (orderPlaced) {
      const t = setTimeout(() => { setOrderPlaced(false); setCheckoutOpen(false); setCart([]); }, 2000);
      return () => clearTimeout(t);
    }
  }, [orderPlaced]);

  useEffect(() => {
    document.body.style.overflow = cartOpen || checkoutOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, checkoutOpen]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast("Added to cart!");
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      ).filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast("Removed from cart");
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast("Removed from wishlist"); }
      else { next.add(id); showToast("Added to wishlist!"); }
      return next;
    });
  };

  const showToast = (msg) => {
    setToast(msg);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === "All" || p.category === selectedCat;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchesSearch && matchesCat && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "discount") return b.discount - a.discount;
    return 0;
  });

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
  };

  const Star = ({ filled }) => (
    <span className={`ecom-star${filled ? "" : " empty"}`}>
      {filled ? "★" : "★"}
    </span>
  );

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<Star key={i} filled={i < full} />);
    }
    return stars;
  };

  const SkeletonCard = () => (
    <div className="ecom-skeleton">
      <div className="ecom-skeleton-img" />
      <div className="ecom-skeleton-body">
        <div className="ecom-skeleton-line medium" />
        <div className="ecom-skeleton-line short" />
        <div className="ecom-skeleton-line" />
      </div>
    </div>
  );

  return (
    <div className="ecom">
      <AdBackground variant="light" />
      {/* TOP NAVBAR */}
      <nav className="ecom-nav-top">
        <span className="ecom-nav-logo">Luxe<span>Mart</span></span>
        <div className="ecom-nav-search">
          <select>
            <option>All</option>
            {CATEGORIES.map((c) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search LuxeMart"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>🔍</button>
        </div>
        <div className="ecom-nav-links">
          <button className="ecom-nav-item">
            Hello, Sign in
            <strong>Account & Lists</strong>
          </button>
          <button className="ecom-nav-item" onClick={() => showToast("Wishlist")}>
            ♡
            <strong>Wishlist</strong>
            {wishlist.size > 0 && <span className="ecom-nav-badge">{wishlist.size}</span>}
          </button>
          <button className="ecom-nav-item" onClick={() => setCartOpen(true)}>
            🛒
            <strong>Cart</strong>
            {cartCount > 0 && <span className="ecom-nav-badge">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* SUB NAVBAR */}
      <div className="ecom-nav-sub">
        <button className="ecom-nav-hamburger">☰</button>
        <button>Today's Deals</button>
        <button>Customer Service</button>
        <button>Gift Cards</button>
        <button>Sell</button>
        <a href="#!">Electronics</a>
        <a href="#!">Fashion</a>
        <a href="#!">Mobiles</a>
        <a href="#!">Home & Kitchen</a>
        <a href="#!">Books</a>
      </div>

      {/* HERO */}
      <section className="ecom-hero">
        <div className="ecom-hero-content">
          <span className="ecom-hero-tag">Summer Sale — Up to 60% Off</span>
          <h1 className="ecom-hero-title">
            Elevate Your <span>Style</span>
          </h1>
          <p className="ecom-hero-desc">
            Discover curated collections from top brands. Premium quality, effortless shopping, and exclusive deals delivered to your doorstep.
          </p>
          <div className="ecom-hero-actions">
            <button className="ecom-btn-primary">Shop Now →</button>
            <button className="ecom-btn-secondary">Explore More</button>
          </div>
        </div>
        <div className="ecom-hero-image">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80"
            alt="Shopping"
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="ecom-section">
        <div className="ecom-section-header">
          <h2 className="ecom-section-title">Shop by Category</h2>
          <button className="ecom-section-link">View All →</button>
        </div>
        <div className="ecom-categories">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="ecom-cat-card" onClick={() => setSelectedCat(cat.name)}>
              <div className="ecom-cat-icon">{cat.icon}</div>
              <div className="ecom-cat-name">{cat.name}</div>
              <div className="ecom-cat-count">{cat.count} items</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="ecom-section">
        <div className="ecom-section-header">
          <h2 className="ecom-section-title">Featured Products</h2>
          <select
            style={{
              padding: "8px 14px",
              border: "1.5px solid #ddd",
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "Inter, sans-serif",
              background: "#fff",
              color: "#0F1111",
              cursor: "pointer",
              outline: "none",
            }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>

        <div className="ecom-products-layout">
          <aside className="ecom-filter-sidebar">
            <div className="ecom-filter-title">
              Filters
              <button
                onClick={() => { setPriceRange([0, 500]); setSelectedCat("All"); }}
                className="ecom-filter-reset"
                style={{ width: "auto", padding: "4px 12px", fontSize: 12 }}
              >
                Reset
              </button>
            </div>
            <div className="ecom-filter-group">
              <span className="ecom-filter-label">Category</span>
              {["All", ...CATEGORIES.map((c) => c.name)].slice(0, 6).map((cat) => (
                <label key={cat} className="ecom-filter-option">
                  <input
                    type="radio"
                    name="cat"
                    checked={selectedCat === cat}
                    onChange={() => setSelectedCat(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
            <div className="ecom-filter-group">
              <span className="ecom-filter-label">Price Range</span>
              <div className="ecom-price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                />
              </div>
            </div>
            <div className="ecom-filter-group">
              <span className="ecom-filter-label">Rating</span>
              {[5, 4, 3].map((r) => (
                <label key={r} className="ecom-filter-option">
                  <input type="radio" name="rating" />
                  {r} ★ & above
                </label>
              ))}
            </div>
            <button
              className="ecom-filter-reset"
              onClick={() => { setPriceRange([0, 500]); setSelectedCat("All"); setSearch(""); }}
            >
              Clear All Filters
            </button>
          </aside>

          <div className="ecom-products-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : sortedProducts.length === 0
                ? <p style={{ gridColumn: "1 / -1", textAlign: "center", padding: 60, color: "#999" }}>No products found.</p>
                : sortedProducts.map((product) => (
                    <div key={product.id} className="ecom-product-card">
                      <div className="ecom-product-img-wrap">
                        <img src={product.image} alt={product.name} className="ecom-product-img" loading="lazy" />
                        <span className="ecom-product-badge">-{product.discount}%</span>
                        <button
                          className={`ecom-product-wishlist${wishlist.has(product.id) ? " active" : ""}`}
                          onClick={() => toggleWishlist(product.id)}
                        >
                          {wishlist.has(product.id) ? "♥" : "♡"}
                        </button>
                      </div>
                      <div className="ecom-product-info">
                        <div className="ecom-product-name">{product.name}</div>
                        <div className="ecom-product-rating">
                          {renderStars(product.rating)}
                          <span className="ecom-rating-count">({product.reviews})</span>
                        </div>
                        <div className="ecom-product-price">
                          <span className="ecom-price-current">{product.price}</span>
                          <span className="ecom-price-original">₹{product.originalPrice}</span>
                        </div>
                        <div className="ecom-product-prime">✓ FREE Delivery</div>
                        <button
                          className={`ecom-product-add${cart.some((c) => c.id === product.id) ? " added" : ""}`}
                          onClick={() => addToCart(product)}
                        >
                          {cart.some((c) => c.id === product.id) ? "✓ Added" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="ecom-section">
        <div className="ecom-section-header">
          <h2 className="ecom-section-title">What Our Customers Say</h2>
        </div>
        <div className="ecom-reviews">
          {REVIEWS.map((r, i) => (
            <div key={i} className="ecom-review-card">
              <div className="ecom-review-header">
                <div className="ecom-review-avatar">{r.avatar}</div>
                <div>
                  <div className="ecom-review-name">{r.name}</div>
                  <div className="ecom-review-date">{r.date}</div>
                </div>
              </div>
              <div className="ecom-review-stars">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} filled={si < r.rating} />
                ))}
              </div>
              <p className="ecom-review-text">"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="ecom-section">
        <div className="ecom-newsletter">
          <h2>Stay in the Loop</h2>
          <p>Subscribe to get exclusive offers, new arrivals, and 10% off your first order.</p>
          <form
            className="ecom-newsletter-form"
            onSubmit={(e) => { e.preventDefault(); setSubscribed(true); showToast("Subscribed successfully!"); }}
          >
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit">{subscribed ? "✓ Subscribed" : "Subscribe"}</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ecom-footer">
        <div className="ecom-footer-grid">
          <div>
            <div className="ecom-footer-brand">Luxe<span>Mart</span></div>
            <p className="ecom-footer-desc">
              Premium e-commerce platform offering curated collections from the world's finest brands. Quality assured, satisfaction guaranteed.
            </p>
            <div className="ecom-footer-social">
              {["𝕏", "f", "in", "𝕀"].map((s, i) => (
                <a key={i} href="#!" onClick={(e) => e.preventDefault()}>{s}</a>
              ))}
            </div>
          </div>
          <div>
            <h4>Shop</h4>
            <ul className="ecom-footer-links">
              {["New Arrivals", "Best Sellers", "Sale", "Gift Cards", "Brands"].map((l) => (
                <li key={l}><a href="#!" onClick={(e) => e.preventDefault()}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul className="ecom-footer-links">
              {["Help Center", "Returns", "Shipping Info", "Track Order", "Contact Us"].map((l) => (
                <li key={l}><a href="#!" onClick={(e) => e.preventDefault()}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul className="ecom-footer-links">
              {["About Us", "Careers", "Privacy Policy", "Terms of Service", "Press Kit"].map((l) => (
                <li key={l}><a href="#!" onClick={(e) => e.preventDefault()}>{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="ecom-footer-bottom">
          © 2026 LuxeMart. All rights reserved.
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <>
          <div className="ecom-cart-overlay" onClick={() => setCartOpen(false)} />
          <div className="ecom-cart-drawer">
            <div className="ecom-cart-header">
              <h2>Shopping Cart ({cartCount})</h2>
              <button className="ecom-cart-close" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="ecom-cart-items">
              {cart.length === 0 ? (
                <div className="ecom-cart-empty">
                  <div className="ecom-cart-empty-icon">🛒</div>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="ecom-cart-item">
                    <img src={item.image} alt={item.name} className="ecom-cart-item-img" />
                    <div className="ecom-cart-item-info">
                      <div className="ecom-cart-item-name">{item.name}</div>
                      <div className="ecom-cart-item-price">₹{item.price}</div>
                      <div className="ecom-cart-qty">
                        <button onClick={() => updateQty(item.id, -1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}>+</button>
                        <button className="ecom-cart-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="ecom-cart-footer">
                <div className="ecom-cart-total">
                  <span>Total</span>
                  <strong>₹{cartTotal.toLocaleString()}</strong>
                </div>
                <button className="ecom-cart-checkout" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <div className="ecom-checkout-overlay" onClick={(e) => { if (e.target === e.currentTarget) setCheckoutOpen(false); }}>
          <div className="ecom-checkout-modal" ref={checkoutRef}>
            {orderPlaced ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h2 style={{ color: "#0F1111", marginBottom: 8 }}>Order Placed!</h2>
                <p style={{ color: "#555" }}>Your order has been confirmed. You'll receive a confirmation email shortly.</p>
              </div>
            ) : (
              <>
                <h2>Checkout</h2>
                <p className="sub">Complete your order to get started</p>
                <form onSubmit={handlePlaceOrder}>
                  <div className="ecom-checkout-row">
                    <div className="ecom-checkout-field">
                      <label>First Name</label>
                      <input type="text" placeholder="John" required />
                    </div>
                    <div className="ecom-checkout-field">
                      <label>Last Name</label>
                      <input type="text" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="ecom-checkout-field">
                    <label>Email</label>
                    <input type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="ecom-checkout-field">
                    <label>Phone</label>
                    <input type="tel" placeholder="+91 98765 43210" required />
                  </div>
                  <div className="ecom-checkout-field">
                    <label>Address</label>
                    <textarea rows="3" placeholder="Enter your delivery address" required />
                  </div>
                  <div className="ecom-checkout-row">
                    <div className="ecom-checkout-field">
                      <label>City</label>
                      <input type="text" placeholder="Mumbai" required />
                    </div>
                    <div className="ecom-checkout-field">
                      <label>Pincode</label>
                      <input type="text" placeholder="400001" required />
                    </div>
                  </div>
                  <div className="ecom-checkout-summary">
                    <div className="ecom-checkout-summary-row">
                      <span>Items ({cartCount})</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="ecom-checkout-summary-row">
                      <span>Shipping</span>
                      <span style={{ color: "#067D62" }}>FREE</span>
                    </div>
                    <div className="ecom-checkout-summary-row">
                      <span>Tax (GST)</span>
                      <span>₹{(cartTotal * 0.18).toFixed(0)}</span>
                    </div>
                    <div className="ecom-checkout-summary-row total">
                      <span>Total</span>
                      <span>₹{(cartTotal + cartTotal * 0.18).toFixed(0)}</span>
                    </div>
                  </div>
                  <button type="submit" className="ecom-checkout-pay">
                    Place Your Order — ₹{(cartTotal + cartTotal * 0.18).toFixed(0)}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="ecom-toast">
          <span className="ecom-toast-icon">
            {toast.includes("Added") || toast.includes("Subscribed") ? "✓" : "♡"}
          </span>
          <span className="ecom-toast-msg">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default EcommerceUI;
