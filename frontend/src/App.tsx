import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/navbar';
import AppRoutes from './routes';
import { Toaster } from 'sonner';
import useCityStore from './lib/utils/stores/cityStore';
import { useEffect } from 'react';
import useHospitalStore from './lib/utils/stores/hospitalStore';

function App() {
  const { fetchCities } = useCityStore();
  const { fetchHospitals } = useHospitalStore();

  useEffect(() => {
    fetchCities();
    fetchHospitals();
  }, [fetchCities, fetchHospitals]);

  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <AppRoutes />
          </main>
        </div>
      </Router>
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}

export default App;
