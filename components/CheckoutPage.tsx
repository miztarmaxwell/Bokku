import React, { useState } from 'react';

interface CheckoutPageProps {
  total: number;
  onPaymentSuccess: (type: 'pickup' | 'delivery') => void;
  onBack: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ total, onPaymentSuccess, onBack }) => {
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
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
          {/* Delivery Section */}
          <div className="mb-8">
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

          {/* Contact Section */}
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-gray-700">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
               <input type="text" placeholder="First Name" required className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-shadow" />
               <input type="text" placeholder="Last Name" required className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-shadow" />
            </div>
            <input type="email" placeholder="Email Address" required className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-shadow" />
            {deliveryType === 'delivery' && (
                <input type="text" placeholder="Delivery Address" required className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-shadow" />
            )}
          </div>

          {/* Payment Method Section */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-700 mb-3">Payment Method</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Card Button */}
                <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 border rounded-lg flex flex-col items-center justify-center transition-colors ${paymentMethod === 'card' ? 'border-[#0052FF] bg-blue-50 text-[#0052FF]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-sm font-medium">Card</span>
                </button>

                {/* Transfer Button */}
                <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-3 border rounded-lg flex flex-col items-center justify-center transition-colors ${paymentMethod === 'transfer' ? 'border-[#0052FF] bg-blue-50 text-[#0052FF]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-sm font-medium">Transfer</span>
                </button>

                 {/* USSD Button */}
                 <button
                    type="button"
                    onClick={() => setPaymentMethod('ussd')}
                    className={`p-3 border rounded-lg flex flex-col items-center justify-center transition-colors ${paymentMethod === 'ussd' ? 'border-[#0052FF] bg-blue-50 text-[#0052FF]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">USSD</span>
                </button>
            </div>

            {/* Payment Details Area */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                {paymentMethod === 'card' && (
                    <div className="space-y-3">
                         <input type="text" placeholder="Card Number" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0052FF] bg-white transition-shadow" />
                         <div className="grid grid-cols-2 gap-3">
                             <input type="text" placeholder="MM/YY" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0052FF] bg-white transition-shadow" />
                             <input type="text" placeholder="CVC" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0052FF] bg-white transition-shadow" />
                         </div>
                    </div>
                )}
                {paymentMethod === 'transfer' && (
                    <div className="text-sm text-gray-700">
                        <p className="mb-2">Transfer <strong>₦{total.toLocaleString()}</strong> to:</p>
                        <div className="bg-white p-4 rounded border border-gray-200 mb-2">
                            <p className="font-bold text-gray-800">Bokku Global Ltd</p>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-xl font-mono tracking-wider text-[#0052FF]">0123456789</p>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">COPY</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">GTBank</p>
                        </div>
                        <p className="text-xs text-gray-500">Click "I have sent the money" below after transfer.</p>
                    </div>
                )}
                {paymentMethod === 'ussd' && (
                    <div className="text-center py-2">
                         <p className="mb-3 text-sm text-gray-700">Dial the code below on your mobile phone to pay:</p>
                         <div className="bg-white px-6 py-3 rounded border border-gray-200 inline-block mb-2 shadow-sm">
                             <p className="text-xl font-bold text-[#0052FF] tracking-wider font-mono">*737*000*892#</p>
                         </div>
                         <p className="text-xs text-gray-400 mt-2">Use the phone number registered with your bank.</p>
                    </div>
                )}
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center text-xl font-bold mb-6">
                <span>Total to Pay</span>
                <span className="text-[#0052FF]">₦{total.toLocaleString()}</span>
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#0052FF] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#002D7A] transition-colors disabled:bg-blue-300 flex justify-center items-center"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    paymentMethod === 'transfer' ? 'I have sent the money' : `Pay ₦${total.toLocaleString()}`
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};