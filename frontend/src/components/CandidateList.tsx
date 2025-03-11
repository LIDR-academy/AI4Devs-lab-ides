// src/components/CandidateList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  resumePath: string;
}

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:3010/api/candidates');
        setCandidates(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error al obtener los candidatos');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Lista de Candidatos</h2>
      {candidates.length === 0 ? (
        <p>No hay candidatos disponibles.</p>
      ) : (
        <ul>
          {candidates.map(candidate => (
            <li key={candidate.id} className="mb-4">
              <p><strong>Nombre:</strong> {candidate.firstName} {candidate.lastName}</p>
              <p><strong>Email:</strong> {candidate.email}</p>
              <p><strong>Teléfono:</strong> {candidate.phone}</p>
              <p><strong>Dirección:</strong> {candidate.address}</p>
              <p><strong>Educación:</strong> {candidate.education}</p>
              <p><strong>Experiencia:</strong> {candidate.experience}</p>
              <a href={candidate.resumePath} target="_blank" rel="noopener noreferrer" className="text-blue-500">Ver CV</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CandidateList;
