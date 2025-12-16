import React from 'react';

interface OrderConfirmationPageProps {
  orderId: string;
  orderType: 'pickup' | 'delivery';
  onFindStore: () => void;
  onTrackOrder: () => void;
  onHome: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, orderType, onFindStore, onTrackOrder, onHome }) => {
  
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
            
            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 mb-6">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">Your Order Number</p>
                <p className="text-4xl font-mono font-bold text-[#0052FF] tracking-wider mb-3">{orderId}</p>
                <p className="text-xs text-gray-500">
                    A confirmation email with this number has been sent to the email address used during checkout.
                </p>
            </div>

            {orderType === 'delivery' && (
                <div className="mb-8">
                     <button 
                        onClick={onTrackOrder}
                        className="text-[#0052FF] hover:text-[#002D7A] underline font-medium flex items-center justify-center mx-auto transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Track your order
                    </button>
                </div>
            )}

            {orderType === 'pickup' ? (
                <div className="mb-8">
                    <p className="text-gray-700 mb-4">
                        Please present this number at the store counter to collect your items.
                    </p>
                    <button 
                        onClick={onFindStore}
                        className="text-[#0052FF] hover:text-[#002D7A] underline font-medium text-sm"
                    >
                        View Store Location Again
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