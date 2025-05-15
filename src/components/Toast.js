import React, { useEffect, useState } from 'react';

// Individual toast item
const ToastItem = ({ id, message, type, onClose, duration = 3000 }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      const closeTimer = setTimeout(() => {
        onClose(id);
      }, 300); // Match the CSS transition time
      return () => clearTimeout(closeTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-700';
      case 'error':
        return 'bg-red-600 border-red-700';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      default:
        return 'bg-blue-600 border-blue-700';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
    }
  };

  return (
    <div 
      className={`flex items-center p-3 mb-3 rounded-md shadow-lg border-l-4 text-white transform transition-all duration-300 ${getTypeStyles()} ${
        isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className="flex-shrink-0 mr-2">
        {getIcon()}
      </div>
      <div className="flex-grow mr-2">
        {message}
      </div>
      <button 
        onClick={() => setIsClosing(true)} 
        className="flex-shrink-0 ml-auto p-1 rounded-full hover:bg-black hover:bg-opacity-10 focus:outline-none"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
};

// Toast container that manages all toast notifications
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export { ToastContainer }; 