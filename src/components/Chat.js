import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { chatApi } from '../services/api';

const Chat = forwardRef(({ selectedModel, selectedPlugins, onMessagesUpdate }, ref) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contentHeight, setContentHeight] = useState('auto');
  const messagesEndRef = useRef(null);
  const contentRef = useRef(null);

  // Preserve content height during loading to prevent layout shifts
  useEffect(() => {
    if (contentRef.current && !isLoading) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, [messages, isLoading]);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    // Use instant scroll on first load, smooth scroll for new messages
    scrollToBottom(messages.length <= 1 ? 'auto' : 'smooth');
  }, [messages]);

  // Notify parent component when messages change
  useEffect(() => {
    if (onMessagesUpdate) {
      onMessagesUpdate(messages);
    }
  }, [messages, onMessagesUpdate]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(
        text,
        selectedModel._id,
        selectedPlugins.map(p => p._id)
      );
      
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, there was an error processing your message. Please try again later.',
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    sendMessage,
    clearMessages: () => setMessages([]),
    scrollToBottom
  }));

  return (
    <div className="flex flex-col h-full bg-[#131B2E]">
      <div 
        className="overflow-y-auto p-4 space-y-6" 
        ref={contentRef}
        style={{ minHeight: messages.length ? contentHeight : 'auto' }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full py-10 opacity-100 transition-opacity duration-300">
            <div className="text-gray-400 text-center">
              <p className="text-sm">Start a conversation with {selectedModel.name}</p>
              {selectedPlugins.length > 0 ? (
                <div className="mt-1">
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {selectedPlugins.map(plugin => (
                      <span 
                        key={plugin._id} 
                        className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {plugin.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className="flex items-start animate-fadeIn"
            >
              {message.role !== 'user' && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                  <div className="text-xs font-bold text-white">
                    {selectedModel?.name?.charAt(0) || 'A'}
                  </div>
                </div>
              )}
              <div className={`flex flex-col ${message.role === 'user' ? 'items-end ml-auto' : 'items-start'}`}>
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium text-gray-400">
                    {message.role === 'user' ? 'You' : selectedModel?.name || 'Assistant'}
                  </span>
                </div>
                <div 
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-[#2563EB] text-white self-end' 
                      : 'bg-[#1E293B] text-gray-100'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatTime(message.timestamp)}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center ml-2">
                  <div className="text-xs font-bold text-white">
                    Y
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="flex items-start animate-fadeIn">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-2">
              <div className="text-xs font-bold text-white">
                {selectedModel?.name?.charAt(0) || 'A'}
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-1">
                <span className="text-xs font-medium text-gray-400">
                  {selectedModel?.name || 'Assistant'}
                </span>
              </div>
              <div className="bg-[#1E293B] text-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export { Chat }; 