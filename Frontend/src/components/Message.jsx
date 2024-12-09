import React from 'react';

function Message({ variant = 'info', children }) {
  let variantStyles = '';
  switch (variant) {
    case 'success':
      variantStyles = 'bg-green-100 text-green-800 border border-green-300';
      break;
    case 'error':
      variantStyles = 'bg-red-100 text-red-800 border border-red-300';
      break;
    case 'warning':
      variantStyles = 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      break;
    case 'info':
    default:
      variantStyles = 'bg-blue-100 text-blue-800 border border-blue-300';
      break;
  }

  return (
    <div className={`p-4 rounded-lg ${variantStyles} shadow-md`}>
      {children}
    </div>
  );
}

export default Message;
