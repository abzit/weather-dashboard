'use client';

import { useCitiesStore } from '@/lib/citiesStore';

export default function CityCard({ city }) {
  const weatherData = useCitiesStore((state) => state.weatherData[city._id]);
  const toggleFavorite = useCitiesStore((state) => state.toggleFavorite);
  const deleteCity = useCitiesStore((state) => state.deleteCity);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      {/* Favorite button */}
      <button
        onClick={() => toggleFavorite(city._id)}
        className="absolute top-4 right-4 text-2xl"
      >
        {city.isFavorite ? '⭐' : '☆'}
      </button>

      <h3 className="text-xl font-bold text-gray-800">{city.name}</h3>
      <p className="text-gray-600">{city.country}</p>

      {weatherData ? (
        <div className="mt-4 space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Temperature:</span> {weatherData.temperature}°C
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Condition:</span> {weatherData.weatherCondition}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Humidity:</span> {weatherData.humidity}%
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Wind Speed:</span> {weatherData.windSpeed} m/s
          </p>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Loading weather...</p>
      )}

      <button
        onClick={() => deleteCity(city._id)}
        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
      >
        Delete
      </button>
    </div>
  );
}