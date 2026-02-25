'use client';

import { useState } from 'react';
import { useCitiesStore } from '@/lib/citiesStore';

export default function AddCityModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    latitude: '',
    longitude: '',
  });
  const addCity = useCitiesStore((state) => state.addCity);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await addCity(
        formData.name,
        formData.country,
        parseFloat(formData.latitude),
        parseFloat(formData.longitude)
      );
      setFormData({ name: '', country: '', latitude: '', longitude: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add city');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Add City</h2>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="City Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            placeholder="Country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="number"
            step="0.0001"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="number"
            step="0.0001"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add City'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}