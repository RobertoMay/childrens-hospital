import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, UserPlus, Users, MapPin, Hospital, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { usePatientStore } from '../lib/utils/store';
import PatientForm from './patient-form';

export default function Navbar() {
  const [showForm, setShowForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setSelectedPatient } = usePatientStore();

  const handleNewPatient = () => {
    setSelectedPatient(null);
    setShowForm(true);
    setMobileMenuOpen(false); // Cerrar menú móvil al abrir formulario
  };

  const linkStyle =
    'text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors';

  const mobileLinkStyle =
    'text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center';

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-white border-b border-blue-100 sticky top-0 z-10 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo y botón móvil */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <Link to="/" className="flex items-center">
                <div className="bg-blue-500 text-white p-2 rounded-full mr-2 flex items-center justify-center">
                  <Hospital className="h-4 w-4" />
                </div>
                <span className="font-bold text-blue-600 text-lg">
                  Hospital
                </span>
              </Link>

              {/* Botón menú móvil */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Menú desktop (oculto en móvil) */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/" className={linkStyle}>
                <Home className="h-4 w-4 mr-1" />
                Inicio
              </Link>

              <Link to="/patients" className={linkStyle}>
                <Users className="h-4 w-4 mr-1" />
                Pacientes
              </Link>

              <Link to="/hospitals" className={linkStyle}>
                <Hospital className="h-4 w-4 mr-1" />
                Hospitales
              </Link>

              <Link to="/cities" className={linkStyle}>
                <MapPin className="h-4 w-4 mr-1" />
                Ciudades
              </Link>

              <Button
                onClick={handleNewPatient}
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center ml-2"
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Nuevo Paciente</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Menú móvil (animado) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
                <Link
                  to="/"
                  className={mobileLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5 mr-2" />
                  Inicio
                </Link>

                <Link
                  to="/patients"
                  className={mobileLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Pacientes
                </Link>

                <Link
                  to="/hospitals"
                  className={mobileLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Hospital className="h-5 w-5 mr-2" />
                  Hospitales
                </Link>

                <Link
                  to="/cities"
                  className={mobileLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Ciudades
                </Link>

                <Button
                  onClick={handleNewPatient}
                  className="w-full justify-start bg-blue-500 hover:bg-blue-600 text-white mt-2"
                  size="sm"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Nuevo Paciente
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {showForm && (
        <PatientForm isOpen={showForm} onClose={() => setShowForm(false)} />
      )}
    </>
  );
}
