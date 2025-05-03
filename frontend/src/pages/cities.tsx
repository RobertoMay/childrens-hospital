import { motion } from 'framer-motion';
import Cities from '../components/cities';

export default function CitiesPage() {
  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Cities />
      </motion.div>
    </div>
  );
}
