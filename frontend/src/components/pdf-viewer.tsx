import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';
import PatientService from '../services/patientService';
import { usePatientStore } from '../lib/utils/stores/patientStore';
import { toast } from 'sonner';

interface PdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number | null;
}

export default function PdfViewer({
  isOpen,
  onClose,
  patientId,
}: PdfViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { patients } = usePatientStore();

  const patient = patients.find((p) => p.id === patientId);

  useEffect(() => {
    if (isOpen && patientId) {
      const loadPdf = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const pdfBlob = await PatientService.generatePdf(patientId);
          const url = URL.createObjectURL(pdfBlob);
          setPdfUrl(url);
        } catch (err) {
          console.error('Error al generar el PDF:', err);
          setError('Error al cargar el PDF del paciente');
          toast.error('Error al generar el PDF');
        } finally {
          setIsLoading(false);
        }
      };
      loadPdf();
    }

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [isOpen, patientId]);

  const handleDownload = () => {
    if (pdfUrl && patient) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `Archivo_${patient.full_name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen || !patientId || !patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col border border-gray-200 overflow-hidden">
        {/* Encabezado con fondo blanco puro */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-blue-600">
            Archivo de -{' '}
            <span className="text-blue-600">{patient.full_name}</span>
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              disabled={!pdfUrl || isLoading}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenido del PDF */}
        <div className="flex-1 flex flex-col p-0 bg-gray-50">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-blue-500">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 border-r-transparent"></div>
                <p>Generando documento...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-1 items-center justify-center text-red-500">
              <p>{error}</p>
            </div>
          ) : pdfUrl ? (
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full"
                title={`Resumen de ${patient.full_name}`}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
