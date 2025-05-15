import React, { useState, useEffect } from 'react';

const PluginForm = ({ plugin, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    enabled: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plugin) {
      setFormData({
        name: plugin.name,
        description: plugin.description,
        version: plugin.version,
        enabled: plugin.enabled,
      });
    }
  }, [plugin]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? e.target.checked : undefined;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
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
    
    if (!formData.version?.trim()) {
      newErrors.version = 'Version is required';
    } else if (!/^\d+\.\d+\.\d+$/.test(formData.version)) {
      newErrors.version = 'Version must be in format x.y.z (e.g., 1.0.0)';
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
        {plugin ? 'Edit Plugin' : 'Add New Plugin'}
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
            htmlFor="version" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Version
          </label>
          <input
            type="text"
            id="version"
            name="version"
            placeholder="e.g., 1.0.0"
            value={formData.version}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.version ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.version && (
            <p className="mt-1 text-sm text-red-500">{errors.version}</p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              name="enabled"
              checked={formData.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label 
              htmlFor="enabled" 
              className="ml-2 block text-sm text-gray-900"
            >
              Enabled
            </label>
          </div>
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
            {plugin ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PluginForm; 