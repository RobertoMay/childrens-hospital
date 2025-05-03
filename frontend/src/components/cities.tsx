// components/cities.tsx
import { motion } from 'framer-motion';
import { MapPin, Flag } from 'lucide-react';
import { Card, CardContent } from './ui/card';

// Datos de prueba para ciudades
const citiesData = [
  {
    id: '1',
    name: 'Ciudad de México',
    state: 'Ciudad de México',
  },
  {
    id: '2',
    name: 'Guadalajara',
    state: 'Jalisco',
  },
  {
    id: '3',
    name: 'Monterrey',
    state: 'Nuevo León',
  },
  {
    id: '4',
    name: 'Puebla',
    state: 'Puebla',
  },
  {
    id: '5',
    name: 'Tijuana',
    state: 'Baja California',
  },
  {
    id: '6',
    name: 'Mérida',
    state: 'Yucatán',
  },
];

export default function Cities() {
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
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Ciudades</h1>
        <p className="text-gray-600">Listado de ciudades </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {citiesData.map((city) => (
          <motion.div key={city.id} variants={item}>
            <Card className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all">
              <CardContent className="pb-5 pt-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {city.name}
                    </h3>
                    <div className="flex items-center text-gray-500 mt-1">
                      <Flag className="h-4 w-4 mr-1 text-blue-500" />
                      <span>{city.state}</span>
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
