import { Button } from './ui/button';
import { usePatientStore } from '../lib/utils/store';

interface PdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PdfViewer({ isOpen, onClose }: PdfViewerProps) {
  const { selectedPatient } = usePatientStore();

  if (!isOpen || !selectedPatient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Información del paciente</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => window.print()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Descargar PDF
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <iframe
            src="/sample.pdf"
            className="w-full h-full border rounded-lg"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}
