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
import { usePatientStore } from '../lib/utils/stores/patientStore';
import useCityStore from '../lib/utils/stores/cityStore';
import useHospitalStore from '../lib/utils/stores/hospitalStore';
import { toast, Toaster } from 'sonner';

const patientSchema = yup
  .object({
    full_name: yup.string().required('El nombre es obligatorio'),
    gender: yup.string().required('El sexo es obligatorio'),
    birth_date: yup.string().required('La fecha de nacimiento es obligatoria'),
    city_id: yup.number().required('La ciudad es obligatoria'),
    hospital_id: yup.number().required('El hospital es obligatorio'),
    tutor_name: yup.string().required('El nombre del tutor es obligatorio'),
    tutor_phone: yup
      .string()
      .required('El teléfono del tutor es obligatorio')
      .matches(/^[0-9]+$/, 'El teléfono solo debe contener números')
      .min(10, 'El teléfono debe tener exactamente 10 dígitos')
      .max(10, 'El teléfono debe tener exactamente 10 dígitos'),
  })
  .required();

type PatientFormData = yup.InferType<typeof patientSchema>;

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PatientForm({ isOpen, onClose }: PatientFormProps) {
  const {
    selectedPatient,
    addPatient,
    updatePatient,
    fetchPatients,
    currentPage,
  } = usePatientStore();
  const { cities } = useCityStore();
  const { hospitals } = useHospitalStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: yupResolver(patientSchema),
    mode: 'onChange',
    defaultValues: {
      gender: '',
    },
  });

  useEffect(() => {
    if (selectedPatient && cities.length > 0 && hospitals.length > 0) {
      console.log('Datos del paciente:', selectedPatient);

      reset({
        full_name: selectedPatient.full_name,
        gender: selectedPatient.gender,
        birth_date: selectedPatient.birth_date,
        city_id: selectedPatient.city,
        hospital_id: selectedPatient.hospital,
        tutor_name: selectedPatient.tutor_name,
        tutor_phone: selectedPatient.tutor_phone,
      });
    } else if (!selectedPatient) {
      reset();
    }
  }, [selectedPatient, cities, hospitals, reset]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      if (selectedPatient) {
        await updatePatient(selectedPatient.id, {
          full_name: data.full_name,
          gender: data.gender,
          birth_date: data.birth_date,
          city_id: data.city_id,
          hospital_id: data.hospital_id,
          tutor_name: data.tutor_name,
          tutor_phone: data.tutor_phone,
        });
        toast.success('Paciente actualizado correctamente');
      } else {
        await addPatient({
          full_name: data.full_name,
          gender: data.gender,
          birth_date: data.birth_date,
          city_id: data.city_id,
          hospital_id: data.hospital_id,
          tutor_name: data.tutor_name,
          tutor_phone: data.tutor_phone,
        });
        toast.success('Paciente registrado correctamente');
      }

      await fetchPatients(currentPage);
      onClose();
    } catch (error: unknown) {
      console.error('Error al guardar el paciente:', error);
      let errorMessage = 'Ocurrió un error al procesar la solicitud';

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      toast.error(errorMessage);
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
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nombre completo</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="full_name"
                          placeholder="Nombre completo del paciente"
                          className={`pl-10 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.full_name
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                          {...register('full_name')}
                        />
                      </div>
                      {errors.full_name && (
                        <p className="text-sm text-red-500">
                          {errors.full_name.message}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <Label htmlFor="gender">Sexo</Label>
                      <Select
                        value={selectedPatient?.gender || watch('gender') || ''}
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

                    {/* Birth Date */}
                    <div className="space-y-2">
                      <Label htmlFor="birth_date">Fecha de nacimiento</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="birth_date"
                          type="date"
                          className={`pl-10 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.birth_date
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                          {...register('birth_date')}
                        />
                      </div>
                      {errors.birth_date && (
                        <p className="text-sm text-red-500">
                          {errors.birth_date.message}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <Label htmlFor="city_id">Ciudad de origen</Label>
                      <Select
                        value={
                          watch('city_id')?.toString() ||
                          selectedPatient?.city?.toString() ||
                          ''
                        }
                        onValueChange={(value) => {
                          const cityId = Number(value);
                          setValue('city_id', cityId, { shouldValidate: true });
                        }}
                      >
                        <SelectTrigger
                          className={`w-full border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.city_id
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                        >
                          <SelectValue placeholder="Seleccionar ciudad">
                            {cities.find(
                              (c) =>
                                c.id ===
                                (watch('city_id') || selectedPatient?.city)
                            )?.name || 'Seleccionar ciudad'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem
                              key={city.id}
                              value={city.id.toString()}
                            >
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.city_id && (
                        <p className="text-sm text-red-500">
                          {errors.city_id.message}
                        </p>
                      )}
                    </div>

                    {/* Hospital */}
                    <div className="space-y-2">
                      <Label htmlFor="hospital_id">Hospital de origen</Label>
                      <Select
                        value={
                          watch('hospital_id')?.toString() ||
                          selectedPatient?.hospital?.toString() ||
                          ''
                        }
                        onValueChange={(value) => {
                          const hospitalId = Number(value);
                          setValue('hospital_id', hospitalId, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        <SelectTrigger
                          className={`w-full border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.hospital_id
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                        >
                          <SelectValue placeholder="Seleccionar hospital">
                            {hospitals.find(
                              (h) =>
                                h.id ===
                                (watch('hospital_id') ||
                                  selectedPatient?.hospital)
                            )?.name || 'Seleccionar hospital'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {hospitals.map((hospital) => (
                            <SelectItem
                              key={hospital.id}
                              value={hospital.id.toString()}
                            >
                              {hospital.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.hospital_id && (
                        <p className="text-sm text-red-500">
                          {errors.hospital_id.message}
                        </p>
                      )}
                    </div>

                    {/* Tutor Name */}
                    <div className="space-y-2">
                      <Label htmlFor="tutor_name">Nombre del tutor</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <UserCircle className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="tutor_name"
                          placeholder="Nombre del tutor"
                          className={`pl-10 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.tutor_name
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                          {...register('tutor_name')}
                        />
                      </div>
                      {errors.tutor_name && (
                        <p className="text-sm text-red-500">
                          {errors.tutor_name.message}
                        </p>
                      )}
                    </div>

                    {/* Tutor Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="tutor_phone">Teléfono del tutor</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="tutor_phone"
                          type="tel"
                          placeholder="Teléfono del tutor"
                          className={`pl-10 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 ${
                            errors.tutor_phone
                              ? 'border-red-300 focus:ring-red-200'
                              : ''
                          }`}
                          {...register('tutor_phone')}
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          maxLength={10}
                        />
                      </div>
                      {errors.tutor_phone && (
                        <p className="text-sm text-red-500">
                          {errors.tutor_phone.message}
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
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {selectedPatient
                            ? 'Actualizando...'
                            : 'Registrando...'}
                        </span>
                      ) : selectedPatient ? (
                        'Actualizar'
                      ) : (
                        'Guardar'
                      )}
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
