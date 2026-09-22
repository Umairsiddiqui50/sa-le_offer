import React from 'react';
import { Search, ShoppingCart, User, Heart, Tag } from 'lucide-react';

export default function Header({ navigate }) {
  return (
    <header className="header">
      <div className="header-container">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); navigate.home(); }}>
          <span style={{color: '#fbbf24'}}>Deal</span>Test
        </a>
        
        <div className="search-bar">
          <input type="text" placeholder="Search for products, brands and more" />
          <button><Search size={20} /></button>
        </div>
        
        <nav className="nav-links">
          <a href="#" onClick={(e)=>{e.preventDefault(); navigate.offerCenter();}} className="nav-item"><Tag size={20} /> Offers</a>
          <a href="#" className="nav-item"><User size={20} /> Login</a>
          <a href="#" onClick={(e)=>{e.preventDefault(); navigate.cart();}} className="nav-item"><ShoppingCart size={20} /> Cart</a>
        </nav>
      </div>
    </header>
  );
}
