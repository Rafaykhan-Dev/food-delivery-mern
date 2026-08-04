import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

function App() {
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', address: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [activeFaq, setActiveFaq] = useState('how-works');

  useEffect(() => {
    fetchRestaurants();
  }, [searchTerm]);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${API_URL}/restaurants?search=${searchTerm}`);
      setRestaurants(res.data);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await axios.post(`${API_URL}/auth/register`, authForm);
        alert('✨ Account created successfully! Please log in.');
        setIsRegister(false);
        setAuthForm({ name: '', email: '', password: '', address: '' });
      } else {
        const res = await axios.post(`${API_URL}/auth/login`, { 
          email: authForm.email, 
          password: authForm.password 
        });
        
        setUser(res.data.user);
        setShowAuthModal(false);
        setAuthForm({ name: '', email: '', password: '', address: '' });
        alert(`👋 Welcome back, ${res.data.user.name}!`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication error. Please check your backend connection.');
    }
  };

  const handleInputChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const addToCart = (item) => {
    const existing = cart.find(cartItem => cartItem.name === item.name);
    if (existing) {
      setCart(cart.map(c => c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);

  const placeOrder = async () => {
    if (!user) {
      setShowAuthModal(true);
      return alert('🔒 Please log in to complete your purchase.');
    }
    if (cart.length === 0) return alert('Your cart is empty!');

    try {
      await axios.post(`${API_URL}/orders/place`, {
        userId: user.id,
        restaurantName: selectedRestaurant ? selectedRestaurant.name : 'Partner Restaurant',
        items: cart,
        totalAmount: getCartTotal(),
        paymentMethod
      });
      alert('🎉 Order successfully placed! Cooking has begun.');
      setCart([]);
    } catch (err) {
      console.error(err);
    }
  };

  const allRestaurantsDataset = [
    { 
      name: "Burger Junction", 
      cuisineType: "Gourmet Smashed Burgers", 
      rating: 4.5, 
      imgUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
      menu: [
        { name: "Cheese Burger Smash", price: 650, category: "Burgers" },
        { name: "Crispy Chicken Zinger", price: 550, category: "Burgers" },
        { name: "Loaded Peri Fries", price: 350, category: "Sides" }
      ]
    },
    { 
      name: "Pizzeria Delizia", 
      cuisineType: "Perfect Italian Crusts", 
      rating: 4.8, 
      imgUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
      menu: [
        { name: "Pepperoni Feast Pizza", price: 1450, category: "Pizza" },
        { name: "Margherita Classic", price: 1150, category: "Pizza" },
        { name: "Garlic Breadsticks", price: 290, category: "Sides" }
      ]
    },
    { 
      name: "McDonald's", 
      cuisineType: "Big Mac & Value Meals", 
      rating: 4.8, 
      imgUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60",
      menu: [
        { name: "Big Mac Value Meal", price: 990, category: "Burgers" },
        { name: "McFlurry Oreo Treat", price: 380, category: "Desserts" },
        { name: "Golden French Fries", price: 290, category: "Sides" }
      ]
    },
    { 
      name: "Papa Johns", 
      cuisineType: "The Works & Garlic Sticks", 
      rating: 4.5, 
      imgUrl: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500&auto=format&fit=crop&q=60",
      menu: [
        { name: "The Works Pizza", price: 1550, category: "Pizza" },
        { name: "Garlic Pizza Sticks", price: 450, category: "Sides" }
      ]
    },
    { 
      name: "KFC", 
      cuisineType: "Zinger Burger & Buckets", 
      rating: 4.3, 
      imgUrl: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=500&auto=format&fit=crop&q=60",
      menu: [
        { name: "8 Pc Bucket Feast", price: 2350, category: "Buckets" },
        { name: "Zinger Burger", price: 540, category: "Burgers" }
      ]
    },
    { 
      name: "Texas Chicken", 
      cuisineType: "Crispy Chicken Combo", 
      rating: 4.2, 
      imgUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60",
      menu: [
        { name: "Mega Crunch Combo", price: 890, category: "Combos" },
        { name: "Honey Butter Biscuits", price: 250, category: "Sides" }
      ]
    },
    { 
      name: "Burger King", 
      cuisineType: "Flame-Broiled Whopper", 
      rating: 4.4, 
      imgUrl: "https://images.unsplash.com/photo-1534790566855-4cb788d389ec?w=500&auto=format&fit=crop&q=60",
      menu: [
        { name: "Whopper Meal Combo", price: 950, category: "Burgers" },
        { name: "Onion Rings Large", price: 280, category: "Sides" }
      ]
    },
    { 
      name: "Shaurma 1", 
      cuisineType: "Artisanal Chicken Shaurma", 
      rating: 4.7, 
      imgUrl: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60",
      menu: [
        { name: "Classic Chicken Shaurma", price: 350, category: "Wraps" },
        { name: "Hummus & Pita Plate", price: 400, category: "Appetizers" }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh', fontFamily: '"Inter", -apple-system, sans-serif', color: '#111827', position: 'relative' }}>
      
      {/* AUTH MODAL INTERFACE */}
      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', position: 'relative' }}>
            <button 
              onClick={() => setShowAuthModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B7280' }}
            >
              ✕
            </button>
            
            <h3 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', color: '#03081F' }}>
              {isRegister ? 'Create an Account' : 'Welcome Back'}
            </h3>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px 0' }}>
              {isRegister ? 'Join Foodhub to track your food history' : 'Sign in to access your custom checkout pipeline'}
            </p>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isRegister && (
                <>
                  <input 
                    type="text" name="name" placeholder="Full Name" required 
                    value={authForm.name} onChange={handleInputChange}
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }}
                  />
                  <input 
                    type="text" name="address" placeholder="Delivery Address" required 
                    value={authForm.address} onChange={handleInputChange}
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }}
                  />
                </>
              )}
              
              <input 
                type="email" name="email" placeholder="Email Address" required 
                value={authForm.email} onChange={handleInputChange}
                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }}
              />
              <input 
                type="password" name="password" placeholder="Password" required 
                value={authForm.password} onChange={handleInputChange}
                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }}
              />

              <button type="submit" style={{ backgroundColor: '#FC8019', color: '#FFFFFF', border: 'none', padding: '14px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', marginTop: '10px', fontSize: '15px' }}>
                {isRegister ? 'Sign Up' : 'Log In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#4B5563', marginTop: '20px', marginBottom: 0 }}>
              {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <span 
                onClick={() => setIsRegister(!isRegister)} 
                style={{ color: '#FC8019', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isRegister ? 'Login here' : 'Register here'}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Top Utility Strip */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '12px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid #E5E7EB' }}>
        <div>🌟 Get 5% Off your first order, <span style={{ color: '#FC8019', fontWeight: 'bold' }}>Promo: FOOD5</span></div>
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center', color: '#4B5563' }}>
          <span>📍 Gulshan-e-Iqbal, Karachi, Pakistan</span>
          <span style={{ color: '#FC8019', cursor: 'pointer', fontWeight: '700' }}>Change Location</span>
        </div>
      </div>

      {/* Navigation Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setSelectedRestaurant(null)}>
          <span style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>Food<span style={{ color: '#FC8019' }}>hub</span></span>
        </div>
        
        <nav style={{ display: 'flex', gap: '35px', fontWeight: '600', fontSize: '15px', color: '#4B5563' }}>
          <span style={{ color: '#FC8019', cursor: 'pointer' }} onClick={() => setSelectedRestaurant(null)}>Home</span>
          <span style={{ cursor: 'pointer' }}>Browse Menu</span>
          <span style={{ cursor: 'pointer' }}>Special Offers</span>
          <span style={{ cursor: 'pointer' }}>Restaurants</span>
        </nav>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#028643', color: '#FFFFFF', padding: '10px 20px', borderRadius: '50px', fontWeight: '700', gap: '12px', fontSize: '14px' }}>
            <span>🛒 {getCartCount()} Items</span>
            <span style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '12px' }}>Rs. {getCartTotal().toLocaleString()}</span>
          </div>
          <button onClick={() => user ? setUser(null) : setShowAuthModal(true)} style={{ backgroundColor: '#111827', color: '#FFFFFF', border: 'none', padding: '10px 22px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
            👤 {user ? `Logout (${user.name})` : 'Login / Signup'}
          </button>
        </div>
      </header>

      {!selectedRestaurant ? (
        <>
          {/* HIGH-IMPACT EYE-CATCHING HERO BANNER */}
          <div style={{ 
            margin: '40px 60px', 
            background: 'radial-gradient(circle at 80% 20%, #0F172A 0%, #03081F 60%, #110700 100%)', 
            borderRadius: '28px', 
            display: 'grid', 
            gridTemplateColumns: '1.4fr 1fr', 
            padding: '70px 60px', 
            alignItems: 'center', 
            gap: '20px', 
            position: 'relative', 
            overflow: 'hidden',
            boxShadow: '0px 20px 40px rgba(3, 8, 31, 0.25)' 
          }}>
            
            {/* Glowing Mesh Orbs for Visual Flair */}
            <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(252,128,25,0.15) 0%, transparent 75%)', top: '-100px', right: '-50px', zIndex: 1 }} />
            <div style={{ position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(2,134,67,0.1) 0%, transparent 75%)', bottom: '-50px', left: '40%', zIndex: 1 }} />
            
            {/* Left Content Column */}
            <div style={{ zIndex: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '50px', marginBottom: '18px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '12px' }}>🚀</span>
                <span style={{ color: '#E2E8F0', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Delivery Across Pakistan</span>
              </div>
              
              <h2 style={{ fontSize: '64px', fontWeight: '900', lineHeight: '1.05', margin: '0 0 24px 0', letterSpacing: '-2px', color: '#FFFFFF' }}>
                Your Favorite Flavors,<br/>
                <span style={{ background: 'linear-gradient(90deg, #FC8019 0%, #FF9F43 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Delivered Bold & Fast.
                </span>
              </h2>
              
              {/* Sleek Integrated Search Wrapper */}
              <div style={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.07)', backdropFilter: 'blur(20px)', borderRadius: '50px', padding: '6px 6px 6px 24px', border: '1px solid rgba(255, 255, 255, 0.15)', maxWidth: '540px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <input 
                  type="text" 
                  placeholder="Craving burgers, pizza, or wraps? Find it here..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', fontWeight: '500', color: '#FFFFFF', backgroundColor: 'transparent' }}
                />
                <button style={{ backgroundColor: '#FC8019', color: '#FFFFFF', border: 'none', padding: '16px 40px', borderRadius: '50px', fontWeight: '800', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(252, 128, 25, 0.4)' }}>
                  Search
                </button>
              </div>
            </div>

            {/* Right Graphics Column - Clean Minimal Grid Visualizer */}
            <div style={{ zIndex: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', transform: 'rotate(-4deg)', transformOrigin: 'center' }}>
                {['🍔', '🍕', '🍟', '🌯'].map((emoji, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.04)', 
                      backdropFilter: 'blur(8px)', 
                      borderRadius: '24px', 
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '42px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Restaurant Grid display */}
          <div style={{ padding: '0 60px', marginBottom: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', margin: '0 0 4px 0' }}>Available Restaurants</h3>
                <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>Explore premium food partnerships delivering directly across Pakistan.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {allRestaurantsDataset
                .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.cuisineType.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((brand, i) => {
                  const liveBackendMatch = restaurants.find(r => r.name.toLowerCase().includes(brand.name.toLowerCase().split(" ")[0]));
                  
                  return (
                    <div 
                      key={i} 
                      onClick={() => {
                        if (liveBackendMatch) {
                          setSelectedRestaurant(liveBackendMatch);
                        } else {
                          setSelectedRestaurant({
                            name: brand.name,
                            rating: brand.rating,
                            menu: brand.menu
                          });
                        }
                      }}
                      style={{ 
                        backgroundColor: '#FFFFFF', 
                        borderRadius: '16px', 
                        overflow: 'hidden', 
                        cursor: 'pointer', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                        border: '1px solid #E5E7EB',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '260px'
                      }}
                    >
                      <div style={{ width: '100%', height: '160px', position: 'relative', overflow: 'hidden' }}>
                        <img 
                          src={brand.imgUrl} 
                          alt={brand.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: '#FFFFFF', color: '#111827', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          ⭐ {brand.rating}
                        </div>
                      </div>

                      <div style={{ padding: '16px', backgroundColor: '#FFFFFF', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: '800', color: '#111827' }}>{brand.name}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>{brand.cuisineType}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Download Mobile App Promo Box */}
          <div style={{ 
            margin: '0 60px 60px 60px', 
            backgroundColor: '#EAEAEA', 
            borderRadius: '16px', 
            display: 'grid', 
            gridTemplateColumns: '1.2fr 1fr', 
            alignItems: 'center', 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{ width: '100%', height: '380px', position: 'relative' }}>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80" 
                alt="Foodhub app users"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center 15%',
                  mixBlendMode: 'multiply',
                  filter: 'grayscale(10%) contrast(105%)'
                }}
              />
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '150px', background: 'linear-gradient(to right, transparent, #EAEAEA)' }} />
            </div>

            <div style={{ padding: '40px 60px 40px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h4 style={{ 
                fontFamily: '"Poppins", "Inter", sans-serif',
                fontSize: '56px', 
                fontWeight: '800', 
                margin: '0 0 10px 0', 
                letterSpacing: '-1.5px', 
                color: '#03081F',
                lineHeight: '1.05'
              }}>
                Foodhubing is more
              </h4>

              <div style={{ marginBottom: '25px' }}>
                <span style={{ 
                  backgroundColor: '#03081F', 
                  color: '#FC8019', 
                  padding: '10px 28px', 
                  borderRadius: '50px', 
                  fontSize: '38px',
                  fontWeight: '800',
                  letterSpacing: '-0.5px',
                  display: 'inline-block',
                  boxShadow: '0 4px 15px rgba(3, 8, 31, 0.15)'
                }}>
                  Personalised & Instant
                </span>
              </div>
              
              <p style={{ color: '#03081F', fontSize: '18px', fontWeight: '600', margin: '0 0 25px 0', letterSpacing: '-0.3px' }}>
                Download the Foodhub app for faster ordering
              </p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="#appstore" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#000000', color: '#FFFFFF', padding: '10px 20px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '24px' }}>🍏</span>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: 0, fontSize: '9px', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: '500', letterSpacing: '0.2px' }}>Download on the</p>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', letterSpacing: '-0.2px', lineHeight: '1.2' }}>App Store</p>
                  </div>
                </a>

                <a href="#playstore" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#000000', color: '#FFFFFF', padding: '10px 20px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '22px' }}>🤖</span>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: 0, fontSize: '9px', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: '500', letterSpacing: '0.2px' }}>GET IT ON</p>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', letterSpacing: '-0.2px', lineHeight: '1.2' }}>Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Recruitment Affiliate Layout */}
          <div style={{ padding: '0 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '60px' }}>
            <div style={{ 
              position: 'relative',
              borderRadius: '16px', 
              overflow: 'hidden',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '30px',
              backgroundImage: "url('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(3, 8, 31, 0.7)', zIndex: 1 }} />
              <div style={{ zIndex: 2, alignSelf: 'flex-start' }}>
                <span style={{ 
                  backgroundColor: '#FFFFFF', 
                  color: '#03081F', 
                  fontWeight: '800', 
                  fontSize: '14px', 
                  padding: '10px 24px', 
                  borderRadius: '0 0 12px 12px',
                  display: 'inline-block',
                  marginTop: '-30px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}>
                  Earn more with lower fees
                </span>
              </div>
              <div style={{ zIndex: 2, marginTop: 'auto' }}>
                <p style={{ color: '#FC8019', fontWeight: '700', fontSize: '15px', margin: '0 0 4px 0' }}>Signup as a business</p>
                <h4 style={{ fontSize: '38px', fontWeight: '800', margin: '0 0 20px 0', color: '#FFFFFF', letterSpacing: '-0.5px' }}>Partner with us</h4>
                <button style={{ backgroundColor: '#FC8019', color: '#FFFFFF', border: 'none', padding: '14px 35px', borderRadius: '50px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(252, 128, 25, 0.3)' }}>Get Started</button>
              </div>
            </div>

            <div style={{ 
              position: 'relative',
              borderRadius: '16px', 
              overflow: 'hidden',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '30px',
              backgroundImage: "url('https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=800&auto=format&fit=crop&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(3, 8, 31, 0.65)', zIndex: 1 }} />
              <div style={{ zIndex: 2, alignSelf: 'flex-start' }}>
                <span style={{ 
                  backgroundColor: '#FFFFFF', 
                  color: '#03081F', 
                  fontWeight: '800', 
                  fontSize: '14px', 
                  padding: '10px 24px', 
                  borderRadius: '0 0 12px 12px',
                  display: 'inline-block',
                  marginTop: '-30px', 
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}>
                  Avail exclusive perks
                </span>
              </div>
              <div style={{ zIndex: 2, marginTop: 'auto' }}>
                <p style={{ color: '#FC8019', fontWeight: '700', fontSize: '15px', margin: '0 0 4px 0' }}>Signup as a rider</p>
                <h4 style={{ fontSize: '38px', fontWeight: '800', margin: '0 0 20px 0', color: '#FFFFFF', letterSpacing: '-0.5px' }}>Ride with us</h4>
                <button style={{ backgroundColor: '#FC8019', color: '#FFFFFF', border: 'none', padding: '14px 35px', borderRadius: '50px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(252, 128, 25, 0.3)' }}>Get Started</button>
              </div>
            </div>
          </div>

          {/* FAQ HUB & MARKETING STAGE */}
          <div style={{ padding: '0 60px', marginBottom: '60px' }}>
            <div style={{ 
              backgroundColor: '#F3F4F6', 
              borderRadius: '20px', 
              padding: '50px 60px',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#03081F', margin: 0, letterSpacing: '-1px' }}>
                  Know more about us!
                </h3>
                <div style={{ display: 'flex', gap: '15px', backgroundColor: '#E5E7EB', padding: '6px', borderRadius: '50px' }}>
                  {['Frequent Questions', 'Who we are?', 'Partner Program', 'Help & Support'].map((tab, idx) => (
                    <span 
                      key={idx} 
                      onClick={() => idx === 0 ? setActiveFaq('how-works') : null}
                      style={{ 
                        backgroundColor: idx === 0 ? '#FFFFFF' : 'transparent',
                        color: '#03081F',
                        padding: '10px 24px',
                        borderRadius: '50px',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: idx === 0 ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                      }}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '50px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 'how-works', text: 'How does Foodhub work?' },
                    { id: 'payment', text: 'What payment methods are accepted?' },
                    { id: 'track', text: 'Can I track my order in real-time?' },
                    { id: 'discounts', text: 'Are there any special discounts or promotions available?' },
                    { id: 'area', text: 'Is Foodhub available in my area?' }
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setActiveFaq(item.id)}
                      style={{ 
                        width: '100%',
                        textAlign: 'left',
                        padding: '16px 24px',
                        borderRadius: '50px',
                        border: 'none',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        backgroundColor: activeFaq === item.id ? '#FC8019' : '#FFFFFF',
                        color: activeFaq === item.id ? '#FFFFFF' : '#03081F',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>

                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '30px' }}>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '24px 20px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                      <h5 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '800', color: '#03081F' }}>Place an Order!</h5>
                      <div style={{ fontSize: '44px', margin: '15px 0' }}>🛎️</div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#4B5563', lineHeight: '1.4', fontWeight: '500' }}>Place order through our website or Mobile app</p>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '24px 20px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                      <h5 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '800', color: '#03081F' }}>Track Progress</h5>
                      <div style={{ fontSize: '44px', margin: '15px 0' }}>🍔</div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#4B5563', lineHeight: '1.4', fontWeight: '500' }}>Your can track your order status with delivery time</p>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '24px 20px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                      <h5 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '800', color: '#03081F' }}>Get your Order!</h5>
                      <div style={{ fontSize: '44px', margin: '15px 0' }}>📱</div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#4B5563', lineHeight: '1.4', fontWeight: '500' }}>Receive your order at a lighting fast speed!</p>
                    </div>
                  </div>

                  <p style={{ margin: 0, textAlign: 'center', color: '#374151', fontSize: '14px', lineHeight: '1.6', fontWeight: '500', padding: '0 20px' }}>
                    Foodhub simplifies the food ordering process. Browse through our diverse menu, select your favorite dishes, and proceed to checkout. Your delicious meal will be on its way to your doorstep in no time!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ORANGE PERFORMANCE METRICS COUNTER DASHBOARD */}
          <div style={{ 
            margin: '0 60px 60px 60px',
            backgroundColor: '#FC8019',
            borderRadius: '16px',
            padding: '40px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: '0 10px 30px rgba(252, 128, 25, 0.15)'
          }}>
            <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.25)' }}>
              <h4 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 4px 0', letterSpacing: '-1px' }}>546+</h4>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Registered Riders</p>
            </div>
            <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.25)' }}>
              <h4 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 4px 0', letterSpacing: '-1px' }}>789,900+</h4>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Orders Delivered</p>
            </div>
            <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.25)' }}>
              <h4 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 4px 0', letterSpacing: '-1px' }}>690+</h4>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Restaurants Partnered</p>
            </div>
            <div>
              <h4 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 4px 0', letterSpacing: '-1px' }}>17,457+</h4>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Food items</p>
            </div>
          </div>

          {/* PRIMARY CORPORATE BRAND FOOTER UTILITY SHELL */}
          <footer style={{ backgroundColor: '#EAEAEA', borderTop: '1px solid #D1D5DB', padding: '60px 60px 20px 60px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1.2fr 1.3fr 0.8fr 0.8fr', 
              gap: '40px',
              paddingBottom: '50px',
              borderBottom: '1px solid #D1D5DB',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <span style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px', color: '#03081F' }}>
                  Food<span style={{ color: '#FC8019' }}>hub</span>
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="#store" style={{ width: '150px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#000000', color: '#FFF', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '12px' }}>
                    <span>🍏</span> <span>App Store</span>
                  </a>
                  <a href="#store" style={{ width: '150px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#000000', color: '#FFF', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '12px' }}>
                    <span>🤖</span> <span>Google Play</span>
                  </a>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.4' }}>
                  Company # 490039-445, Registered with<br />House of companies.
                </p>
              </div>

              <div>
                <h5 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: '#03081F' }}>
                  Get Exclusive Deals in your Inbox
                </h5>
                <div style={{ display: 'flex', backgroundColor: '#FFFFFF', borderRadius: '50px', padding: '4px', border: '1px solid #D1D5DB', marginBottom: '12px' }}>
                  <input 
                    type="email" 
                    placeholder="youremail@gmail.com" 
                    style={{ border: 'none', outline: 'none', paddingLeft: '16px', width: '100%', fontSize: '14px', backgroundColor: 'transparent' }}
                  />
                  <button style={{ backgroundColor: '#FC8019', color: '#FFFFFF', border: 'none', padding: '10px 22px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                    Subscribe
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>
                  we wont spam, read our <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>email policy</span>
                </p>
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px', fontSize: '18px', cursor: 'pointer' }}>
                  <span>🔵</span> <span>📸</span> <span>🎵</span> <span>👻</span>
                </div>
              </div>

              <div>
                <h5 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: '#03081F' }}>Legal Pages</h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', fontWeight: '600' }}>
                  {['Terms and conditions', 'Privacy', 'Cookies', 'Modern Slavery Statement'].map((item, i) => (
                    <li key={i} style={{ color: '#374151', cursor: 'pointer', textDecoration: 'underline' }}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: '#03081F' }}>Important Links</h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', fontWeight: '600' }}>
                  {['Get help', 'Add your restaurant', 'Sign up to deliver', 'Create a business account'].map((item, i) => (
                    <li key={i} style={{ color: '#374151', cursor: 'pointer', textDecoration: 'underline' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#4B5563', fontWeight: '500' }}>
              <div>Foodhub Copyright 2026, All Rights Reserved.</div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
                <span style={{ cursor: 'pointer' }}>Terms</span>
                <span style={{ cursor: 'pointer' }}>Pricing</span>
                <span style={{ cursor: 'pointer' }}>Do not sell or share my personal information</span>
              </div>
            </div>
          </footer>
        </>
      ) : (
        /* Focused Restaurant Menu Detail View */
        <div style={{ padding: '40px 60px', display: 'flex', gap: '40px' }}>
          <div style={{ flex: 2 }}>
            <button onClick={() => setSelectedRestaurant(null)} style={{ backgroundColor: 'transparent', border: 'none', color: '#FC8019', fontWeight: '700', cursor: 'pointer', marginBottom: '20px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              ← Back to All Restaurants
            </button>
            <div style={{ background: '#FFFFFF', padding: '35px', borderRadius: '20px', border: '1px solid #E5E7EB', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '900', letterSpacing: '-0.5px' }}>{selectedRestaurant.name}</h2>
                <span style={{ backgroundColor: '#FFF3EA', color: '#FC8019', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '800' }}>⭐ {selectedRestaurant.rating || '4.5'} Rating</span>
              </div>
              <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>Premium culinary menu selections prepared fresh upon secure transaction loop authorization.</p>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>Available Dishes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedRestaurant.menu && selectedRestaurant.menu.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '20px 30px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.01)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#111827' }}>{item.name}</h4>
                    <span style={{ backgroundColor: '#F3F4F6', color: '#4B5563', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>{item.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>Rs. {item.price.toLocaleString()}</span>
                    <button onClick={() => addToCart(item)} style={{ backgroundColor: '#FC8019', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                      Add to Basket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Checkout Basket Box */}
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '20px', border: '1px solid #E5E7EB', position: 'sticky', top: '100px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '800', borderBottom: '2px solid #F3F4F6', paddingBottom: '12px' }}>My Basket</h3>
              {cart.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontStyle: 'italic', margin: '30px 0', textAlign: 'center', fontSize: '14px' }}>Your basket is empty.</p>
              ) : (
                <div>
                  {cart.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                      <span><strong style={{ color: '#FC8019' }}>{item.quantity}x</strong> {item.name}</span>
                      <span style={{ fontWeight: '700', color: '#111827' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <hr style={{ border: 'none', borderTop: '2px solid #F3F4F6', margin: '16px 0' }}/>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
                    <span>Subtotal:</span>
                    <span style={{ color: '#FC8019' }}>Rs. {getCartTotal().toLocaleString()}</span>
                  </div>
                  <button onClick={placeOrder} style={{ width: '100%', padding: '14px', backgroundColor: '#028643', color: '#FFFFFF', border: 'none', borderRadius: '50px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
                    Checkout Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;