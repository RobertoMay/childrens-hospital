import {
  Patient,
  PatientDetailResponse,
  PatientFormData,
} from '../lib/utils/stores/patientStore';
import api from './api';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}

interface PatientsResponse {
  data: Patient[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
    has_prev_page: boolean;
    has_next_page: boolean;
    prev_page: number | null;
    next_page: number | null;
    first_page: number;
    last_page: number;
  };
}

const PatientService = {
  getAll: async (
    page: number = 1,
    perPage: number = 10
  ): Promise<PatientsResponse> => {
    const response = await api.get('/patients', {
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  },

  search: async (
    term: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<PatientsResponse> => {
    const response = await api.get('/patients/search', {
      params: {
        q: term,
        page,
        per_page: perPage,
      },
    });
    return response.data;
  },

  getById: async (id: string): Promise<PatientDetailResponse> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  create: async (
    patientData: PatientFormData
  ): Promise<ApiResponse<Patient>> => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  update: async (
    id: number,
    patientData: Partial<PatientFormData>
  ): Promise<ApiResponse<Patient>> => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },

  generatePdf: async (id: number): Promise<Blob> => {
    const response = await api.get(`/patients/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default PatientService;
