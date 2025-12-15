import React, { useState } from 'react';

interface CheckoutPageProps {
  total: number;
  onPaymentSuccess: (type: 'pickup' | 'delivery') => void;
  onBack: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ total, onPaymentSuccess, onBack }) => {
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess(deliveryType);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button onClick={onBack} className="text-[#0052FF] mb-6 flex items-center hover:underline">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Cart
      </button>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Delivery Option</h3>
            <div className="flex space-x-4">
              <label className={`flex-1 border p-4 rounded-lg cursor-pointer transition-colors ${deliveryType === 'pickup' ? 'border-[#0052FF] bg-blue-50' : 'border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="deliveryType" 
                  value="pickup" 
                  checked={deliveryType === 'pickup'}
                  onChange={() => setDeliveryType('pickup')}
                  className="sr-only"
                />
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0052FF] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-semibold text-gray-800">Pick up at Store</span>
                </div>
              </label>

              <label className={`flex-1 border p-4 rounded-lg cursor-pointer transition-colors ${deliveryType === 'delivery' ? 'border-[#0052FF] bg-blue-50' : 'border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="deliveryType" 
                  value="delivery" 
                  checked={deliveryType === 'delivery'}
                  onChange={() => setDeliveryType('delivery')}
                  className="sr-only"
                />
                 <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0052FF] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <span className="font-semibold text-gray-800">Home Delivery</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-gray-700">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
               <input type="text" placeholder="First Name" required className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0052FF]" />
               <input type="text" placeholder="Last Name" required className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0052FF]" />
            </div>
            <input type="email" placeholder="Email Address" required className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0052FF]" />
            {deliveryType === 'delivery' && (
                <input type="text" placeholder="Delivery Address" required className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0052FF]" />
            )}
             <input type="text" placeholder="Card Number (Mock)" disabled className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed" value="**** **** **** 1234" />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold mb-6">
                <span>Total to Pay</span>
                <span>₦{total.toLocaleString()}</span>
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#0052FF] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#002D7A] transition-colors disabled:bg-blue-300"
            >
                {loading ? 'Processing Payment...' : `Pay ₦${total.toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};