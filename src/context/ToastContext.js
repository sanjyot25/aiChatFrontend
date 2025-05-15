import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/Toast';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback(id => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Convenience methods for different toast types
  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}; 