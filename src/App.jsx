import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ChatPage from './pages/ChatPage';
import ModelsList from './pages/models/ModelsList';
import PluginsList from './pages/plugins/PluginsList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/models" element={<ModelsList />} />
            <Route path="/plugins" element={<PluginsList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 