import React, { useState, useEffect } from 'react';
import { pluginsApi } from '../../services/api';
import PluginForm from './PluginForm';
import { useToast } from '../../context/ToastContext';

const PluginsList = () => {
  const [plugins, setPlugins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlugin, setEditingPlugin] = useState(null);
  const toast = useToast();

  const fetchPlugins = async () => {
    setIsLoading(true);
    try {
      const response = await pluginsApi.getAll();
      setPlugins(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch plugins');
      toast.error('Failed to fetch plugins');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plugin?')) {
      try {
        await pluginsApi.delete(id);
        setPlugins(plugins.filter(plugin => plugin._id !== id));
        toast.success('Plugin deleted successfully');
      } catch (err) {
        setError('Failed to delete plugin');
        toast.error('Failed to delete plugin');
        console.error(err);
      }
    }
  };

  const handleEdit = (plugin) => {
    setEditingPlugin(plugin);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingPlugin(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPlugin) {
        // Update existing plugin
        const response = await pluginsApi.update(editingPlugin._id, formData);
        setPlugins(plugins.map(plugin => 
          plugin._id === editingPlugin._id ? response.data : plugin
        ));
        toast.success('Plugin updated successfully');
      } else {
        // Create new plugin
        const response = await pluginsApi.create(formData);
        setPlugins([...plugins, response.data]);
        toast.success('Plugin created successfully');
      }
      setShowForm(false);
      setEditingPlugin(null);
    } catch (err) {
      setError('Failed to save plugin');
      toast.error('Failed to save plugin');
      console.error(err);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPlugin(null);
  };

  const togglePluginStatus = async (plugin) => {
    try {
      const response = await pluginsApi.update(plugin._id, {
        enabled: !plugin.enabled
      });
      setPlugins(plugins.map(p => p._id === plugin._id ? response.data : p));
      toast.success(`Plugin ${response.data.enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (err) {
      setError('Failed to update plugin status');
      toast.error('Failed to update plugin status');
      console.error(err);
    }
  };

  if (isLoading && plugins.length === 0) {
    return <div className="text-center py-6">Loading plugins...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plugins</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Plugin
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm ? (
        <PluginForm
          plugin={editingPlugin}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plugins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No plugins found. Add a new plugin to get started.
                  </td>
                </tr>
              ) : (
                plugins.map((plugin) => (
                  <tr key={plugin._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{plugin.name}</td>
                    <td className="px-6 py-4">{plugin.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">v{plugin.version}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePluginStatus(plugin)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          plugin.enabled
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {plugin.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(plugin)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(plugin._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PluginsList; 