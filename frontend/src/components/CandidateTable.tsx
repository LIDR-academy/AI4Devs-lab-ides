import React from 'react';
import './CandidateTable.css';

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

const CandidateTable: React.FC<Props> = ({ candidates }) => {
  return (
    <div className="table-container">
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Educación</th>
            <th>Experiencia</th>
            <th>CV</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td>{candidate.nombre}</td>
              <td>{candidate.apellido}</td>
              <td>{candidate.correo}</td>
              <td>{candidate.telefono}</td>
              <td>{candidate.educacion}</td>
              <td>{candidate.experiencia}</td>
              <td>
                <a href={`http://localhost:3010/${candidate.cvUrl}`} target="_blank" rel="noopener noreferrer">
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