import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  background-color: #f2f2f2;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  cvFilePath?: string;
  cvUrl?: string;
  [key: string]: any; // Permite propiedades adicionales
}

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:3010/candidates', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Asegurarse de que response.data es un array de Candidate
        const candidatesData = Array.isArray(response.data) ? response.data : [];
        setCandidates(candidatesData as Candidate[]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setError('Error fetching candidates. Please try again later.');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Función para descargar el CV de forma segura
  const downloadCV = async (filename: string | undefined) => {
    if (!filename) {
      setError('No CV file available');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login again.');
        return;
      }

      // Realizar una solicitud para descargar el archivo
      const response = await axios({
        url: `http://localhost:3010/cv/${filename}`,
        method: 'GET',
        responseType: 'blob', // Importante para manejar archivos binarios
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Crear un objeto URL para el blob
      const blob = new Blob([response.data as any]);
      const url = window.URL.createObjectURL(blob);
      
      // Crear un elemento <a> temporal
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // Nombre del archivo para la descarga
      
      // Añadir el enlace al documento
      document.body.appendChild(link);
      
      // Simular clic en el enlace
      link.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading CV:', error);
      setError('Error downloading CV. Please try again later.');
    }
  };

  if (loading) {
    return <div>Loading candidates...</div>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Title>Candidate List</Title>
      {candidates.length === 0 ? (
        <p>No candidates found. Add some candidates to see them here.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Phone</TableHeader>
              <TableHeader>Education</TableHeader>
              <TableHeader>Experience</TableHeader>
              <TableHeader>CV</TableHeader>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>{candidate.firstName} {candidate.lastName}</TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>{candidate.phone}</TableCell>
                <TableCell>{candidate.education}</TableCell>
                <TableCell>{candidate.experience}</TableCell>
                <TableCell>
                  {candidate.cvFilePath ? (
                    <button 
                      onClick={() => {
                        const filename = candidate.cvFilePath ? candidate.cvFilePath.replace('uploads/', '') : undefined;
                        downloadCV(filename);
                      }}
                      style={{ 
                        background: 'none',
                        border: 'none',
                        color: '#007bff',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                    >
                      Download CV
                    </button>
                  ) : (
                    'No CV available'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default CandidateList; 