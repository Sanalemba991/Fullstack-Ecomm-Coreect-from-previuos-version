import React from 'react';

export default function CheckoutSteps(props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
      <div className={`step flex-1 text-center py-3 px-4 rounded-full sm:py-2 sm:px-6 
        ${props.step1 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-yellow-700'} 
        transition-all duration-300 ease-in-out transform hover:scale-105`}>
        Sign-In
      </div>
      <div className={`step flex-1 text-center py-3 px-4 rounded-full sm:py-2 sm:px-6 
        ${props.step2 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-yellow-700'} 
        transition-all duration-300 ease-in-out transform hover:scale-105`}>
        Shipping
      </div>
      <div className={`step flex-1 text-center py-3 px-4 rounded-full sm:py-2 sm:px-6 
        ${props.step3 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-yellow-700'} 
        transition-all duration-300 ease-in-out transform hover:scale-105`}>
        Payment
      </div>
      <div className={`step flex-1 text-center py-3 px-4 rounded-full sm:py-2 sm:px-6 
        ${props.step4 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-yellow-700'} 
        transition-all duration-300 ease-in-out transform hover:scale-105`}>
        Place Order
      </div>
    </div>
  );
}
