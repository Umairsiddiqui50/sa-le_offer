
import React, { useState, useEffect } from 'react';
import { Calculator, AlertTriangle, CheckCircle, XCircle, Settings2, IndianRupee } from 'lucide-react';

export default function AdminDashboard() {
  const [testResult, setTestResult] = useState(null);
  
  // Custom Simulator State
  const [customPrice, setCustomPrice] = useState(20000);
  const [floorPrice, setFloorPrice] = useState(15000);
  const [customBrand, setCustomBrand] = useState('NIKE');
  const [customCategory, setCustomCategory] = useState('ELECTRONICS');
  const [couponCode, setCouponCode] = useState('123456');
  
  const [promotions, setPromotions] = useState([]);
  const [activeOffers, setActiveOffers] = useState([]); // Array of checked promotion_ids

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/promotions')
      .then(res => res.json())
      .then(data => {
        setPromotions(data);
        // By default, enable all active promotions in the simulator
        setActiveOffers(data.map(p => p.promotion_id));
      });
  }, []);

  const toggleOffer = (promoId) => {
    if (activeOffers.includes(promoId)) {
      setActiveOffers(activeOffers.filter(id => id !== promoId));
    } else {
      setActiveOffers([...activeOffers, promoId]);
    }
  };

  const runTest = async () => {
    // Calculate disabled offers
    const disabled = promotions.map(p => p.promotion_id).filter(id => !activeOffers.includes(id));
    
    const payload = {
      items: [{ 
        is_custom: true, 
        price: Number(customPrice), 
        floor_price: Number(floorPrice), 
        brand: customBrand,
        category: customCategory,
        quantity: 1 
      }],
      coupon_code: couponCode,
      user_id: "admin_simulator",
      payment_method: "HDFC_CREDIT",
      disabled_offers: disabled
    };
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/offer-engine/test', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setTestResult(data);
    } catch (e) {
      console.error(e);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
         <Settings2 className="w-8 h-8 text-blue-600" />
         <h1 className="text-3xl font-black text-gray-900">Admin Offer Simulator</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Simulator Controls */}
         <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Product Simulation</h3>
            
            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-bold text-gray-600 mb-1">Selling Price (MRP)</label>
                 <div className="relative">
                   <IndianRupee size={16} className="absolute left-3 top-3 text-gray-400" />
                   <input type="number" value={customPrice} onChange={e => setCustomPrice(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:border-blue-500 font-mono" />
                 </div>
               </div>
               
               <div>
                 <label className="block text-sm font-bold text-gray-600 mb-1">Floor Price (Minimum Margin)</label>
                 <div className="relative">
                   <IndianRupee size={16} className="absolute left-3 top-3 text-gray-400" />
                   <input type="number" value={floorPrice} onChange={e => setFloorPrice(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:border-blue-500 font-mono text-red-600" />
                 </div>
               </div>
               
               <div className="grid grid-cols-3 gap-2">
                 <div>
                   <label className="block text-sm font-bold text-gray-600 mb-1">Brand</label>
                   <input type="text" value={customBrand} onChange={e => setCustomBrand(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 uppercase" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-600 mb-1">Category</label>
                   <input type="text" value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 uppercase" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-600 mb-1">Coupon</label>
                   <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 uppercase" />
                 </div>
               </div>
            </div>

            <h3 className="font-bold text-lg mt-8 mb-4 text-gray-800 border-b pb-2">Toggle Active Offers</h3>
            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto pr-2">
               {promotions.map(promo => (
                 <label key={promo.promotion_id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200">
                   <input 
                     type="checkbox" 
                     className="w-4 h-4 text-blue-600" 
                     checked={activeOffers.includes(promo.promotion_id)}
                     onChange={() => toggleOffer(promo.promotion_id)}
                   />
                   <div className="flex-1">
                     <p className="text-sm font-bold text-gray-800">{promo.title}</p>
                     <p className="text-xs text-gray-500">{promo.type} {promo.stackable ? '(Stackable)' : '(Non-Stackable)'}</p>
                   </div>
                 </label>
               ))}
            </div>
            
            <button onClick={runTest} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 font-black text-lg transition">
              <Calculator size={20}/>
              Run Simulation
            </button>
         </div>
         
         {/* Results */}
         <div className="lg:col-span-2">
            {!testResult ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
                 <Calculator size={48} className="mb-4 opacity-50" />
                 <p>Enter values and Run Simulation to see results</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="font-bold text-lg mb-4 text-green-700 uppercase">Applied Offers</h3>
                  
                  {testResult.applied_offers?.length === 0 && <p className="text-gray-500 text-sm">No offers applied.</p>}
                  
                  <div className="space-y-2">
                    {testResult.applied_offers?.map((o, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b">
                        <span className="font-semibold text-gray-800"><CheckCircle size={16} className="inline mr-2 text-green-500"/>{o.title}</span>
                        <span className="text-green-600 font-black">-₹{o.discount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="font-bold text-lg mt-8 mb-4 text-red-700 uppercase">Rejected Offers</h3>
                  
                  {testResult.rejected_offers?.length === 0 && <p className="text-gray-500 text-sm">No offers rejected.</p>}
                  
                  <div className="space-y-3">
                    {testResult.rejected_offers?.map((o, i) => (
                      <div key={i} className="py-2 border-b bg-red-50/50 p-2 rounded">
                        <p className="font-semibold text-gray-800"><XCircle size={16} className="inline mr-2 text-red-500"/>{o.title}</p>
                        <p className="text-xs text-red-600 ml-6">{o.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Calculator size={100} />
                  </div>
                  
                  <h3 className="font-black text-xl mb-6 text-slate-300 uppercase tracking-wider">Calculation Breakdown</h3>
                  
                  <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Gross Total</span>
                      <span>₹{testResult.gross_total.toLocaleString()}</span>
                    </div>
                    
                    {testResult.applied_offers?.map((o, i) => (
                      <div key={i} className="flex justify-between text-green-400">
                        <span>{o.title}</span>
                        <span>-₹{o.discount.toLocaleString()}</span>
                      </div>
                    ))}
                    
                    <div className="border-b border-slate-700 pb-2"></div>
                    
                    <div className="flex justify-between text-2xl font-black text-white pt-2">
                      <span>Final Payable</span>
                      <span>₹{testResult.final_payable.toLocaleString()}</span>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-700 bg-slate-800/50 p-4 rounded-lg">
                      <p className="font-black text-slate-300 mb-4 uppercase text-xs tracking-wider">Margin Safety & Diagnostics</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Target Floor Price:</span>
                          <span className="font-bold text-red-400">₹{testResult.floor_price_total.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Margin:</span>
                          <span className={`font-bold ${testResult.admin_diagnostics?.margin > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ₹{testResult.admin_diagnostics?.margin.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {testResult.admin_diagnostics?.floor_enforced ? (
                        <div className="mt-4 bg-red-900/40 text-red-300 p-3 rounded text-xs font-bold border border-red-800 flex items-start gap-2">
                          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0"/> 
                          <p>Warning: Discount rules exceeded the floor price! Proration engine automatically stepped in and reduced the discounts to save the margin.</p>
                        </div>
                      ) : (
                        <div className="mt-4 bg-green-900/40 text-green-300 p-3 rounded text-xs font-bold border border-green-800 flex items-center gap-2">
                          <CheckCircle size={16}/> Margin is safe! Floor price wasn't hit.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
