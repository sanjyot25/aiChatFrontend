import React, { useState, useEffect } from 'react';
import { modelsApi } from '../../services/api';
import ModelForm from './ModelForm';
import { useToast } from '../../context/ToastContext';

const ModelsList = () => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const toast = useToast();

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const response = await modelsApi.getAll();
      setModels(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch models');
      toast.error('Failed to fetch models');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        await modelsApi.delete(id);
        setModels(models.filter(model => model._id !== id));
        toast.success('Model deleted successfully');
      } catch (err) {
        setError('Failed to delete model');
        toast.error('Failed to delete model');
        console.error(err);
      }
    }
  };

  const handleEdit = (model) => {
    setEditingModel(model);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingModel(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingModel) {
        // Update existing model
        const response = await modelsApi.update(editingModel._id, formData);
        setModels(models.map(model => 
          model._id === editingModel._id ? response.data : model
        ));
        toast.success('Model updated successfully');
      } else {
        // Create new model
        const response = await modelsApi.create(formData);
        setModels([...models, response.data]);
        toast.success('Model created successfully');
      }
      setShowForm(false);
      setEditingModel(null);
    } catch (err) {
      setError('Failed to save model');
      toast.error('Failed to save model');
      console.error(err);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingModel(null);
  };

  if (isLoading && models.length === 0) {
    return <div className="text-center py-6">Loading models...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Models</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Model
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm ? (
        <ModelForm
          model={editingModel}
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
                  API Endpoint
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
              {models.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No models found. Add a new model to get started.
                  </td>
                </tr>
              ) : (
                models.map((model) => (
                  <tr key={model._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{model.name}</td>
                    <td className="px-6 py-4">{model.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{model.apiEndpoint}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          model.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {model.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(model)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(model._id)}
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

export default ModelsList; 