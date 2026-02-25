'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { useCitiesStore } from '@/lib/citiesStore';
import Navbar from '../components/Navbar';
import CityCard from '../components/CityCard';
import AddCityModal from '../components/AddCityModal';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const cities = useCitiesStore((state) => state.cities);
  const isLoading = useCitiesStore((state) => state.isLoading);
  const fetchCities = useCitiesStore((state) => state.fetchCities);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCities();
  }, [user, router, fetchCities]);

  const favorites = cities.filter((c) => c.isFavorite);
  const nonFavorites = cities.filter((c) => !c.isFavorite);

  if (!user) return null;

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Weather Dashboard</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            + Add City
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : cities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No cities added yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Add Your First City
            </button>
          </div>
        ) : (
          <>
            {favorites.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">⭐ Favorite Cities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((city) => (
                    <CityCard key={city._id} city={city} />
                  ))}
                </div>
              </section>
            )}

            {nonFavorites.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Other Cities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nonFavorites.map((city) => (
                    <CityCard key={city._id} city={city} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <AddCityModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    </div>
  );
}