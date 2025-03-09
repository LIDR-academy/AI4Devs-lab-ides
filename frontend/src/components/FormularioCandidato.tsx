import React, { useState } from 'react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { CandidatoFormValues, Educacion, ExperienciaLaboral } from '../types/candidato';
import { crearCandidato, subirCV } from '../services/api';
import CargarCV from './CargarCV';
import '../styles/formulario.scss';

// Esquema de validación con Yup
const validationSchema = Yup.object({
  nombre: Yup.string().required('El nombre es obligatorio'),
  apellido: Yup.string().required('El apellido es obligatorio'),
  email: Yup.string()
    .email('Formato de email inválido')
    .required('El email es obligatorio'),
  telefono: Yup.string()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Formato de teléfono inválido')
    .required('El teléfono es obligatorio'),
  direccion: Yup.string(),
  educacion: Yup.array().of(
    Yup.object({
      institucion: Yup.string().required('La institución es obligatoria'),
      titulo: Yup.string().required('El título es obligatorio'),
      fecha_inicio: Yup.date().required('La fecha de inicio es obligatoria'),
      fecha_fin: Yup.date().nullable()
    })
  ),
  experiencia_laboral: Yup.array().of(
    Yup.object({
      empresa: Yup.string().required('La empresa es obligatoria'),
      puesto: Yup.string().required('El puesto es obligatorio'),
      fecha_inicio: Yup.date().required('La fecha de inicio es obligatoria'),
      fecha_fin: Yup.date().nullable(),
      descripcion: Yup.string()
    })
  )
});

const FormularioCandidato: React.FC = () => {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivoError, setArchivoError] = useState<string>('');
  const [enviando, setEnviando] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error', texto: string } | null>(null);
  const navigate = useNavigate();

  // Valores iniciales del formulario
  const initialValues: CandidatoFormValues = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    educacion: [],
    experiencia_laboral: []
  };

  // Configuración de Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setEnviando(true);
        setMensaje(null);
        
        // Validar que se haya seleccionado un archivo CV
        if (!archivo) {
          setArchivoError('El CV es obligatorio');
          setEnviando(false);
          return;
        }
        
        // Crear el candidato
        const respuesta = await crearCandidato(values);
        
        // Subir el CV
        await subirCV(respuesta.id_candidato, archivo);
        
        setMensaje({
          tipo: 'exito',
          texto: 'Candidato añadido exitosamente'
        });
        
        // Resetear el formulario
        formik.resetForm();
        setArchivo(null);
        
        // Redirigir a la lista de candidatos después de 2 segundos
        setTimeout(() => {
          navigate('/candidatos');
        }, 2000);
      } catch (error: any) {
        setMensaje({
          tipo: 'error',
          texto: error.response?.data?.error || 'Error al añadir candidato'
        });
      } finally {
        setEnviando(false);
      }
    }
  });

  // Manejar el cambio de archivo CV
  const manejarCambioArchivo = (file: File | null) => {
    setArchivo(file);
    setArchivoError(file ? '' : 'El CV es obligatorio');
  };

  // Plantilla para nueva educación
  const nuevaEducacion: Educacion = {
    institucion: '',
    titulo: '',
    fecha_inicio: '',
    fecha_fin: ''
  };

  // Plantilla para nueva experiencia laboral
  const nuevaExperiencia: ExperienciaLaboral = {
    empresa: '',
    puesto: '',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion: ''
  };

  return (
    <div className="formulario-container">
      <h1 className="formulario-titulo">Añadir Nuevo Candidato</h1>
      
      {mensaje && (
        <div className={`alerta alerta-${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}
      
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} className="formulario">
          {/* Datos personales */}
          <div className="seccion-repetible">
            <div className="seccion-titulo">
              <h3>Datos Personales</h3>
            </div>
            
            <div className="campo-grupo">
              <div className="campo">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={formik.touched.nombre && !!formik.errors.nombre}
                  aria-describedby={formik.touched.nombre && formik.errors.nombre ? "nombre-error" : undefined}
                />
                {formik.touched.nombre && formik.errors.nombre && (
                  <div className="error-mensaje" id="nombre-error">
                    {formik.errors.nombre}
                  </div>
                )}
              </div>
              
              <div className="campo">
                <label htmlFor="apellido">Apellido *</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formik.values.apellido}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={formik.touched.apellido && !!formik.errors.apellido}
                  aria-describedby={formik.touched.apellido && formik.errors.apellido ? "apellido-error" : undefined}
                />
                {formik.touched.apellido && formik.errors.apellido && (
                  <div className="error-mensaje" id="apellido-error">
                    {formik.errors.apellido}
                  </div>
                )}
              </div>
            </div>
            
            <div className="campo-grupo">
              <div className="campo">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={formik.touched.email && !!formik.errors.email}
                  aria-describedby={formik.touched.email && formik.errors.email ? "email-error" : undefined}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error-mensaje" id="email-error">
                    {formik.errors.email}
                  </div>
                )}
              </div>
              
              <div className="campo">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formik.values.telefono}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={formik.touched.telefono && !!formik.errors.telefono}
                  aria-describedby={formik.touched.telefono && formik.errors.telefono ? "telefono-error" : undefined}
                />
                {formik.touched.telefono && formik.errors.telefono && (
                  <div className="error-mensaje" id="telefono-error">
                    {formik.errors.telefono}
                  </div>
                )}
              </div>
            </div>
            
            <div className="campo">
              <label htmlFor="direccion">Dirección</label>
              <textarea
                id="direccion"
                name="direccion"
                value={formik.values.direccion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={formik.touched.direccion && !!formik.errors.direccion}
                aria-describedby={formik.touched.direccion && formik.errors.direccion ? "direccion-error" : undefined}
              />
              {formik.touched.direccion && formik.errors.direccion && (
                <div className="error-mensaje" id="direccion-error">
                  {formik.errors.direccion}
                </div>
              )}
            </div>
          </div>
          
          {/* Educación */}
          <div className="seccion-repetible">
            <div className="seccion-titulo">
              <h3>Educación</h3>
            </div>
            
            <FieldArray name="educacion">
              {({ push, remove }) => (
                <>
                  {formik.values.educacion.length > 0 && formik.values.educacion.map((_, index) => (
                    <div key={index} className="item-repetible">
                      <button
                        type="button"
                        className="eliminar-btn"
                        onClick={() => remove(index)}
                        aria-label="Eliminar educación"
                      >
                        ✕
                      </button>
                      
                      <div className="campo-grupo">
                        <div className="campo">
                          <label htmlFor={`educacion.${index}.institucion`}>Institución *</label>
                          <input
                            type="text"
                            id={`educacion.${index}.institucion`}
                            name={`educacion.${index}.institucion`}
                            value={formik.values.educacion[index].institucion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-invalid={
                              formik.touched.educacion?.[index]?.institucion && 
                              !!(formik.errors.educacion?.[index] as any)?.institucion
                            }
                          />
                          {formik.touched.educacion?.[index]?.institucion && 
                            (formik.errors.educacion?.[index] as any)?.institucion && (
                            <div className="error-mensaje">
                              {(formik.errors.educacion?.[index] as any).institucion}
                            </div>
                          )}
                        </div>
                        
                        <div className="campo">
                          <label htmlFor={`educacion.${index}.titulo`}>Título *</label>
                          <input
                            type="text"
                            id={`educacion.${index}.titulo`}
                            name={`educacion.${index}.titulo`}
                            value={formik.values.educacion[index].titulo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-invalid={
                              formik.touched.educacion?.[index]?.titulo && 
                              !!(formik.errors.educacion?.[index] as any)?.titulo
                            }
                          />
                          {formik.touched.educacion?.[index]?.titulo && 
                            (formik.errors.educacion?.[index] as any)?.titulo && (
                            <div className="error-mensaje">
                              {(formik.errors.educacion?.[index] as any).titulo}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="campo-grupo">
                        <div className="campo">
                          <label htmlFor={`educacion.${index}.fecha_inicio`}>Fecha de inicio *</label>
                          <input
                            type="date"
                            id={`educacion.${index}.fecha_inicio`}
                            name={`educacion.${index}.fecha_inicio`}
                            value={formik.values.educacion[index].fecha_inicio}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-invalid={
                              formik.touched.educacion?.[index]?.fecha_inicio && 
                              !!(formik.errors.educacion?.[index] as any)?.fecha_inicio
                            }
                          />
                          {formik.touched.educacion?.[index]?.fecha_inicio && 
                            (formik.errors.educacion?.[index] as any)?.fecha_inicio && (
                            <div className="error-mensaje">
                              {(formik.errors.educacion?.[index] as any).fecha_inicio}
                            </div>
                          )}
                        </div>
                        
                        <div className="campo">
                          <label htmlFor={`educacion.${index}.fecha_fin`}>Fecha de fin</label>
                          <input
                            type="date"
                            id={`educacion.${index}.fecha_fin`}
                            name={`educacion.${index}.fecha_fin`}
                            value={formik.values.educacion[index].fecha_fin || ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className="agregar-btn"
                    onClick={() => push(nuevaEducacion)}
                    aria-label="Agregar educación"
                  >
                    + Agregar educación
                  </button>
                </>
              )}
            </FieldArray>
          </div>
          
          {/* Experiencia Laboral */}
          <div className="seccion-repetible">
            <div className="seccion-titulo">
              <h3>Experiencia Laboral</h3>
            </div>
            
            <FieldArray name="experiencia_laboral">
              {({ push, remove }) => (
                <>
                  {formik.values.experiencia_laboral.length > 0 && formik.values.experiencia_laboral.map((_, index) => (
                    <div key={index} className="item-repetible">
                      <button
                        type="button"
                        className="eliminar-btn"
                        onClick={() => remove(index)}
                        aria-label="Eliminar experiencia"
                      >
                        ✕
                      </button>
                      
                      <div className="campo-grupo">
                        <div className="campo">
                          <label htmlFor={`experiencia_laboral.${index}.empresa`}>Empresa *</label>
                          <input
                            type="text"
                            id={`experiencia_laboral.${index}.empresa`}
                            name={`experiencia_laboral.${index}.empresa`}
                            value={formik.values.experiencia_laboral[index].empresa}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-invalid={
                              formik.touched.experiencia_laboral?.[index]?.empresa && 
                              !!(formik.errors.experiencia_laboral?.[index] as any)?.empresa
                            }
                          />
                          {formik.touched.experiencia_laboral?.[index]?.empresa && 
                            (formik.errors.experiencia_laboral?.[index] as any)?.empresa && (
                            <div className="error-mensaje">
                              {(formik.errors.experiencia_laboral?.[index] as any).empresa}
                            </div>
                          )}
                        </div>
                        
                        <div className="campo">
                          <label htmlFor={`experiencia_laboral.${index}.puesto`}>Puesto *</label>
                          <input
                            type="text"
                            id={`experiencia_laboral.${index}.puesto`}
                            name={`experiencia_laboral.${index}.puesto`}
                            value={formik.values.experiencia_laboral[index].puesto}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-invalid={
                              formik.touched.experiencia_laboral?.[index]?.puesto && 
                              !!(formik.errors.experiencia_laboral?.[index] as any)?.puesto
                            }
                          />
                          {formik.touched.experiencia_laboral?.[index]?.puesto && 
                            (formik.errors.experiencia_laboral?.[index] as any)?.puesto && (
                            <div className="error-mensaje">
                              {(formik.errors.experiencia_laboral?.[index] as any).puesto}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="campo-grupo">
                        <div className="campo">
                          <label htmlFor={`experiencia_laboral.${index}.fecha_inicio`}>Fecha de inicio *</label>
                          <input
                            type="date"
                            id={`experiencia_laboral.${index}.fecha_inicio`}
                            name={`experiencia_laboral.${index}.fecha_inicio`}
                            value={formik.values.experiencia_laboral[index].fecha_inicio}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-invalid={
                              formik.touched.experiencia_laboral?.[index]?.fecha_inicio && 
                              !!(formik.errors.experiencia_laboral?.[index] as any)?.fecha_inicio
                            }
                          />
                          {formik.touched.experiencia_laboral?.[index]?.fecha_inicio && 
                            (formik.errors.experiencia_laboral?.[index] as any)?.fecha_inicio && (
                            <div className="error-mensaje">
                              {(formik.errors.experiencia_laboral?.[index] as any).fecha_inicio}
                            </div>
                          )}
                        </div>
                        
                        <div className="campo">
                          <label htmlFor={`experiencia_laboral.${index}.fecha_fin`}>Fecha de fin</label>
                          <input
                            type="date"
                            id={`experiencia_laboral.${index}.fecha_fin`}
                            name={`experiencia_laboral.${index}.fecha_fin`}
                            value={formik.values.experiencia_laboral[index].fecha_fin || ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </div>
                      </div>
                      
                      <div className="campo">
                        <label htmlFor={`experiencia_laboral.${index}.descripcion`}>Descripción</label>
                        <textarea
                          id={`experiencia_laboral.${index}.descripcion`}
                          name={`experiencia_laboral.${index}.descripcion`}
                          value={formik.values.experiencia_laboral[index].descripcion || ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className="agregar-btn"
                    onClick={() => push(nuevaExperiencia)}
                    aria-label="Agregar experiencia laboral"
                  >
                    + Agregar experiencia laboral
                  </button>
                </>
              )}
            </FieldArray>
          </div>
          
          {/* Carga de CV */}
          <CargarCV onChange={manejarCambioArchivo} error={archivoError} />
          
          {/* Botones */}
          <div className="botones">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate('/candidatos')}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primario"
              disabled={enviando}
            >
              {enviando ? 'Enviando...' : 'Guardar Candidato'}
            </button>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default FormularioCandidato; 