import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import HospitalService from '../../../services/hospitalService';

export interface Hospital {
  id: number;
  name: string;
  city: {
    id: number;
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
            hospitals: response.data.map((hospital) => ({
              ...hospital,
              id: Number(hospital.id), // Aseguramos que id sea número
              city: {
                ...hospital.city,
                id: Number(hospital.city.id), // Aseguramos que city.id sea número
              },
            })),
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
