
import React, { useState, useEffect } from 'react';
import { Tag, Check, AlertCircle } from 'lucide-react';

export default function OfferCenter() {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/promotions')
      .then(res => res.json())
      .then(data => setPromotions(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Offer Center</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Explore all active promotions running on the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{promo.title}</h3>
            </div>
            
            <p className="text-gray-600 text-sm mb-6 flex-grow">{promo.description}</p>
            
            <div className="bg-gray-50 p-4 rounded-2xl space-y-2 mt-auto">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Type</span>
                    <span className="font-bold text-gray-900">{promo.type}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Stackable</span>
                    {promo.stackable ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-orange-500" />}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
