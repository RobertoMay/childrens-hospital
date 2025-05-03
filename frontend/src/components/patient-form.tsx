import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, Phone, UserCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { usePatientStore } from '../lib/utils/store';
import { toast, Toaster } from 'sonner';

// Validation schema
const patientSchema = yup
  .object({
    fullName: yup.string().required('El nombre es obligatorio'),
    gender: yup.string().required('El sexo es obligatorio'),
    birthDate: yup.string().required('La fecha de nacimiento es obligatoria'),
    city: yup.string().required('La ciudad es obligatoria'),
    hospital: yup.string().required('El hospital es obligatorio'),
    guardianName: yup.string().required('El nombre del tutor es obligatorio'),
    guardianPhone: yup
      .string()
      .required('El teléfono del tutor es obligatorio'),
  })
  .required();

type PatientFormData = yup.InferType<typeof patientSchema>;

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PatientForm({ isOpen, onClose }: PatientFormProps) {
  const { selectedPatient, addPatient, updatePatient } = usePatientStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: yupResolver(patientSchema),
    mode: 'onChange',
    defaultValues: {
      gender: '',
    },
  });

  useEffect(() => {
    if (selectedPatient) {
      // Pre-fill form with selected patient data
      Object.entries(selectedPatient).forEach(([key, value]) => {
        if (key !== 'id') {
          setValue(key as keyof PatientFormData, value);
        }
      });
    } else {
      reset();
    }
  }, [selectedPatient, setValue, reset]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      if (selectedPatient) {
        updatePatient({
          id: selectedPatient.id,
          ...data,
          registrationDate: selectedPatient.registrationDate,
        });
        toast.success('Paciente actualizado correctamente');
      } else {
        addPatient({
          id: Date.now().toString(),
          ...data,
          registrationDate: new Date().toISOString().split('T')[0],
        });
        toast.success('Paciente registrado correctamente');
      }

      onClose();
    } catch (err) {
      console.error('Error en onSubmit:', err);
      toast.error('Ocurrió un error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Toaster richColors closeButton position="top-right" />
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-600">
                    {selectedPatient
                      ? 'Editar Paciente'
                      : 'Registrar Nuevo Paciente'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nombre completo</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="fullName"
                          placeholder="Nombre completo del paciente"
                          className={`pl-10 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.fullName
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                          {...register('fullName')}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-sm text-red-500">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Gender Field */}
                    <div className="space-y-2">
                      <Label htmlFor="gender">Sexo</Label>
                      <Select
                        value={watch('gender') || ''} // Asegurar que nunca sea undefined
                        onValueChange={(value) => {
                          setValue('gender', value, { shouldValidate: true });
                        }}
                      >
                        <SelectTrigger
                          className={`w-full border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.gender
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                        >
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Femenino">Femenino</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="text-sm text-red-500">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>

                    {/* Birth Date Field */}
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="birthDate"
                          type="date"
                          className={`pl-10 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.birthDate
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                          {...register('birthDate')}
                        />
                      </div>
                      {errors.birthDate && (
                        <p className="text-sm text-red-500">
                          {errors.birthDate.message}
                        </p>
                      )}
                    </div>

                    {/* City Field */}
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad de origen</Label>
                      <Select
                        value={watch('city') || ''}
                        onValueChange={(value) => {
                          setValue('city', value, { shouldValidate: true });
                        }}
                      >
                        <SelectTrigger
                          className={`w-full border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.city
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                        >
                          <SelectValue placeholder="Seleccionar ciudad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mérida">Mérida</SelectItem>
                          <SelectItem value="Cancún">Cancún</SelectItem>
                          <SelectItem value="Guadalajara">
                            Guadalajara
                          </SelectItem>
                          <SelectItem value="Monterrey">Monterrey</SelectItem>
                          <SelectItem value="CDMX">Ciudad de México</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.city && (
                        <p className="text-sm text-red-500">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    {/* Hospital Field */}
                    <div className="space-y-2">
                      <Label htmlFor="hospital">Hospital de origen</Label>
                      <Select
                        value={watch('hospital') || ''}
                        onValueChange={(value) => {
                          setValue('hospital', value, { shouldValidate: true });
                        }}
                      >
                        <SelectTrigger
                          className={`w-full border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.hospital
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                        >
                          <SelectValue placeholder="Seleccionar hospital" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hospital General">
                            Hospital General
                          </SelectItem>
                          <SelectItem value="Hospital Infantil">
                            Hospital Infantil
                          </SelectItem>
                          <SelectItem value="Clínica Privada">
                            Clínica Privada
                          </SelectItem>
                          <SelectItem value="Centro Médico">
                            Centro Médico
                          </SelectItem>
                          <SelectItem value="Hospital Regional">
                            Hospital Regional
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.hospital && (
                        <p className="text-sm text-red-500">
                          {errors.hospital.message}
                        </p>
                      )}
                    </div>

                    {/* Guardian Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="guardianName">Nombre del tutor</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <UserCircle className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="guardianName"
                          placeholder="Nombre del tutor"
                          className={`pl-10 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.guardianName
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                          {...register('guardianName')}
                        />
                      </div>
                      {errors.guardianName && (
                        <p className="text-sm text-red-500">
                          {errors.guardianName.message}
                        </p>
                      )}
                    </div>

                    {/* Guardian Phone Field */}
                    <div className="space-y-2">
                      <Label htmlFor="guardianPhone">Teléfono del tutor</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="guardianPhone"
                          type="tel"
                          placeholder="Teléfono del tutor"
                          className={`pl-10 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.guardianPhone
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                          {...register('guardianPhone')}
                        />
                      </div>
                      {errors.guardianPhone && (
                        <p className="text-sm text-red-500">
                          {errors.guardianPhone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {selectedPatient ? 'Actualizar' : 'Guardar'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
