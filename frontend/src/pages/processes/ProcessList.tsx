import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { selectionProcessApi, candidateApi } from '../../services/api';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface SelectionProcess {
  id: string;
  title: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string | null;
  position: string;
  candidate: Candidate;
  stages: {
    id: string;
    name: string;
    status: string;
  }[];
}

const ProcessList: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryCandidateId = queryParams.get('candidateId');
  
  const effectiveCandidateId = candidateId || queryCandidateId;
  
  const [processes, setProcesses] = useState<SelectionProcess[]>([]);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let processesData;
        
        if (effectiveCandidateId) {
          // Fetch processes for a specific candidate
          const candidateResponse = await candidateApi.getById(effectiveCandidateId);
          setCandidate(candidateResponse.data.data.candidate);
          
          const processesResponse = await selectionProcessApi.getByCandidate(effectiveCandidateId);
          processesData = processesResponse.data.data.selectionProcesses;
        } else {
          // Fetch all processes
          const response = await selectionProcessApi.getAll();
          processesData = response.data.data.selectionProcesses;
        }
        
        setProcesses(processesData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch selection processes. Please try again later.');
        console.error('Error fetching processes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [effectiveCandidateId]);

  const filteredProcesses = processes.filter(process => {
    const searchString = searchTerm.toLowerCase();
    return (
      process.title.toLowerCase().includes(searchString) ||
      process.position.toLowerCase().includes(searchString) ||
      `${process.candidate.firstName} ${process.candidate.lastName}`.toLowerCase().includes(searchString)
    );
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
        <h1 className="text-2xl font-bold text-gray-800">
          {candidate 
            ? `Selection Processes for ${candidate.firstName} ${candidate.lastName}` 
            : 'All Selection Processes'}
        </h1>
        <div className="flex space-x-3">
          {candidate && (
            <Link
              to={`/candidates/${candidate.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Back to Candidate"
              tabIndex={0}
            >
              Back to Candidate
            </Link>
          )}
          <Link
            to={effectiveCandidateId ? `/processes/new?candidateId=${effectiveCandidateId}` : '/processes/new'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Add New Process"
            tabIndex={0}
          >
            Add New Process
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search processes..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search processes"
            tabIndex={0}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {filteredProcesses.length === 0 ? (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No selection processes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new selection process.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Link
                to={effectiveCandidateId ? `/processes/new?candidateId=${effectiveCandidateId}` : '/processes/new'}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add New Process
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
                  Process
                </th>
                {!candidate && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProcesses.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          <Link to={`/processes/${process.id}`} className="hover:text-blue-600">
                            {process.title}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          Started on {new Date(process.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  {!candidate && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <Link to={`/candidates/${process.candidate.id}`} className="hover:text-blue-600">
                          {process.candidate.firstName} {process.candidate.lastName}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">{process.candidate.email}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{process.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      process.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                      process.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {process.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {process.stages.map((stage, index) => (
                        <div 
                          key={stage.id} 
                          className="flex-1 h-2 max-w-[30px]"
                        >
                          <div className={`h-full w-full ${
                            index === 0 ? 'rounded-l-full' : 
                            index === process.stages.length - 1 ? 'rounded-r-full' : ''
                          } ${
                            stage.status === 'PENDING' ? 'bg-gray-300' :
                            stage.status === 'COMPLETED' ? 'bg-blue-300' :
                            stage.status === 'PASSED' ? 'bg-green-300' :
                            'bg-red-300'
                          }`}></div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/processes/${process.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label={`View ${process.title}`}
                        tabIndex={0}
                      >
                        View
                      </Link>
                      <Link
                        to={`/processes/${process.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                        aria-label={`Edit ${process.title}`}
                        tabIndex={0}
                      >
                        Edit
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

export default ProcessList; 