import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CityService from '../../../services/cityService';

export interface City {
  id: number;
  name: string;
  state: string;
}

interface CityStore {
  cities: City[];
  count: number;
  isLoading: boolean;
  error: string | null;
  fetchCities: () => Promise<void>;
}

const useCityStore = create<CityStore>()(
  persist(
    (set) => ({
      cities: [],
      count: 0,
      isLoading: false,
      error: null,

      fetchCities: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await CityService.getAll();
          set({
            cities: response.data.map((city) => ({
              ...city,
              id: Number(city.id),
            })),
            count: response.meta.count,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: 'Error al cargar las ciudades',
            isLoading: false,
          });
          console.error('Error fetching cities:', error);
        }
      },
    }),
    {
      name: 'city-storage',
      partialize: (state) => ({
        cities: state.cities,
        count: state.count,
      }),
    }
  )
);

export default useCityStore;
