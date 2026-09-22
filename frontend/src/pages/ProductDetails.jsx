
import React, { useState, useEffect } from 'react';

export default function ProductDetails() {
  const [promos, setPromos] = useState([]);
  
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/promotions')
      .then(res => res.json())
      .then(data => setPromos(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" alt="Product" className="h-64 object-covermix-blend-multiply"/>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold">Sony WH-1000XM5 Wireless Headphones</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-green-700 text-white px-2 py-0.5 rounded text-sm font-bold">4.8 ★</span>
          <span className="text-gray-500 text-sm">(1,240 Ratings)</span>
        </div>
        
        <div className="mt-4">
          <span className="text-3xl font-bold">₹29,990</span>
          <span className="text-gray-500 line-through ml-3">₹34,990</span>
          <span className="text-green-600 font-bold ml-3">14% off</span>
        </div>
        
        <div className="mt-8 border border-green-200 bg-green-50 rounded-lg p-4">
          <h3 className="font-bold text-green-800 mb-2">AVAILABLE OFFERS</h3>
          <p className="text-xs text-gray-500 mb-3">Up to 3 offers can be combined on this product/order. Applicable offers will be calculated at checkout.</p>
          
          <ul className="space-y-2">
            {promos.slice(0, 4).map(p => (
              <li key={p.promotion_id} className="text-sm flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="font-medium">{p.title}</span> - <span className="text-gray-600">{p.description}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-8 flex gap-4">
          <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded shadow">ADD TO CART</button>
          <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded shadow">BUY NOW</button>
        </div>
      </div>
    </div>
  );
}
