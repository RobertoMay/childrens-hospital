import api from './api';

interface Hospital {
  id: number;
  name: string;
  city: {
    id: string;
    name: string;
  };
}

interface HospitalsResponse {
  data: Hospital[];
  meta: {
    count: number;
  };
}

const HospitalService = {
  getAll: async (): Promise<HospitalsResponse> => {
    const response = await api.get('/hospitals');
    return response.data;
  },
};

export default HospitalService;
