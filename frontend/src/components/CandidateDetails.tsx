import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { candidateService } from '../services/api';

// Define the Candidate type based on our needs
type Candidate = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  linkedinProfile?: string;
  desiredSalary?: string;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    summary?: string;
  }>;
  workExperience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    summary?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    level?: string;
  }>;
  documents: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    uploadDate: string;
  }>;
};

const CandidateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await candidateService.getById(parseInt(id));
        if (response.success) {
          setCandidate(response.data);
        } else {
          setError(response.message || t('notifications.error.somethingWentWrong'));
        }
      } catch (err) {
        console.error('Error fetching candidate:', err);
        setError(t('notifications.error.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id, t]);

  const handleDelete = async () => {
    if (!candidate) return;

    if (window.confirm(t('candidates.confirmDelete'))) {
      try {
        const response = await candidateService.delete(candidate.id);
        if (response.success) {
          navigate('/candidates');
        } else {
          setError(response.message || t('notifications.error.somethingWentWrong'));
        }
      } catch (err) {
        console.error('Error deleting candidate:', err);
        setError(t('notifications.error.somethingWentWrong'));
      }
    }
  };

  // Format date from ISO to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('candidates.notFound')}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {candidate.firstName} {candidate.lastName}
          </h1>
          <div className="flex space-x-2">
            <Link
              to="/candidates"
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {t('common.back')}
            </Link>
            <Link
              to={`/candidates/${candidate.id}/edit`}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {t('common.edit')}
            </Link>
            <button
              onClick={handleDelete}
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {t('common.delete')}
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            {t('candidateForm.steps.personalInfo')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('candidateForm.personalInfo.email')}</p>
              <p className="mt-1">{candidate.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('candidateForm.personalInfo.phone')}</p>
              <p className="mt-1">{candidate.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('candidateForm.personalInfo.address')}</p>
              <p className="mt-1">{candidate.address}</p>
            </div>
            {candidate.linkedinProfile && (
              <div>
                <p className="text-sm font-medium text-gray-500">{t('candidateForm.personalInfo.linkedinProfile')}</p>
                <p className="mt-1">
                  <a href={candidate.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {candidate.linkedinProfile}
                  </a>
                </p>
              </div>
            )}
            {candidate.desiredSalary && (
              <div>
                <p className="text-sm font-medium text-gray-500">{t('candidateForm.personalInfo.desiredSalary')}</p>
                <p className="mt-1">{candidate.desiredSalary}</p>
              </div>
            )}
          </div>
        </section>

        {/* Education */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            {t('candidateForm.steps.education')}
          </h2>
          {candidate.education.length === 0 ? (
            <p className="text-gray-500 italic">{t('candidateDetails.noEducation')}</p>
          ) : (
            <div className="space-y-4">
              {candidate.education.map((edu) => (
                <div key={edu.id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">{edu.institution}</h3>
                  <p className="text-gray-700">{edu.degree}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                  {edu.summary && <p className="mt-2 text-gray-600">{edu.summary}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Work Experience */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            {t('candidateForm.steps.experience')}
          </h2>
          {candidate.workExperience.length === 0 ? (
            <p className="text-gray-500 italic">{t('candidateDetails.noExperience')}</p>
          ) : (
            <div className="space-y-4">
              {candidate.workExperience.map((exp) => (
                <div key={exp.id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">{exp.company}</h3>
                  <p className="text-gray-700">{exp.position}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </p>
                  {exp.summary && <p className="mt-2 text-gray-600">{exp.summary}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Skills and Languages */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            {t('candidateForm.steps.skills')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{t('candidateForm.skills.skills')}</h3>
              {candidate.skills.length === 0 ? (
                <p className="text-gray-500 italic">{t('candidateDetails.noSkills')}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{t('candidateForm.skills.languages')}</h3>
              {candidate.languages.length === 0 ? (
                <p className="text-gray-500 italic">{t('candidateDetails.noLanguages')}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {candidate.languages.map((language) => (
                    <span
                      key={language.id}
                      className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {language.name}
                      {language.level && ` (${language.level})`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Documents */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            {t('candidateForm.steps.documents')}
          </h2>
          {candidate.documents.length === 0 ? (
            <p className="text-gray-500 italic">{t('candidateDetails.noDocuments')}</p>
          ) : (
            <div className="space-y-2">
              {candidate.documents.map((doc) => (
                <div key={doc.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <svg
                    className="w-6 h-6 text-gray-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="font-medium">{doc.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {t('candidateDetails.uploadedOn')} {formatDate(doc.uploadDate)}
                    </p>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-lg text-sm transition duration-200"
                  >
                    {t('candidateDetails.viewDocument')}
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CandidateDetails;