import React, { useState, useRef, useEffect } from 'react';

export const PluginSelector = ({
  plugins,
  selectedPlugins,
  onToggle,
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
      const requiredHeight = Math.min(plugins.length * 70 + 50, 350); // Approximate dropdown height
      
      if (spaceBelow < requiredHeight && buttonRect.top > requiredHeight) {
        setDropDirection('up');
      } else {
        setDropDirection('down');
      }
    }
  }, [isOpen, plugins.length]);

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

  const activePluginsCount = selectedPlugins.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        title="Plugins"
      >
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-600 rounded-full mr-2 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-medium">Plugins</span>
          {activePluginsCount > 0 && (
            <span className="ml-2 bg-blue-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full font-medium">
              {activePluginsCount}
            </span>
          )}
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
          className={`absolute ${dropDirection === 'up' 
            ? 'bottom-full right-0 mb-2' 
            : 'top-full right-0 mt-2'} 
            w-72 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700`}
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-300">Available Plugins</h3>
              <span className="text-xs text-gray-400">{selectedPlugins.length} active</span>
            </div>
            <div className="mt-2 max-h-60 overflow-y-auto">
              {plugins.length === 0 ? (
                <div className="text-sm text-gray-400 p-2">No plugins available</div>
              ) : (
                plugins.map((plugin) => {
                  const isSelected = selectedPlugins.some(p => p._id === plugin._id);
                  
                  return (
                    <div
                      key={plugin._id}
                      className="flex items-center justify-between p-2 hover:bg-gray-700 rounded mb-1"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{plugin.name}</div>
                        {plugin.description && (
                          <div className="text-xs text-gray-400">{plugin.description}</div>
                        )}
                      </div>
                      <div>
                        <button
                          onClick={() => onToggle(plugin)}
                          disabled={!plugin.enabled}
                          className={`w-10 h-5 rounded-full ${
                            isSelected ? 'bg-blue-500' : 'bg-gray-600'
                          } transition-colors relative ${!plugin.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transform transition-transform ${
                              isSelected ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 