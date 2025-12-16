import React from 'react';

interface TrackingPageProps {
  orderId: string;
  onHome: () => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({ orderId, onHome }) => {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tracking Order #{orderId}</h2>
        
        <div className="space-y-8">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    In Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    50%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div style={{ width: "50%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white ring-2 ring-green-500"></div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Order Placed</p>
                        <p className="text-xs text-gray-500">Your order has been received.</p>
                    </div>
                </div>
                 <div className="flex items-center">
                    <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-500 animate-pulse"></div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Processing</p>
                        <p className="text-xs text-gray-500">We are packing your items.</p>
                    </div>
                </div>
                 <div className="flex items-center opacity-50">
                    <div className="flex-shrink-0 h-4 w-4 rounded-full bg-gray-300 border-2 border-white"></div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Out for Delivery</p>
                        <p className="text-xs text-gray-500">Rider is on the way.</p>
                    </div>
                </div>
                 <div className="flex items-center opacity-50">
                    <div className="flex-shrink-0 h-4 w-4 rounded-full bg-gray-300 border-2 border-white"></div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Delivered</p>
                        <p className="text-xs text-gray-500">Package delivered successfully.</p>
                    </div>
                </div>
            </div>
        </div>

        <button 
            onClick={onHome}
            className="w-full mt-8 bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
            Back to Home
        </button>
      </div>
    </div>
  );
};