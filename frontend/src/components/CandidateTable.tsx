import React, { useState } from 'react';
import './CandidateTable.css';
import { config } from '../config/config';

interface Candidate {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  educacion: string;
  experiencia: string;
  cvUrl: string;
}

interface Props {
  candidates: Candidate[];
}

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-locked">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const UnlockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-open">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
  </svg>
);

const CandidateTable: React.FC<Props> = ({ candidates }) => {
  const [decryptedData, setDecryptedData] = useState<Map<string, {
    correo: string;
    telefono: string;
    direccion: string;
  }>>(new Map());

  const maskData = (data: string) => '••••••••••';

  const toggleDecryption = async (candidateId: string) => {
    try {
      if (decryptedData.has(candidateId)) {
        // Si ya está desencriptado, lo volvemos a encriptar
        const newDecryptedData = new Map(decryptedData);
        newDecryptedData.delete(candidateId);
        setDecryptedData(newDecryptedData);
      } else {
        // Si está encriptado, obtenemos los datos desencriptados
        const response = await fetch(`${config.api.baseUrl}/api/candidates/${candidateId}/decrypt`);
        if (!response.ok) throw new Error('Error al desencriptar datos');
        const data = await response.json();
        
        const newDecryptedData = new Map(decryptedData);
        newDecryptedData.set(candidateId, data);
        setDecryptedData(newDecryptedData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="table-container">
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Estado</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Educación</th>
            <th>Experiencia</th>
            <th>CV</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td>
                <button 
                  className="decrypt-button"
                  onClick={() => toggleDecryption(candidate.id)}
                  aria-label={decryptedData.has(candidate.id) ? "Encriptar datos" : "Desencriptar datos"}
                >
                  {decryptedData.has(candidate.id) ? <UnlockIcon /> : <LockIcon />}
                </button>
              </td>
              <td>{candidate.nombre}</td>
              <td>{candidate.apellido}</td>
              <td className={decryptedData.has(candidate.id) ? 'decrypted' : 'encrypted'}>
                {decryptedData.has(candidate.id) 
                  ? decryptedData.get(candidate.id)?.correo 
                  : maskData(candidate.correo)}
              </td>
              <td className={decryptedData.has(candidate.id) ? 'decrypted' : 'encrypted'}>
                {decryptedData.has(candidate.id) 
                  ? decryptedData.get(candidate.id)?.telefono 
                  : maskData(candidate.telefono)}
              </td>
              <td className={decryptedData.has(candidate.id) ? 'decrypted' : 'encrypted'}>
                {decryptedData.has(candidate.id) 
                  ? decryptedData.get(candidate.id)?.direccion 
                  : maskData(candidate.direccion)}
              </td>
              <td>{candidate.educacion}</td>
              <td>{candidate.experiencia}</td>
              <td>
                <a href={`${config.api.baseUrl}/${candidate.cvUrl}`} target="_blank" rel="noopener noreferrer">
                  Ver CV
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable; 