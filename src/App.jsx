import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OfferCenter from "./pages/OfferCenter";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetails from "./pages/ProductDetails";
import { ShoppingCart, Tag, Settings, Search, User } from "lucide-react";

function HomeWrapper({ products, setCartItem }) {
  const navigate = useNavigate();
  return <HomePage products={products} onProductClick={(p) => { setCartItem(p); navigate('/cart'); }} />;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [cartItem, setCartItem] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products", err));
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="font-extrabold text-2xl tracking-tight">DealTest<span className="text-yellow-400">.</span></Link>
            
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input type="text" placeholder="Search products, brands and categories..." className="w-full text-black px-4 py-2 rounded-sm focus:outline-none"/>
                <Search className="absolute right-3 top-2 text-gray-400" size={20}/>
              </div>
            </div>

            <div className="flex items-center gap-6 font-medium">
              <Link to="/offers" className="flex items-center gap-1 hover:text-yellow-300 transition"><Tag size={18} /> Offers</Link>
              <Link to="/cart" className="flex items-center gap-1 hover:text-yellow-300 transition"><ShoppingCart size={18} /> Cart</Link>
              <Link to="/admin" className="flex items-center gap-1 hover:text-yellow-300 transition"><Settings size={18} /> Admin</Link>
              <button className="flex items-center gap-1 hover:text-yellow-300 transition"><User size={18}/> Login</button>
            </div>
          </div>
        </nav>
        
        <main>
          <Routes>
            <Route path="/" element={<HomeWrapper products={products} setCartItem={setCartItem} />} />
            <Route path="/product" element={<ProductDetails />} />
            <Route path="/cart" element={
              cartItem ? <CartPage cartItem={cartItem} /> : 
              <div className="p-8 text-center text-gray-500">Your cart is empty. Please select a product from Home.</div>
            } />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/offers" element={<OfferCenter />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
