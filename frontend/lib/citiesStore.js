import { create } from 'zustand';
import { citiesAPI, weatherAPI } from './api';

export const useCitiesStore = create((set, get) => ({
  cities: [],
  weatherData: {}, // cityId -> weatherData
  isLoading: false,
  error: null,

  // Fetch cities
  fetchCities: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await citiesAPI.getCities();
      set({ cities: data, isLoading: false });
      // Fetch weather for each city
      data.forEach((city) => {
        get().fetchWeather(city._id, city.latitude, city.longitude);
      });
    } catch (error) {
      set({ error: 'Failed to fetch cities', isLoading: false });
    }
  },

  // Add city
  addCity: async (name, country, latitude, longitude) => {
    try {
      const { data } = await citiesAPI.addCity({ name, country, latitude, longitude });
      set((state) => ({ cities: [...state.cities, data] }));
      get().fetchWeather(data._id, latitude, longitude);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete city
  deleteCity: async (id) => {
    try {
      await citiesAPI.deleteCity(id);
      set((state) => ({
        cities: state.cities.filter((c) => c._id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    try {
      const { data } = await citiesAPI.toggleFavorite(id);
      set((state) => ({
        cities: state.cities.map((c) => (c._id === id ? data : c)),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Fetch weather for a city
  fetchWeather: async (cityId, latitude, longitude) => {
    try {
      const { data } = await weatherAPI.getWeather(latitude, longitude);
      set((state) => ({
        weatherData: { ...state.weatherData, [cityId]: data },
      }));
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    }
  },
}));