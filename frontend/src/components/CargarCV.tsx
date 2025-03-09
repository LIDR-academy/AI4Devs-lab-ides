import React, { useState, useRef, ChangeEvent } from 'react';
import { CVFormValues } from '../types/candidato';
import '../styles/formulario.scss';

interface CargarCVProps {
  onChange: (file: File | null) => void;
  error?: string;
}

const CargarCV: React.FC<CargarCVProps> = ({ onChange, error }) => {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [arrastrandoArchivo, setArrastrandoArchivo] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Validar el tipo de archivo (PDF o DOCX)
  const validarTipoArchivo = (file: File): boolean => {
    const tiposPermitidos = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return tiposPermitidos.includes(file.type);
  };

  // Validar el tamaño del archivo (máximo 5MB)
  const validarTamanoArchivo = (file: File): boolean => {
    const tamanoMaximo = 5 * 1024 * 1024; // 5MB en bytes
    return file.size <= tamanoMaximo;
  };

  // Manejar el cambio de archivo
  const manejarCambioArchivo = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (!validarTipoArchivo(file)) {
        alert('Formato de archivo no válido. Solo se permiten archivos PDF o DOCX.');
        setArchivo(null);
        onChange(null);
        return;
      }
      
      if (!validarTamanoArchivo(file)) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
        setArchivo(null);
        onChange(null);
        return;
      }
      
      setArchivo(file);
      onChange(file);
    }
  };

  // Manejar el arrastre de archivos
  const manejarArrastre = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setArrastrandoArchivo(true);
    } else if (e.type === 'dragleave') {
      setArrastrandoArchivo(false);
    }
  };

  // Manejar la soltura de archivos
  const manejarSoltar = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setArrastrandoArchivo(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (!validarTipoArchivo(file)) {
        alert('Formato de archivo no válido. Solo se permiten archivos PDF o DOCX.');
        return;
      }
      
      if (!validarTamanoArchivo(file)) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
        return;
      }
      
      setArchivo(file);
      onChange(file);
    }
  };

  // Eliminar el archivo seleccionado
  const eliminarArchivo = () => {
    setArchivo(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Abrir el selector de archivos
  const abrirSelectorArchivos = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="campo">
      <label htmlFor="cv">CV (PDF o DOCX, máx. 5MB) *</label>
      <div 
        className={`carga-archivo ${arrastrandoArchivo ? 'arrastrando' : ''}`}
        onDragEnter={manejarArrastre}
        onDragOver={manejarArrastre}
        onDragLeave={manejarArrastre}
        onDrop={manejarSoltar}
        onClick={abrirSelectorArchivos}
        aria-label="Área para cargar CV"
        role="button"
        tabIndex={0}
      >
        <input 
          type="file" 
          id="cv" 
          ref={inputRef}
          className="archivo-input" 
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
          onChange={manejarCambioArchivo}
          aria-invalid={!!error}
          aria-describedby={error ? "cv-error" : undefined}
        />
        
        {!archivo ? (
          <>
            <span className="archivo-label">Haz clic o arrastra un archivo aquí</span>
            <p className="archivo-info">Formatos aceptados: PDF, DOCX. Tamaño máximo: 5MB</p>
          </>
        ) : (
          <div className="archivo-preview" onClick={(e) => e.stopPropagation()}>
            <span className="archivo-nombre">{archivo.name}</span>
            <button 
              type="button" 
              className="eliminar-archivo" 
              onClick={(e) => {
                e.stopPropagation();
                eliminarArchivo();
              }}
              aria-label="Eliminar archivo"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="error-mensaje" id="cv-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default CargarCV; 