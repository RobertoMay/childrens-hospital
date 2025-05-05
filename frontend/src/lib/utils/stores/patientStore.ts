import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import PatientService from '../../../services/patientService';

export interface Patient {
  id: number;
  full_name: string;
  age: number;
  gender: string;
  birth_date: string;
  city: string;
  hospital: string;
  tutor_name: string;
  tutor_phone: string;
  registration_date: string;
  created_at?: string;
}

export interface PatientDetail {
  id: number;
  full_name: string;
  age: number;
  gender: string;
  birth_date: string;
  city: number;
  hospital: number;
  tutor_name: string;
  tutor_phone: string;
  registration_date: string;
  created_at?: string;
}

export interface PatientDetailResponse {
  data: {
    id: number;
    full_name: string;
    age: number;
    gender: string;
    birth_date: string;
    city: number;
    hospital: number;
    tutor_name: string;
    tutor_phone: string;
    registration_date: string;
    created_at?: string;
  };
}

export interface PatientFormData {
  full_name: string;
  gender: string;
  birth_date: string;
  city_id: number;
  hospital_id: number;
  tutor_name: string;
  tutor_phone: string;
}

interface PatientStore {
  patients: Patient[];
  selectedPatient: PatientDetail | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;

  setSelectedPatient: (patient: PatientDetail | null) => void;

  fetchPatients: (page?: number, perPage?: number) => Promise<void>;

  getPatientDetails: (id: number) => Promise<PatientDetail>;
  addPatient: (patient: PatientFormData) => Promise<Patient>;
  updatePatient: (
    id: number,
    patient: Partial<PatientFormData>
  ) => Promise<Patient>;
  removePatient: (id: number) => Promise<void>;
}

export const usePatientStore = create<PatientStore>()(
  persist(
    (set, get) => ({
      patients: [],
      selectedPatient: null,
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      isLoading: false,
      error: null,

      setSelectedPatient: (patient) => set({ selectedPatient: patient }),

      fetchPatients: async (page = 1, perPage = 10) => {
        set({ isLoading: true, error: null });
        try {
          const response = await PatientService.getAll(page, perPage);
          set({
            patients: response.data,
            currentPage: response.pagination.current_page,
            totalPages: response.pagination.total_pages,
            totalItems: response.pagination.total_items,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: 'Error al cargar los pacientes',
            isLoading: false,
          });
          console.error('Error fetching patients:', error);
        }
      },

      getPatientDetails: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await PatientService.getById(id.toString());

          const patientData = response.data;

          set({
            selectedPatient: patientData,
            isLoading: false,
          });
          return patientData;
        } catch (error) {
          set({
            error: 'Error al cargar detalles del paciente',
            isLoading: false,
          });
          console.error('Error getting patient details:', error);
          throw error;
        }
      },

      addPatient: async (patientData: PatientFormData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await PatientService.create(patientData);

          const newPatient: Patient = {
            ...response.data,
            city: get().selectedPatient?.city.toString() || '',
            hospital: get().selectedPatient?.hospital.toString() || '',
          };

          set((state) => ({
            patients: [newPatient, ...state.patients],
            isLoading: false,
          }));
          return newPatient;
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Error al agregar paciente';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      updatePatient: async (id, patientData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await PatientService.update(id, patientData);

          const updatedPatient: Patient = {
            ...response.data,
            city: patientData.city_id?.toString() || '',
            hospital: patientData.hospital_id?.toString() || '',
          };

          set((state) => ({
            patients: state.patients.map((p) =>
              p.id === id ? updatedPatient : p
            ),
            isLoading: false,
            selectedPatient: null,
          }));
          return updatedPatient;
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Error al actualizar paciente';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      removePatient: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await PatientService.delete(id);
          set((state) => ({
            patients: state.patients.filter((p) => p.id !== id),
            isLoading: false,
            selectedPatient: null,
          }));
        } catch (error) {
          set({ error: 'Error al eliminar paciente', isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'patient-storage',
      partialize: (state) => ({
        patients: state.patients,
        currentPage: state.currentPage,
        totalPages: state.totalPages,
        totalItems: state.totalItems,
      }),
    }
  )
);
