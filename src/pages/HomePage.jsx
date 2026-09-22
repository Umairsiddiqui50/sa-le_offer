
import React from 'react';
import { Star, ShieldCheck, Truck, ArrowRight } from 'lucide-react';

const PRODUCT_IMAGES = {
  1: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", // Headphones
  2: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80", // Apple Watch
  3: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", // Nike Shoes
  4: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", // MacBook
  5: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80", // TV
  6: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=500&q=80", // iPhone
  7: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", // Adidas
  8: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80"  // Speaker
};

export default function HomePage({ products, onProductClick }) {
  if (!products || products.length === 0) return <div className="p-8 text-center text-gray-500">Loading products...</div>;
  
  return (
    <div className="bg-gray-50 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">Big Deals.<br/>Smart Savings.</h1>
            <p className="text-xl mb-8 text-blue-100">Get the best combination of offers on every purchase. Our intelligent engine finds the maximum discount for you.</p>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded shadow-lg transition">SHOP NOW</button>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
             <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
               <div className="bg-white text-blue-900 px-4 py-2 rounded font-black text-2xl mb-2 text-center shadow">10% OFF BANK OFFER</div>
               <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-black text-xl mb-2 text-center shadow">+ ₹500 COUPON</div>
               <div className="bg-green-500 text-white px-4 py-2 rounded font-black text-xl text-center shadow">+ FREE DELIVERY</div>
             </div>
          </div>
        </div>
      </div>

      {/* Feature Strip */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium text-gray-600">
          <div className="flex items-center gap-2 justify-center"><ShieldCheck className="text-green-500" size={20}/> 100% Secure</div>
          <div className="flex items-center gap-2 justify-center"><Truck className="text-blue-500" size={20}/> Fast Delivery</div>
          <div className="flex items-center gap-2 justify-center"><Star className="text-yellow-500" size={20}/> Top Rated</div>
          <div className="flex items-center gap-2 justify-center"><ArrowRight className="text-purple-500" size={20}/> Smart Offers</div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Today's Top Deals</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => {
            const discountPct = Math.round(((p.mrp - p.price) / p.mrp) * 100);
            const image = PRODUCT_IMAGES[p.product_id] || PRODUCT_IMAGES[1];
            
            return (
              <div key={p.product_id} onClick={() => onProductClick(p)} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all cursor-pointer group overflow-hidden border border-gray-100 flex flex-col h-full">
                <div className="relative h-56 bg-gray-100 p-4 flex items-center justify-center">
                  <img src={image} alt={p.name} className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {discountPct}% OFF
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">{p.brand}</div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 flex-1">{p.name}</h3>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <span className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center">
                      4.5 <Star size={10} className="ml-0.5 fill-current"/>
                    </span>
                    <span className="text-gray-400 text-xs">(1,240)</span>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-black text-gray-900">₹{p.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-400 line-through">₹{p.mrp.toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                      🔥 3 offers available
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
