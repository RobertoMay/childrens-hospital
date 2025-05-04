import api from './api';

interface City {
  id: number;
  name: string;
  state: string;
}

interface CitiesResponse {
  data: City[];
  meta: {
    count: number;
  };
}

const CityService = {
  getAll: async (): Promise<CitiesResponse> => {
    const response = await api.get('/cities');
    return response.data;
  },
};

export default CityService;
