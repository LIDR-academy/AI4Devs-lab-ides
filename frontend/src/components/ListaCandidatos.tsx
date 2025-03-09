import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerCandidatos, verificarConexion } from '../services/api';
import { Candidato } from '../types/candidato';
import '../styles/lista.scss';

// Datos de ejemplo para mostrar cuando no hay conexión con el backend
const DATOS_EJEMPLO: Candidato[] = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@ejemplo.com',
    telefono: '+34612345678',
    direccion: 'Calle Ejemplo 123, Madrid'
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'García',
    email: 'maria.garcia@ejemplo.com',
    telefono: '+34623456789',
    direccion: 'Avenida Principal 45, Barcelona'
  },
  {
    id: 3,
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos.rodriguez@ejemplo.com',
    telefono: '+34634567890',
    direccion: 'Plaza Mayor 7, Valencia'
  }
];

const ListaCandidatos: React.FC = () => {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const candidatosPorPagina = 10;
  const navigate = useNavigate();

  // Verificar si se ha creado un candidato recientemente
  useEffect(() => {
    const candidatoCreado = sessionStorage.getItem('candidatoCreado');
    const nombreCandidato = sessionStorage.getItem('nombreCandidato');
    
    if (candidatoCreado === 'true' && nombreCandidato) {
      setMensajeExito(`El candidato ${nombreCandidato} ha sido creado exitosamente.`);
      
      // Limpiar el sessionStorage
      sessionStorage.removeItem('candidatoCreado');
      sessionStorage.removeItem('nombreCandidato');
      
      // Ocultar el mensaje después de 5 segundos
      const timer = setTimeout(() => {
        setMensajeExito(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Cargar candidatos al montar el componente
  useEffect(() => {
    const cargarCandidatos = async () => {
      try {
        setCargando(true);
        setError(null);
        
        // Primero verificamos la conexión con el backend
        const conexionExitosa = await verificarConexion();
        
        if (!conexionExitosa) {
          setError('El sistema no está funcionando correctamente. Por favor, inténtelo de nuevo más tarde.');
          // Usar datos de ejemplo
          setCandidatos(DATOS_EJEMPLO);
          return;
        }
        
        // Intentar obtener datos del backend
        try {
          const data = await obtenerCandidatos();
          setCandidatos(data);
        } catch (backendError: any) {
          console.error('Error al obtener candidatos del backend:', backendError);
          setError('El sistema no está funcionando correctamente. Por favor, inténtelo de nuevo más tarde.');
          // Usar datos de ejemplo
          setCandidatos(DATOS_EJEMPLO);
        }
      } catch (error: any) {
        console.error('Error general al cargar candidatos:', error);
        setError('El sistema no está funcionando correctamente. Por favor, inténtelo de nuevo más tarde.');
        // Usar datos de ejemplo
        setCandidatos(DATOS_EJEMPLO);
      } finally {
        setCargando(false);
      }
    };

    cargarCandidatos();
  }, []);

  // Filtrar candidatos por búsqueda
  const candidatosFiltrados = candidatos.filter(candidato => {
    const terminoBusqueda = busqueda.toLowerCase();
    return (
      candidato.nombre.toLowerCase().includes(terminoBusqueda) ||
      candidato.apellido.toLowerCase().includes(terminoBusqueda) ||
      candidato.email.toLowerCase().includes(terminoBusqueda) ||
      candidato.telefono.toLowerCase().includes(terminoBusqueda)
    );
  });

  // Calcular paginación
  const indexUltimoItem = paginaActual * candidatosPorPagina;
  const indexPrimerItem = indexUltimoItem - candidatosPorPagina;
  const candidatosPaginados = candidatosFiltrados.slice(indexPrimerItem, indexUltimoItem);
  const totalPaginas = Math.ceil(candidatosFiltrados.length / candidatosPorPagina);

  // Cambiar de página
  const cambiarPagina = (numeroPagina: number) => {
    setPaginaActual(numeroPagina);
  };

  // Manejar cambio en la búsqueda
  const manejarCambioBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
    setPaginaActual(1); // Resetear a la primera página al buscar
  };

  // Ir a la página de añadir candidato
  const irANuevoCandidato = () => {
    navigate('/candidatos/nuevo');
  };

  // Renderizar estado de carga
  if (cargando) {
    return (
      <div className="lista-container">
        <h1 className="lista-titulo">Candidatos</h1>
        <div className="cargando">
          <div className="spinner" aria-label="Cargando candidatos"></div>
        </div>
      </div>
    );
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <div className="lista-container">
        <h1 className="lista-titulo">Candidatos</h1>
        <div className="alerta alerta-error">
          {error}
        </div>
        <div className="botones">
          <button 
            className="btn-primario" 
            onClick={() => window.location.reload()}
            aria-label="Reintentar cargar candidatos"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-container">
      <h1 className="lista-titulo">Candidatos</h1>
      
      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="alerta alerta-exito">
          {mensajeExito}
        </div>
      )}
      
      {/* Barra de acciones */}
      <div className="acciones-bar">
        <div className="busqueda">
          <input
            type="text"
            placeholder="Buscar candidatos..."
            value={busqueda}
            onChange={manejarCambioBusqueda}
            aria-label="Buscar candidatos"
          />
        </div>
        <button 
          className="agregar-btn" 
          onClick={irANuevoCandidato}
          aria-label="Añadir nuevo candidato"
        >
          <span className="icono">+</span> Añadir Candidato
        </button>
      </div>
      
      {/* Lista de candidatos */}
      {candidatosFiltrados.length === 0 ? (
        <div className="estado-vacio">
          <div className="icono">📋</div>
          <p className="mensaje">No se encontraron candidatos</p>
        </div>
      ) : (
        <>
          <table className="tabla-candidatos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {candidatosPaginados.map((candidato) => (
                <tr key={candidato.id}>
                  <td>{candidato.nombre}</td>
                  <td>{candidato.apellido}</td>
                  <td>{candidato.email}</td>
                  <td>{candidato.telefono}</td>
                  <td className="acciones">
                    <Link 
                      to={`/candidatos/${candidato.id}`} 
                      className="ver-btn"
                      aria-label={`Ver detalles de ${candidato.nombre} ${candidato.apellido}`}
                    >
                      👁️
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="paginacion">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                aria-label="Página anterior"
              >
                &laquo;
              </button>
              
              {[...Array(totalPaginas)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => cambiarPagina(index + 1)}
                  className={paginaActual === index + 1 ? 'activo' : ''}
                  aria-label={`Página ${index + 1}`}
                  aria-current={paginaActual === index + 1 ? 'page' : undefined}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                aria-label="Página siguiente"
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListaCandidatos; 