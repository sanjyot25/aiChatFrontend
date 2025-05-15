import React, { useState, useRef, useEffect } from 'react';

export const ModelSelector = ({
  models,
  selectedModel,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropDirection, setDropDirection] = useState('down');

  // Calculate if dropdown should appear upwards or downwards
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const requiredHeight = Math.min(models.length * 60, 300); // Approximate dropdown height
      
      if (spaceBelow < requiredHeight && buttonRect.top > requiredHeight) {
        setDropDirection('up');
      } else {
        setDropDirection('down');
      }
    }
  }, [isOpen, models.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        title="Select Model"
      >
        <div className="flex items-center">
          {selectedModel?.icon ? (
            <img src={selectedModel.icon} alt="" className="w-6 h-6 rounded-full mr-2" />
          ) : (
            <div className="w-6 h-6 bg-purple-600 rounded-full mr-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            </div>
          )}
          <span className="font-medium">{selectedModel?.name || 'Select Model'}</span>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className={`absolute left-0 w-60 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700 max-h-60 overflow-y-auto ${
            dropDirection === 'up' 
              ? 'bottom-full mb-2' 
              : 'top-full mt-2'
          }`}
        >
          <div className="py-1">
            {models.map((model) => (
              <button
                key={model._id}
                onClick={() => {
                  onSelect(model);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center ${
                  selectedModel?._id === model._id ? 'bg-gray-700' : ''
                }`}
              >
                {model.icon ? (
                  <img src={model.icon} alt="" className="w-5 h-5 rounded-full mr-2" />
                ) : (
                  <div className="w-5 h-5 bg-purple-600 rounded-full mr-2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                  </div>
                )}
                <div>
                  <div className="font-medium">{model.name}</div>
                  {model.description && (
                    <div className="text-xs text-gray-400">{model.description}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 