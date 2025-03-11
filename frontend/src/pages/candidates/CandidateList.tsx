import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidateApi } from '../../services/api';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
  selectionProcesses: {
    id: string;
    title: string;
    status: string;
  }[];
}

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        const response = await candidateApi.getAll();
        setCandidates(response.data.data.candidates);
        setError(null);
      } catch (err) {
        setError('Failed to fetch candidates. Please try again later.');
        console.error('Error fetching candidates:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(candidate => {
    const fullName = `${candidate.firstName} ${candidate.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Candidates</h1>
        <Link
          to="/candidates/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Add New Candidate"
          tabIndex={0}
        >
          Add New Candidate
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search candidates"
            tabIndex={0}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new candidate.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Link
                to="/candidates/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add New Candidate
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processes
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-800 font-medium">
                          {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          <Link to={`/candidates/${candidate.id}`} className="hover:text-blue-600">
                            {candidate.firstName} {candidate.lastName}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          Added on {new Date(candidate.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{candidate.email}</div>
                    <div className="text-sm text-gray-500">{candidate.phone || 'No phone'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      candidate.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      candidate.status === 'HIRED' ? 'bg-blue-100 text-blue-800' :
                      candidate.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.selectionProcesses.length > 0 ? (
                      <div>
                        <span className="font-medium">{candidate.selectionProcesses.length}</span> process(es)
                        <Link 
                          to={`/processes/candidate/${candidate.id}`}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                      </div>
                    ) : (
                      <span>No processes</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/candidates/${candidate.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label={`View ${candidate.firstName} ${candidate.lastName}`}
                        tabIndex={0}
                      >
                        View
                      </Link>
                      <Link
                        to={`/candidates/${candidate.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                        aria-label={`Edit ${candidate.firstName} ${candidate.lastName}`}
                        tabIndex={0}
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/processes/new?candidateId=${candidate.id}`}
                        className="text-green-600 hover:text-green-900"
                        aria-label={`Add process for ${candidate.firstName} ${candidate.lastName}`}
                        tabIndex={0}
                      >
                        Add Process
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CandidateList; 