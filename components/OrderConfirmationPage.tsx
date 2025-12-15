import React from 'react';

interface OrderConfirmationPageProps {
  orderId: string;
  orderType: 'pickup' | 'delivery';
  onFindStore: () => void;
  onHome: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, orderType, onFindStore, onHome }) => {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl text-center max-w-lg w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 mb-8">Thank you for shopping with Bokku.</p>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 mb-8">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">Your Order Number</p>
                <p className="text-4xl font-mono font-bold text-[#0052FF] tracking-wider">{orderId}</p>
            </div>

            {orderType === 'pickup' ? (
                <div className="mb-8">
                    <p className="text-gray-700 mb-4">
                        Please present this number at the store counter to collect your items.
                    </p>
                    <button 
                        onClick={onFindStore}
                        className="w-full bg-[#0052FF] text-white py-3 rounded-lg font-semibold hover:bg-[#002D7A] transition-colors flex items-center justify-center"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Find a Store
                    </button>
                </div>
            ) : (
                <div className="mb-8">
                    <p className="text-gray-700">
                        Your items are on their way! You will receive a dispatch notification shortly.
                    </p>
                </div>
            )}

            <button 
                onClick={onHome}
                className="text-gray-500 hover:text-gray-700 font-medium"
            >
                Back to Home
            </button>
        </div>
    </div>
  );
};