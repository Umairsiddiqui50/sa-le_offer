
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, CreditCard, MapPin } from 'lucide-react';

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

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('IDLE');
  const [orderData, setOrderData] = useState(null);
  
  if (!state || !state.calculation) {
    return <div className="p-8 text-center text-gray-500">Invalid session. <button onClick={() => navigate('/')} className="text-blue-600 underline ml-2">Go Home</button></div>;
  }
  
  const { calculation, cartItem, couponCode } = state;

  const handlePlaceOrder = async () => {
    setStatus('PLACING');
    try {
      const res = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'TEST_USER_01',
          items: [{ product_id: cartItem.product_id || cartItem.id, quantity: 1 }],
          coupon_code: couponCode,
          bank_name: calculation.bank_name
        })
      });
      const data = await res.json();
      if(data.error) {
          alert(data.error);
          setStatus('IDLE');
          return;
      }
      setOrderData(data);
      setStatus('PAYMENT');
    } catch (e) {
      alert("Error placing order");
      setStatus('IDLE');
    }
  };

  const simulatePayment = async (success) => {
    setStatus('PROCESSING');
    try {
      const endpoint = success ? '/api/payment/simulate-success' : '/api/payment/simulate-failure';
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderData.order_id,
          coupon_code: couponCode,
          cart: calculation
        })
      });
      const data = await res.json();
      if(data.error) {
          alert(data.error);
          setStatus('FAILED');
          return;
      }
      setStatus(success ? 'SUCCESS' : 'FAILED');
    } catch (e) {
      setStatus('FAILED');
    }
  };

  if (status === 'SUCCESS') {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-white mt-12 rounded-xl shadow-sm border border-gray-200">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-8 font-mono">Order ID: {orderData.order_id}</p>
        
        <div className="bg-gray-50 p-6 rounded-lg text-left mb-8 space-y-4 max-w-md mx-auto border">
           <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Amount Paid:</span><span className="font-black text-xl">₹{calculation.final_payable.toLocaleString()}</span></div>
           <div className="flex justify-between"><span className="text-gray-600">Total Savings:</span><span className="font-bold text-green-600">₹{calculation.total_discount.toLocaleString()}</span></div>
           <div className="flex justify-between"><span className="text-gray-600">Payment Status:</span><span className="font-bold text-blue-600">Dummy Payment - SUCCESS</span></div>
        </div>
        
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-3 rounded shadow hover:bg-blue-700 font-bold">Continue Shopping</button>
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-white mt-12 rounded-xl shadow-sm border border-gray-200">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-8">Order was not confirmed. Coupon hold has been released.</p>
        <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-8 py-3 rounded font-bold shadow hover:bg-black">Return Home</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin size={20} className="text-blue-600"/> Delivery Address</h3>
                <div className="p-4 border rounded bg-blue-50/50 border-blue-200">
                   <p className="font-bold text-gray-900">John Doe <span className="bg-gray-200 text-xs px-2 py-1 rounded ml-2">HOME</span></p>
                   <p className="text-gray-600 text-sm mt-1">123, Tech Park, Electronic City, Bangalore, 560100</p>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><CreditCard size={20} className="text-blue-600"/> Payment Method</h3>
                <div className="space-y-3">
                   <label className="flex items-center gap-3 p-4 border rounded cursor-pointer border-blue-600 bg-blue-50">
                     <input type="radio" checked readOnly className="w-4 h-4 text-blue-600" />
                     <span className="font-medium text-gray-900">Credit / Debit Card (HDFC)</span>
                   </label>
                   <label className="flex items-center gap-3 p-4 border rounded cursor-not-allowed opacity-50">
                     <input type="radio" disabled className="w-4 h-4" />
                     <span className="font-medium text-gray-600">Cash on Delivery (Unavailable for this order)</span>
                   </label>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h3 className="font-bold text-lg mb-4">Order Items</h3>
               <div className="flex gap-4 items-center">
                 <img src={PRODUCT_IMAGES[cartItem.product_id] || PRODUCT_IMAGES[1]} className="w-16 h-16 object-contain" alt="product" />
                 <div>
                   <p className="font-semibold">{cartItem.name}</p>
                   <p className="text-sm text-gray-500">Qty: 1</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                <h3 className="font-bold text-gray-500 uppercase tracking-wide text-sm mb-4 border-b pb-4">Order Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>MRP</span>
                    <span>₹{calculation.gross_total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Total Discount</span>
                    <span>-₹{calculation.total_discount.toLocaleString()}</span>
                  </div>
                  <div className="border-b my-2"></div>
                  <div className="flex justify-between text-xl font-black text-gray-900">
                    <span>Payable</span>
                    <span>₹{calculation.final_payable.toLocaleString()}</span>
                  </div>
                </div>

                {status === 'IDLE' && (
                  <button onClick={handlePlaceOrder} className="w-full bg-orange-500 text-white font-bold text-lg py-4 rounded-lg shadow-md hover:bg-orange-600 mt-6">
                    PLACE ORDER
                  </button>
                )}

                {status === 'PAYMENT' && (
                  <div className="mt-6 border-t pt-6 text-center">
                    <p className="text-xs font-bold text-orange-500 tracking-wider mb-2 uppercase">Test / Demo Payment</p>
                    <p className="text-gray-500 text-sm mb-4">No real money will be charged.</p>
                    <div className="space-y-3">
                        <button onClick={() => simulatePayment(true)} className="w-full bg-green-600 text-white py-3 rounded font-bold shadow hover:bg-green-700">
                            Simulate SUCCESS
                        </button>
                        <button onClick={() => simulatePayment(false)} className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded font-bold hover:bg-red-100">
                            Simulate FAILURE
                        </button>
                    </div>
                  </div>
                )}

                {(status === 'PLACING' || status === 'PROCESSING') && (
                  <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                      <p className="text-gray-500 font-medium text-sm">Processing securely...</p>
                  </div>
                )}
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
