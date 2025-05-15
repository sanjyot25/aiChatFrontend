import React, { useState, useEffect } from 'react';

const ModelForm = ({ model, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    apiEndpoint: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name,
        description: model.description,
        apiEndpoint: model.apiEndpoint,
        status: model.status,
      });
    }
  }, [model]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.apiEndpoint?.trim()) {
      newErrors.apiEndpoint = 'API Endpoint is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        {model ? 'Edit Model' : 'Add New Model'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label 
            htmlFor="description" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label 
            htmlFor="apiEndpoint" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            API Endpoint
          </label>
          <input
            type="text"
            id="apiEndpoint"
            name="apiEndpoint"
            value={formData.apiEndpoint}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.apiEndpoint ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.apiEndpoint && (
            <p className="mt-1 text-sm text-red-500">{errors.apiEndpoint}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="status" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {model ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModelForm; 