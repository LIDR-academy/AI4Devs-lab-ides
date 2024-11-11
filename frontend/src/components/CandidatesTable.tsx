import React, { useEffect, useState } from 'react';

interface Candidate {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    cvUrl: string;
}

export const CandidatesTable: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchCandidates = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/candidates`);
                const data = await response.json();
                if (isMounted) {
                    setCandidates(data);
                }
            } catch (error) {
                console.error('Error fetching candidates:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCandidates();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleViewCV = async (cvUrl: string, nombre: string, apellido: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/candidates/download-cv`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cvUrl })
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `CV_${nombre}_${apellido}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error al descargar el CV:', error);
            alert('Error al descargar el CV. Por favor, intente nuevamente.');
        }
    };

    const handleDeleteCandidate = async (id: string) => {
        try {
            setDeleteLoading(id);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/candidates/${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            setCandidates((prevCandidates) => prevCandidates.filter((candidate) => candidate.id !== id));
        } catch (error) {
            console.error('Error al eliminar el registro:', error);
            alert('Error al eliminar el registro. Por favor, intente nuevamente.');
        } finally {
            setDeleteLoading(null);
        }
    };

    if (loading) {
        return <div className="text-center">Cargando candidatos...</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Teléfono
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.map((candidate) => (
                        <tr key={candidate.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {candidate.nombre} {candidate.apellido}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {candidate.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {candidate.telefono}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                <button
                                    onClick={() => handleViewCV(candidate.cvUrl, candidate.nombre, candidate.apellido)}
                                    className="text-blue-600 hover:text-blue-900"
                                    disabled={!candidate.cvUrl}
                                >
                                    Ver CV
                                </button>
                                <button
                                    onClick={() => handleDeleteCandidate(candidate.id)}
                                    className="text-red-600 hover:text-red-900 ml-2"
                                    disabled={deleteLoading === candidate.id}
                                >
                                    {deleteLoading === candidate.id ? 'Eliminando...' : 'Eliminar registro'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}; 