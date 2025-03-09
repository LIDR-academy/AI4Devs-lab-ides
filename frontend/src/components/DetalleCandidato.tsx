import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerCandidatoPorId } from '../services/api';
import { Candidato } from '../types/candidato';
import '../styles/formulario.scss';

const DetalleCandidato: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarCandidato = async () => {
      if (!id) return;
      
      try {
        setCargando(true);
        setError(null);
        const data = await obtenerCandidatoPorId(parseInt(id));
        setCandidato(data);
      } catch (error) {
        console.error('Error al cargar candidato:', error);
        setError('No se pudo cargar la información del candidato. Por favor, intenta de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    };

    cargarCandidato();
  }, [id]);

  const volverALista = () => {
    navigate('/candidatos');
  };

  if (cargando) {
    return (
      <div className="formulario-container">
        <h1 className="formulario-titulo">Detalles del Candidato</h1>
        <div className="cargando">
          <div className="spinner" aria-label="Cargando candidato"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="formulario-container">
        <h1 className="formulario-titulo">Detalles del Candidato</h1>
        <div className="alerta alerta-error">
          {error}
        </div>
        <div className="botones">
          <button 
            className="btn-primario" 
            onClick={volverALista}
            aria-label="Volver a la lista de candidatos"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!candidato) {
    return (
      <div className="formulario-container">
        <h1 className="formulario-titulo">Detalles del Candidato</h1>
        <div className="alerta alerta-error">
          No se encontró el candidato solicitado.
        </div>
        <div className="botones">
          <button 
            className="btn-primario" 
            onClick={volverALista}
            aria-label="Volver a la lista de candidatos"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="formulario-container">
      <h1 className="formulario-titulo">Detalles del Candidato</h1>
      
      <div className="seccion-repetible">
        <div className="seccion-titulo">
          <h3>Datos Personales</h3>
        </div>
        
        <div className="campo-grupo">
          <div className="campo">
            <label>Nombre</label>
            <div>{candidato.nombre}</div>
          </div>
          
          <div className="campo">
            <label>Apellido</label>
            <div>{candidato.apellido}</div>
          </div>
        </div>
        
        <div className="campo-grupo">
          <div className="campo">
            <label>Email</label>
            <div>{candidato.email}</div>
          </div>
          
          <div className="campo">
            <label>Teléfono</label>
            <div>{candidato.telefono}</div>
          </div>
        </div>
        
        <div className="campo">
          <label>Dirección</label>
          <div>{candidato.direccion || 'No especificada'}</div>
        </div>
      </div>
      
      {/* Educación */}
      {candidato.educacion && candidato.educacion.length > 0 && (
        <div className="seccion-repetible">
          <div className="seccion-titulo">
            <h3>Educación</h3>
          </div>
          
          {candidato.educacion.map((edu, index) => (
            <div key={index} className="item-repetible">
              <div className="campo-grupo">
                <div className="campo">
                  <label>Institución</label>
                  <div>{edu.institucion}</div>
                </div>
                
                <div className="campo">
                  <label>Título</label>
                  <div>{edu.titulo}</div>
                </div>
              </div>
              
              <div className="campo-grupo">
                <div className="campo">
                  <label>Fecha de inicio</label>
                  <div>{edu.fecha_inicio}</div>
                </div>
                
                <div className="campo">
                  <label>Fecha de fin</label>
                  <div>{edu.fecha_fin || 'En curso'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Experiencia Laboral */}
      {candidato.experiencia_laboral && candidato.experiencia_laboral.length > 0 && (
        <div className="seccion-repetible">
          <div className="seccion-titulo">
            <h3>Experiencia Laboral</h3>
          </div>
          
          {candidato.experiencia_laboral.map((exp, index) => (
            <div key={index} className="item-repetible">
              <div className="campo-grupo">
                <div className="campo">
                  <label>Empresa</label>
                  <div>{exp.empresa}</div>
                </div>
                
                <div className="campo">
                  <label>Puesto</label>
                  <div>{exp.puesto}</div>
                </div>
              </div>
              
              <div className="campo-grupo">
                <div className="campo">
                  <label>Fecha de inicio</label>
                  <div>{exp.fecha_inicio}</div>
                </div>
                
                <div className="campo">
                  <label>Fecha de fin</label>
                  <div>{exp.fecha_fin || 'Actual'}</div>
                </div>
              </div>
              
              {exp.descripcion && (
                <div className="campo">
                  <label>Descripción</label>
                  <div>{exp.descripcion}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Documentos */}
      {candidato.documentos && candidato.documentos.length > 0 && (
        <div className="seccion-repetible">
          <div className="seccion-titulo">
            <h3>Documentos</h3>
          </div>
          
          {candidato.documentos.map((doc, index) => (
            <div key={index} className="item-repetible">
              <div className="campo">
                <label>{doc.tipo_documento}</label>
                <div>
                  <a 
                    href={`http://localhost:3010${doc.ruta_archivo}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {doc.nombre_archivo}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="botones">
        <button 
          className="btn-primario" 
          onClick={volverALista}
          aria-label="Volver a la lista de candidatos"
        >
          Volver a la lista
        </button>
      </div>
    </div>
  );
};

export default DetalleCandidato; 