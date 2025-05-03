import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Patient {
  id: string;
  fullName: string;
  age?: number;
  gender: string;
  birthDate: string;
  city: string;
  registrationDate: string;
  hospital: string;
  guardianName: string;
  guardianPhone: string;
}

interface PatientStore {
  patients: Patient[];
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  removePatient: (id: string) => void;
  fetchPatients: () => Promise<void>;
}

const initialPatients: Patient[] = [
  {
    id: '1',
    fullName: 'Ana María Rodríguez',
    age: 8,
    gender: 'Femenino',
    birthDate: '2016-05-12',
    city: 'Ciudad de México',
    registrationDate: '2023-10-15',
    hospital: 'Hospital Infantil de México',
    guardianName: 'Carlos Rodríguez',
    guardianPhone: '555-123-4567',
  },
];

export const usePatientStore = create<PatientStore>()(
  persist(
    (set) => ({
      patients: initialPatients,
      selectedPatient: null,

      setSelectedPatient: (patient) => set({ selectedPatient: patient }),

      addPatient: (patient) => {
        set((state) => ({
          patients: [...state.patients, patient],
        }));
        // Aquí podrías agregar la llamada API para guardar en backend
      },

      updatePatient: (updatedPatient) => {
        set((state) => ({
          patients: state.patients.map((patient) =>
            patient.id === updatedPatient.id ? updatedPatient : patient
          ),
        }));
        // Aquí podrías agregar la llamada API para actualizar en backend
      },

      removePatient: (id) => {
        set((state) => ({
          patients: state.patients.filter((patient) => patient.id !== id),
        }));
        // Aquí podrías agregar la llamada API para eliminar en backend
      },

      fetchPatients: async () => {
        try {
          // Ejemplo de llamada API al backend Laravel:
          // const response = await fetch('/api/pacientes');
          // const data = await response.json();
          // set({ patients: data });
        } catch (error) {
          console.error('Error fetching patients:', error);
        }
      },
    }),
    {
      name: 'patient-storage', // Nombre para el localStorage
      partialize: (state) => ({ patients: state.patients }), // Qué persistir
    }
  )
);
