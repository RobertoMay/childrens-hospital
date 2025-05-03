import PatientTable from '../components/patient-table';
import { motion } from 'framer-motion';

export default function PatientsPage() {
  return (
    <div className="container mx-auto p-6 max-w-360">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PatientTable />
      </motion.div>
    </div>
  );
}
