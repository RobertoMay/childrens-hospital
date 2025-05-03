import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import PatientsPage from './pages/patients';
import HospitalsPage from './pages/hospitals';
import CitiesPage from './pages/cities';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/patients" element={<PatientsPage />} />
      <Route path="/hospitals" element={<HospitalsPage />} />
      <Route path="/cities" element={<CitiesPage />} />
    </Routes>
  );
}
