import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { candidateService } from '../services/api';

type Candidate = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const CandidatesList: React.FC = () => {
  const { t } = useTranslation();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await candidateService.getAll();
        if (response.success) {
          setCandidates(response.data);
        } else {
          setError(response.message || t('notifications.error.somethingWentWrong'));
        }
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError(t('notifications.error.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [t]);

  const handleDelete = async (id: number) => {
    if (window.confirm(t('candidates.confirmDelete'))) {
      try {
        const response = await candidateService.delete(id);
        if (response.success) {
          setCandidates(candidates.filter(candidate => candidate.id !== id));
        } else {
          setError(response.message || t('notifications.error.somethingWentWrong'));
        }
      } catch (err) {
        console.error('Error deleting candidate:', err);
        setError(t('notifications.error.somethingWentWrong'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('candidates.title')}</h1>
          <Link
            to="/candidates/add"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {t('candidates.addNew')}
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {candidates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('candidates.noCandidates')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('candidates.table.name')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('candidates.table.email')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('candidates.table.phone')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('candidates.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {candidate.firstName} {candidate.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{candidate.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{candidate.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/candidates/${candidate.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        {t('common.view')}
                      </Link>
                      <Link
                        to={`/candidates/${candidate.id}/edit`}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        {t('common.edit')}
                      </Link>
                      <button
                        onClick={() => handleDelete(candidate.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t('common.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesList;