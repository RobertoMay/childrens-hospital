import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import HospitalService from '../../../services/hospitalService';

interface Hospital {
  id: string;
  name: string;
  city: {
    id: string;
    name: string;
  };
}

interface HospitalStore {
  hospitals: Hospital[];
  count: number;
  isLoading: boolean;
  error: string | null;
  fetchHospitals: () => Promise<void>;
}

const useHospitalStore = create<HospitalStore>()(
  persist(
    (set) => ({
      hospitals: [],
      count: 0,
      isLoading: false,
      error: null,

      fetchHospitals: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await HospitalService.getAll();
          set({
            hospitals: response.data,
            count: response.meta.count,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: 'Error al cargar los hospitales',
            isLoading: false,
          });
          console.error('Error fetching hospitals:', error);
        }
      },
    }),
    {
      name: 'hospital-storage',
      partialize: (state) => ({
        hospitals: state.hospitals,
        count: state.count,
      }),
    }
  )
);

export default useHospitalStore;
