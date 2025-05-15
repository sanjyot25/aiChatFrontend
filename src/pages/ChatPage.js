import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '../components/Chat';
import { ModelSelector } from '../components/ModelSelector';
import { PluginSelector } from '../components/PluginSelector';
import { modelsApi, pluginsApi } from '../services/api';

const ChatPage = () => {
  const [models, setModels] = useState([]);
  const [plugins, setPlugins] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedPlugins, setSelectedPlugins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelsResponse, pluginsResponse] = await Promise.all([
          modelsApi.getAll(),
          pluginsApi.getAll(),
        ]);

        setModels(modelsResponse.data);
        setPlugins(pluginsResponse.data);
        
        // Set default model if available
        if (modelsResponse.data.length > 0) {
          setSelectedModel(modelsResponse.data[0]);
        }
        
        setIsLoading(false);
        // Set initialized after initial data fetch and rendering
        setTimeout(() => setInitialized(true), 100);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handlePluginToggle = (plugin) => {
    if (!plugin.enabled) return;

    setSelectedPlugins((prev) =>
      prev.some((p) => p._id === plugin._id)
        ? prev.filter((p) => p._id !== plugin._id)
        : [...prev, plugin]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Use the sendMessage function from the Chat component
    if (chatRef.current) {
      chatRef.current.sendMessage(input);
      setInput(''); // Clear input after sending
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    
    // If we're maximizing the chat, focus the input field after state update
    if (isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Function to receive messages from Chat component
  const handleMessagesUpdate = (updatedMessages) => {
    setMessages(updatedMessages);
  };

  // Determine if the conversation is active (has messages)
  const hasActiveConversation = messages.length > 0;

  // Determine the height based on conversation state and minimized state
  const getHeight = () => {
    if (isMinimized) return 'h-12';
    if (hasActiveConversation) return 'h-[calc(100vh-40px)]';
    return 'h-[220px]';
  };

  // Base container class to maintain consistent size during loading
  const containerClass = `fixed bottom-5 left-1/2 transform -translate-x-1/2 w-[95%] max-w-4xl ${getHeight()} bg-[#111827] text-white border border-gray-800 shadow-2xl z-40 rounded-lg overflow-hidden`;

  // Add transition only after initial load to prevent flickering
  const transitionClass = initialized ? 'transition-all duration-300' : '';

  if (isLoading) {
    return (
      <div className={`${containerClass} ${transitionClass}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerClass} ${transitionClass}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-xl text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClass} ${transitionClass}`}>
      {/* Header with model selector and plugin selector */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-[#0F172A] shadow-sm">
        <div className="flex items-center">
          {isMinimized ? (
            <div className="flex items-center">
              <div className="w-7 h-7 bg-purple-600 rounded-full mr-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
              </div>
              <div className="text-sm font-medium">
                {selectedModel?.name || 'AI Chat'}
              </div>
              {messages.length > 0 && (
                <div className="text-xs text-gray-400 ml-2">
                  {messages.length} messages
                </div>
              )}
            </div>
          ) : (
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onSelect={handleModelSelect}
            />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {!isMinimized && (
            <>
              <PluginSelector
                plugins={plugins}
                selectedPlugins={selectedPlugins}
                onToggle={handlePluginToggle}
              />
              
              <button
                onClick={toggleMinimize}
                className="p-1.5 rounded-md hover:bg-gray-700 hover:bg-opacity-80 transition-colors duration-200 focus:outline-none flex items-center justify-center"
                title="Minimize"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                </svg>
              </button>
            </>
          )}
          {isMinimized && (
            <button
              onClick={toggleMinimize}
              className="p-1.5 rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none flex items-center justify-center"
              title="Maximize"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Rest of the chat UI, shown only when not minimized */}
      {!isMinimized && (
        <>
          {/* Chat area with stable height to prevent layout shift */}
          <div 
            className="flex-1 overflow-auto bg-[#131B2E]" 
            style={{ 
              height: hasActiveConversation 
                ? 'calc(100vh - 150px)' 
                : 'calc(220px - 110px)',
              transition: initialized ? 'height 0.3s ease' : 'none'
            }}
          >
            {selectedModel ? (
              <Chat
                selectedModel={selectedModel}
                selectedPlugins={selectedPlugins}
                ref={chatRef}
                onMessagesUpdate={handleMessagesUpdate}
              />
            ) : (
              <div className="p-8 text-center text-gray-400">
                Please select a model to start chatting
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="border-t border-gray-800 p-2.5 bg-[#0F172A]">
            <form onSubmit={handleSubmit} className="rounded-lg flex items-center">
              <div className="flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message... (Press '/' to focus)"
                  className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500 p-2"
                  ref={inputRef}
                />
              </div>
              <div className="flex items-center">
                <button 
                  type="button" 
                  className="p-2 rounded-md hover:bg-gray-700/40 focus:outline-none transition-colors duration-200"
                  title="Attach file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  className="p-2 rounded-md hover:bg-gray-700/40 focus:outline-none transition-colors duration-200"
                  title="Voice input"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <button 
                  type="submit" 
                  className="p-2 ml-1 rounded-md hover:bg-gray-700/40 focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!input.trim()}
                  title="Send message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage; 