import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ShieldCheck, XCircle, CheckCircle, RotateCcw, PlusCircle } from 'lucide-react';

const PRODUCT_IMAGES = {
  1: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  2: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80",
  3: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
  4: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
  5: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80",
  6: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=500&q=80",
  7: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80",
  8: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80"
};

export default function CartPage({ cartItem }) {
  const navigate = useNavigate();
  const [calculation, setCalculation] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [disabledOffers, setDisabledOffers] = useState([]);

  const fetchCalculation = async (codeToApply = appliedCoupon, disabled = disabledOffers) => {
    if (!cartItem) return;
    try {
      const res = await fetch('http://localhost:8000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ product_id: cartItem.product_id || cartItem.id, quantity: 1 }],
          coupon_code: codeToApply,
          disabled_offers: disabled,
          user_id: 'TEST_USER_01',
          payment_method: 'HDFC_CREDIT',
          bank_name: 'HDFC'
        })
      });
      const data = await res.json();
      setCalculation(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCalculation(appliedCoupon, disabledOffers);
  }, [cartItem, disabledOffers]);

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    setAppliedCoupon(couponCode);
    fetchCalculation(couponCode, disabledOffers);
  };
  
  const handleRemoveOffer = (promoId) => {
    setDisabledOffers([...disabledOffers, promoId]);
  };
  
  const handleResetOffers = () => {
    setDisabledOffers([]);
  };

  if (!cartItem) return <div className="p-12 text-center text-xl text-gray-500">Your cart is empty.</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items & Offers */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Cart Item */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-6">
              <div className="w-32 h-32 bg-gray-50 rounded flex items-center justify-center flex-shrink-0">
                <img src={PRODUCT_IMAGES[cartItem.product_id] || PRODUCT_IMAGES[1]} alt={cartItem.name} className="h-24 w-24 object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 uppercase font-bold mb-1">{cartItem.brand}</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{cartItem.name}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl font-black text-gray-900">₹{cartItem.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-400 line-through">₹{cartItem.mrp.toLocaleString()}</span>
                  <span className="text-sm font-bold text-green-600">{Math.round(((cartItem.mrp - cartItem.price)/cartItem.mrp)*100)}% OFF</span>
                </div>
                <div className="flex gap-4 border-t pt-4">
                  <button className="text-gray-500 font-medium text-sm hover:text-red-500">REMOVE</button>
                  <button className="text-gray-500 font-medium text-sm hover:text-blue-500">SAVE FOR LATER</button>
                </div>
              </div>
            </div>

            {/* Offer Breakdown Panel */}
            {calculation && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-black text-lg flex items-center gap-2"><Tag size={20}/> Applicable Offers Breakdown</h3>
                   {disabledOffers.length > 0 && (
                     <button onClick={handleResetOffers} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                        <RotateCcw size={14}/> Restore Removed Offers
                     </button>
                   )}
                </div>
                
                <div className="mb-6">
                   <h4 className="text-sm font-bold text-green-700 mb-2 uppercase">Applied Offers ({calculation.applied_offers?.length})</h4>
                   <div className="space-y-3">
                     {calculation.applied_offers?.length === 0 && <p className="text-sm text-gray-500">No offers applied.</p>}
                     {calculation.applied_offers?.map((o, i) => (
                       <div key={i} className="flex justify-between items-center bg-green-50 p-3 rounded border border-green-100">
                         <div className="flex items-center gap-2">
                           <CheckCircle size={16} className="text-green-600" />
                           <span className="font-semibold text-green-900">{o.title}</span>
                         </div>
                         <div className="flex items-center gap-4">
                           <span className="font-bold text-green-700">-₹{o.discount.toLocaleString()}</span>
                           <button onClick={() => handleRemoveOffer(o.promotion_id)} className="text-green-600 hover:text-red-600 transition" title="Remove this offer">
                             <XCircle size={18}/>
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

                <div>
                   <h4 className="text-sm font-bold text-gray-600 mb-2 uppercase">Rejected Offers / Constraints</h4>
                   <div className="space-y-3">
                     {calculation.rejected_offers?.map((o, i) => (
                       <div key={i} className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-start">
                         <div>
                           <div className="flex items-center gap-2 mb-1">
                             <XCircle size={16} className="text-red-500" />
                             <span className="font-semibold text-gray-800">{o.title}</span>
                           </div>
                           <p className="text-xs text-red-600 ml-6">{o.reason}</p>
                         </div>
                         {o.promotion_id && (
                           <button onClick={() => {
                             if (disabledOffers.includes(o.promotion_id)) {
                               setDisabledOffers(disabledOffers.filter(id => id !== o.promotion_id));
                             } else {
                               alert(`System Restriction: ${o.reason}\n\nTo apply this offer, you may need to remove an active offer first using the (X) button.`);
                             }
                           }} className="text-blue-600 hover:text-green-600 transition" title="Force apply this offer">
                             <PlusCircle size={20}/>
                           </button>
                         )}
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Price Details */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              
              <h3 className="font-bold text-gray-500 uppercase tracking-wide text-sm mb-4 border-b pb-4">Price Details</h3>
              
              {!calculation ? (
                 <p className="text-sm text-gray-500">Calculating...</p>
              ) : (
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total MRP</span>
                    <span>₹{calculation.gross_total.toLocaleString()}</span>
                  </div>
                  
                  {calculation.applied_offers?.map((o, i) => (
                    <div key={i} className="flex justify-between text-green-600">
                      <span>{o.title}</span>
                      <span>-₹{o.discount.toLocaleString()}</span>
                    </div>
                  ))}
                  
                  <div className="border-b border-dashed my-2"></div>
                  
                  <div className="flex justify-between text-lg font-black text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{calculation.final_payable.toLocaleString()}</span>
                  </div>
                  
                  <div className="text-xs text-green-700 font-bold bg-green-50 p-2 rounded">
                    You will save ₹{calculation.total_discount.toLocaleString()} on this order
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        placeholder="Enter Coupon Code" 
                        className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 uppercase"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                      />
                      <button onClick={handleApplyCoupon} className="bg-gray-900 text-white px-4 py-2 rounded text-sm font-bold">APPLY</button>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/checkout', { state: { calculation, cartItem, couponCode: appliedCoupon } })}
                    className="w-full bg-orange-500 text-white font-black text-lg py-4 rounded-lg shadow-md hover:bg-orange-600 mt-4"
                  >
                    PROCEED TO CHECKOUT
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500 font-medium">
                    <ShieldCheck size={16} /> Safe and Secure Payments
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
