import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Models API
export const modelsApi = {
  getAll: () => api.get('/models'),
  getOne: (id) => api.get(`/models/${id}`),
  create: (data) => api.post('/models', data),
  update: (id, data) => api.patch(`/models/${id}`, data),
  delete: (id) => api.delete(`/models/${id}`),
};

// Plugins API
export const pluginsApi = {
  getAll: () => api.get('/plugins'),
  getOne: (id) => api.get(`/plugins/${id}`),
  create: (data) => api.post('/plugins', data),
  update: (id, data) => api.patch(`/plugins/${id}`, data),
  delete: (id) => api.delete(`/plugins/${id}`),
};

// Conversations API
export const conversationsApi = {
  getAll: () => api.get('/conversations'),
  getOne: (id) => api.get(`/conversations/${id}`),
  create: (data) => api.post('/conversations', data),
  update: (id, data) => api.patch(`/conversations/${id}`, data),
  delete: (id) => api.delete(`/conversations/${id}`),
};

// Messages API
export const messagesApi = {
  getByConversation: (conversationId) => api.get(`/messages/conversation/${conversationId}`),
  create: (data) => api.post('/messages', data),
  delete: (id) => api.delete(`/messages/${id}`),
};

// Chat API (Legacy)
export const chatApi = {
  sendMessage: async (message, modelId, pluginIds) => {
    try {
      // First try to use the new conversation/message endpoints
      try {
        // Create a conversation if sending a new message
        const conversationResponse = await conversationsApi.create({
          modelId,
          pluginIds,
          title: message.substring(0, 30) + (message.length > 30 ? '...' : '')
        });
        
        const conversationId = conversationResponse.data._id;
        
        // Send the message in the new conversation
        const messageResponse = await messagesApi.create({
          conversationId,
          content: message,
          role: 'user'
        });
        
        // Return the assistant's response
        return messageResponse.data.assistantMessage;
      } catch (newApiError) {
        console.warn('Failed to use new API endpoints, falling back to legacy endpoint', newApiError);
        
        // Fall back to the legacy endpoint if the new ones fail
        const response = await api.post('/chat', {
          modelId,
          pluginIds,
          message
        });
        
        return {
          id: response.data.id,
          role: 'assistant',
          content: response.data.message,
          timestamp: response.data.timestamp || new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
}; 