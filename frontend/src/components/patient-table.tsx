import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  MapPin,
  UserCircle2,
  Calendar,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { usePatientStore } from '../lib/utils/store';
import PatientForm from './patient-form';
import PdfViewer from './pdf-viewer';
import { Badge } from './ui/badge';
import { ConfirmationDialog } from './ui/confirmation-dialog';
import { toast } from 'sonner';

export default function PatientTable() {
  const { patients, setSelectedPatient } = usePatientStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const patientsPerPage = 10;

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    patientId: string | null;
  }>({ isOpen: false, patientId: null });

  // Filtrar pacientes basado en término de búsqueda
  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.guardianName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular paginación
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Función para manejar nuevo paciente
  const handleNewPatient = () => {
    setSelectedPatient(null);
    setShowForm(true);
  };

  // Función para ver PDF
  const handleViewPdf = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setShowPdf(true);
    }
  };

  // Función para editar paciente
  const handleEdit = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setShowForm(true);
    }
  };

  // Función para eliminar paciente
  const handleDelete = (patientId: string) => {
    setDeleteConfirmation({ isOpen: true, patientId });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.patientId) {
      usePatientStore.getState().removePatient(deleteConfirmation.patientId);
      toast.success('Paciente eliminado correctamente');
    }
    setDeleteConfirmation({ isOpen: false, patientId: null });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({ isOpen: false, patientId: null })
        }
        onConfirm={confirmDelete}
        title="Eliminar paciente"
        message="¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />

      <Card className="bg-white rounded-lg shadow-sm border border-gray-100">
        <CardContent className="p-4 sm:p-6">
          {/* Header con buscador y botones - Mejorado para móviles */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-start">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Pacientes Registrados
              </h2>

              <div className="flex gap-2 sm:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg"
                  onClick={() =>
                    setViewMode(viewMode === 'table' ? 'cards' : 'table')
                  }
                  title={viewMode === 'table' ? 'Ver tarjetas' : 'Ver tabla'}
                >
                  {viewMode === 'table' ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  )}
                </Button>
                <Button
                  onClick={handleNewPatient}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  size="icon"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Buscar pacientes..."
                  className="pl-10 rounded-lg border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-100"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="hidden sm:flex gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-lg border-gray-200"
                  onClick={() => setViewMode('table')}
                >
                  Tabla
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-lg border-gray-200"
                  onClick={() => setViewMode('cards')}
                >
                  Tarjetas
                </Button>
                <Button
                  onClick={handleNewPatient}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Nuevo</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Contenido (Tabla o Tarjetas) */}
          {viewMode === 'table' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="overflow-x-auto">
                <Table className="border-separate border-spacing-0 min-w-[600px]">
                  <TableHeader className="[&_tr]:border-b-0">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="rounded-tl-lg bg-gray-50">
                        Nombre
                      </TableHead>
                      <TableHead className="bg-gray-50">Edad</TableHead>
                      <TableHead className="bg-gray-50">Ciudad</TableHead>
                      <TableHead className="bg-gray-50 hidden md:table-cell">
                        Tutor
                      </TableHead>
                      <TableHead className="bg-gray-50 hidden sm:table-cell">
                        Fecha
                      </TableHead>
                      <TableHead className="rounded-tr-lg bg-gray-50 text-right">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPatients.length > 0 ? (
                      currentPatients.map((patient) => (
                        <TableRow
                          key={patient.id}
                          className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <TableCell className="font-medium py-3 sm:py-4">
                            {patient.fullName}
                          </TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {patient.city}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {patient.guardianName}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {patient.registrationDate}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg hover:bg-blue-50"
                                onClick={() => handleViewPdf(patient.id)}
                                title="Ver PDF"
                              >
                                <FileText className="h-4 w-4 text-blue-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg hover:bg-amber-50"
                                onClick={() => handleEdit(patient.id)}
                                title="Editar"
                              >
                                <Pencil className="h-4 w-4 text-amber-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg hover:bg-red-50"
                                onClick={() => handleDelete(patient.id)}
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-gray-500"
                        >
                          No se encontraron pacientes
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
              {currentPatients.length > 0 ? (
                currentPatients.map((patient) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all h-full">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                            {patient.fullName}
                          </h3>
                          <Badge
                            variant="outline"
                            className="border-gray-300 bg-gray-50 text-xs sm:text-sm"
                          >
                            {patient.age} años
                          </Badge>
                        </div>
                        <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
                          <p className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-gray-500" />
                            {patient.city}
                          </p>
                          <p className="flex items-center gap-2">
                            <UserCircle2 className="h-3.5 w-3.5 text-gray-500" />
                            <span className="truncate">
                              {patient.guardianName}
                            </span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-gray-500" />
                            {patient.registrationDate}
                          </p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg border-gray-200 hover:bg-blue-50 text-blue-500 px-2"
                            onClick={() => handleViewPdf(patient.id)}
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:ml-1">
                              PDF
                            </span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg border-gray-200 hover:bg-amber-50 text-amber-500 px-2"
                            onClick={() => handleEdit(patient.id)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:ml-1">
                              Editar
                            </span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg border-gray-200 hover:bg-red-50 text-red-500 px-2"
                            onClick={() => handleDelete(patient.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:ml-1">
                              Eliminar
                            </span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No se encontraron pacientes
                </div>
              )}
            </div>
          )}

          {/* Paginación mejorada */}
          {filteredPatients.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3"
            >
              <p className="text-xs sm:text-sm text-gray-500">
                Mostrando {indexOfFirstPatient + 1}-
                {Math.min(indexOfLastPatient, filteredPatients.length)} de{' '}
                {filteredPatients.length} pacientes
              </p>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-200 hover:bg-gray-50 hidden sm:inline-flex"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  Primera
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-200 hover:bg-gray-50 h-8 w-8 p-0"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? 'default' : 'outline'
                        }
                        size="sm"
                        className={`rounded-lg h-8 w-8 p-0 text-xs sm:text-sm ${
                          currentPage === pageNum
                            ? ''
                            : 'border-gray-200 hover:bg-gray-500'
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 3 && currentPage < totalPages - 1 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  {totalPages > 3 && currentPage < totalPages - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg h-8 w-8 p-0 text-xs sm:text-sm border-gray-200 hover:bg-gray-500"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-200 hover:bg-gray-50 h-8 w-8 p-0"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-200 hover:bg-gray-50 hidden sm:inline-flex"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Última
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      {showForm && (
        <PatientForm isOpen={showForm} onClose={() => setShowForm(false)} />
      )}

      {showPdf && (
        <PdfViewer isOpen={showPdf} onClose={() => setShowPdf(false)} />
      )}
    </div>
  );
}
