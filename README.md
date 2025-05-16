### Frontend Setup

1. Navigate to the frontend directory
   ```
   cd frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the frontend
   ```
   npm start
   ```

4. Open http://localhost:3000 in your browser

## API Endpoints

### Models

- GET `/api/models` - Get all models
- GET `/api/models/:id` - Get a single model
- POST `/api/models` - Create a new model
- PATCH `/api/models/:id` - Update a model
- DELETE `/api/models/:id` - Delete a model

### Plugins

- GET `/api/plugins` - Get all plugins
- GET `/api/plugins/:id` - Get a single plugin
- POST `/api/plugins` - Create a new plugin
- PATCH `/api/plugins/:id` - Update a plugin
- DELETE `/api/plugins/:id` - Delete a plugin

### Conversations

- GET `/api/conversations` - Get all conversations
- GET `/api/conversations/:id` - Get a single conversation with its messages
- POST `/api/conversations` - Create a new conversation
- PATCH `/api/conversations/:id` - Update a conversation
- DELETE `/api/conversations/:id` - Delete a conversation and its messages

### Messages

- GET `/api/messages/conversation/:conversationId` - Get all messages for a conversation
- POST `/api/messages` - Create a new message (with automatic AI response if user message)
- DELETE `/api/messages/:id` - Delete a message

### Chat (Legacy)

- POST `/api/chat` - Send a message and receive a response

## Technologies Used

### Backend
- Express.js
- MongoDB with Mongoose
- Node.js

### Frontend
- React
- React Router
- Axios
- TailwindCSS 