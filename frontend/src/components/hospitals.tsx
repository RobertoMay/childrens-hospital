import { motion } from 'framer-motion';
import { Home, MapPin } from 'lucide-react';
import { Card, CardContent } from './ui/card'; // Eliminé CardHeader y CardTitle que no se usan

// Datos de prueba para hospitales
const hospitalsData = [
  {
    id: '1',
    name: 'Hospital Infantil de México',
    city: 'Ciudad de México',
  },
  {
    id: '2',
    name: 'Hospital General de Puebla',
    city: 'Puebla',
  },
  {
    id: '3',
    name: 'Hospital Civil de Guadalajara',
    city: 'Guadalajara',
  },
  {
    id: '4',
    name: 'Hospital Ángeles Monterrey',
    city: 'Monterrey',
  },
];

export default function Hospitals() {
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
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Hospitales</h1>
        <p className="text-gray-600">Listado de hospitales </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {hospitalsData.map((hospital) => (
          <motion.div key={hospital.id} variants={item}>
            <Card className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all">
              <CardContent className="pb-5 pt-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <Home className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {hospital.name}
                    </h3>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{hospital.city}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
