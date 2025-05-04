import { motion } from 'framer-motion';
import { UserPlus, Users, MapPin, Home } from 'lucide-react';
import PatientTable from './patient-table';
import { usePatientStore } from '../lib/utils/stores/patientStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useEffect, useState } from 'react';
import useCityStore from '../lib/utils/stores/cityStore';
import useHospitalStore from '../lib/utils/stores/hospitalStore';

export default function Dashboard() {
  const { totalItems, patients } = usePatientStore();
  const { count: cityCount } = useCityStore();
  const { count: hospitalCount } = useHospitalStore();
  const [newLastMonth, setNewLastMonth] = useState(0);

  useEffect(() => {
    // Calcular pacientes del último mes basado en created_at
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newPatients = patients.filter((patient) => {
      if (!patient.created_at) return false;
      const createdDate = new Date(patient.created_at);
      return createdDate >= firstDayOfMonth;
    });

    setNewLastMonth(newPatients.length);
  }, [patients]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-360 w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Hospital Infantil
        </h1>
        <p className="text-gray-600">Sistema de Registro de Pacientes</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={item}>
          <Card className="bg-white border-l-4 border-blue-400 hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Pacientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-3xl font-bold">{totalItems}</p>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white border-l-4 border-green-400 hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Nuevos (Este Mes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-3xl font-bold">{newLastMonth}</p>
                <UserPlus className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white border-l-4 border-amber-400 hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Ciudades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-3xl font-bold">{cityCount}</p>
                <MapPin className="h-8 w-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white border-l-4 border-purple-400 hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Hospitales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-3xl font-bold">{hospitalCount}</p>
                <Home className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <PatientTable />
      </motion.div>
    </div>
  );
}
