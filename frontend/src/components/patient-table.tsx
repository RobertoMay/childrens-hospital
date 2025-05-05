import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  MapPin,
  UserCircle2,
  Calendar,
  Home,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { usePatientStore } from '../lib/utils/stores/patientStore';
import PatientForm from './patient-form';
import PdfViewer from './pdf-viewer';
import { Badge } from './ui/badge';
import { ConfirmationDialog } from './ui/confirmation-dialog';
import { toast } from 'sonner';

export default function PatientTable() {
  const {
    patients,
    currentPage,
    totalPages,
    totalItems,
    isLoading,
    error,
    setSelectedPatient,
    fetchPatients,
    removePatient,
  } = usePatientStore();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    patientId: number | null;
  }>({ isOpen: false, patientId: null });

  const [pdfViewerState, setPdfViewerState] = useState<{
    isOpen: boolean;
    patientId: number | null;
  }>({ isOpen: false, patientId: null });

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleNewPatient = () => {
    setSelectedPatient(null);
    setShowForm(true);
  };

  const handleViewPdf = async (patientId: number) => {
    try {
      setPdfViewerState({ isOpen: true, patientId });
    } catch (error) {
      console.error('Error al preparar el PDF:', error);
      toast.error('Error al cargar el PDF');
    }
  };

  const handleEdit = async (patientId: number) => {
    try {
      await usePatientStore.getState().getPatientDetails(patientId);
      setShowForm(true);
    } catch (error) {
      console.error('Error al cargar los datos del paciente:', error);
      toast.error('Error al cargar los datos del paciente');
    }
  };

  const handleDelete = (patientId: number) => {
    setDeleteConfirmation({ isOpen: true, patientId });
  };

  const confirmDelete = async () => {
    if (deleteConfirmation.patientId) {
      try {
        await removePatient(deleteConfirmation.patientId);
        toast.success('Paciente eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar paciente:', error);
        toast.error('Error al eliminar paciente');
      }
      setDeleteConfirmation({ isOpen: false, patientId: null });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar pacientes
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => fetchPatients()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
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
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Pacientes Registrados
              </h2>

              <div className="flex gap-2">
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
                </div>
                <Button
                  onClick={handleNewPatient}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Nuevo Paciente</span>
                  <span className="sm:hidden">Nuevo</span>
                </Button>
              </div>
            </div>
          </div>

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
                        Hospital
                      </TableHead>
                      <TableHead className="bg-gray-50 hidden md:table-cell">
                        Tutor
                      </TableHead>
                      <TableHead className="bg-gray-50 hidden sm:table-cell">
                        Fecha de inscripción
                      </TableHead>
                      <TableHead className="rounded-tr-lg bg-gray-50 text-right">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.length > 0 ? (
                      patients.map((patient) => (
                        <TableRow
                          key={patient.id}
                          className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <TableCell className="font-medium py-3 sm:py-4">
                            {patient.full_name}
                          </TableCell>
                          <TableCell>{patient.age} años</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {patient.city}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {patient.hospital}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {patient.tutor_name}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {new Date(
                              patient.registration_date
                            ).toLocaleDateString()}
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
                          colSpan={7}
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
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all h-full">
                      <CardContent className="p-4 pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                            {patient.full_name}
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
                            <Home className="h-3.5 w-3.5 text-gray-500" />
                            <span className="truncate">{patient.hospital}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <UserCircle2 className="h-3.5 w-3.5 text-gray-500" />
                            <span className="truncate">
                              {patient.tutor_name}
                            </span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-gray-500" />
                            {new Date(
                              patient.registration_date
                            ).toLocaleDateString()}
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

          {totalItems > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3"
            >
              <p className="text-xs sm:text-sm text-gray-500">
                Mostrando página {currentPage} de {totalPages} - {totalItems}{' '}
                pacientes
              </p>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-200 hover:bg-gray-50 hidden sm:inline-flex"
                  onClick={() => fetchPatients(1)}
                  disabled={currentPage === 1}
                >
                  Primera
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-200 hover:bg-gray-50 h-8 w-8 p-0"
                  onClick={() => fetchPatients(currentPage - 1)}
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
                        onClick={() => fetchPatients(pageNum)}
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
                      onClick={() => fetchPatients(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-200 hover:bg-gray-50 h-8 w-8 p-0"
                  onClick={() => fetchPatients(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-200 hover:bg-gray-50 hidden sm:inline-flex"
                  onClick={() => fetchPatients(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Última
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {pdfViewerState.isOpen && (
        <PdfViewer
          isOpen={pdfViewerState.isOpen}
          onClose={() => setPdfViewerState({ isOpen: false, patientId: null })}
          patientId={pdfViewerState.patientId}
        />
      )}

      {showForm && (
        <PatientForm isOpen={showForm} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
