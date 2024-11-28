import React from 'react';

interface Education {
  degree: string;
  // Add other fields as necessary
}

interface WorkExperience {
  position: string;
  // Add other fields as necessary
}

interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  education: Education;
  work_experience: WorkExperience;
  cv_url: string;
}

interface CandidateTableProps {
  candidates: Candidate[];
  onDeleteCandidate: (id: string) => void;
}

const CandidateTable: React.FC<CandidateTableProps> = ({ candidates, onDeleteCandidate }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Education</th>
          <th>Work Experience</th>
          <th>CV</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((candidate) => (
          <tr key={candidate.id}>
            <td>{candidate.first_name}</td>
            <td>{candidate.last_name}</td>
            <td>{candidate.email}</td>
            <td>{candidate.phone}</td>
            <td>{candidate.address}</td>
            <td>{candidate.education.degree}</td>
            <td>{candidate.work_experience.position}</td>
            <td>
              <a
                href={`http://localhost:3010${candidate.cv_url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                📄
              </a>
            </td>
            <td>
              <button className="delete-button" onClick={() => onDeleteCandidate(candidate.id)}>
                🗑️ Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CandidateTable;
