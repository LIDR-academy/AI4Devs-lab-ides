import React, { useState, useEffect } from 'react';
import './App.css';
import AddCandidateForm from './components/AddCandidateForm';
import CandidateTable from './components/CandidateTable';

// Import or define the Candidate interface to upload to the database
interface Education {
  degree: string;
}

interface WorkExperience {
  position: string;
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

function App() {
  const [showForm, setShowForm] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const handleButtonClick = () => {
    setShowForm(!showForm);
  };

  const fetchCandidates = async () => {
    try {
      const response = await fetch('http://localhost:3010/api/candidates');
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleCandidateAdded = () => {
    setShowForm(false);
    fetchCandidates(); // Refresh the list after adding a candidate
  };

  const deleteCandidate = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        const response = await fetch(`http://localhost:3010/api/candidates/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Update the candidates state by removing the deleted candidate
          setCandidates(candidates.filter((candidate) => candidate.id !== id));
          alert('Candidate deleted successfully!');
        } else {
          console.error('Failed to delete candidate');
          alert('Failed to delete candidate.');
        }
      } catch (error) {
        console.error('Error deleting candidate:', error);
        alert('An error occurred while deleting the candidate.');
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleButtonClick} className="add-candidate-button">
          {showForm ? 'Close Form' : 'Add Candidate'}
        </button>
        {showForm && <AddCandidateForm onCandidateAdded={handleCandidateAdded} />}
        <CandidateTable candidates={candidates} onDeleteCandidate={deleteCandidate} />
      </header>
    </div>
  );
}

export default App;
