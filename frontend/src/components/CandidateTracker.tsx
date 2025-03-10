import React, { useState } from 'react';

interface Candidate {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  stage: string;
  lastUpdated: string;
}

interface StageColumn {
  id: string;
  title: string;
  candidates: Candidate[];
}

const CandidateTracker: React.FC = () => {
  const [stages, setStages] = useState<StageColumn[]>([
    {
      id: 'application',
      title: 'Application Received',
      candidates: [
        { id: 1, name: 'John Doe', position: 'Frontend Developer', email: 'john@example.com', phone: '555-1234', stage: 'application', lastUpdated: '2023-05-15' },
        { id: 2, name: 'Jane Smith', position: 'UX Designer', email: 'jane@example.com', phone: '555-5678', stage: 'application', lastUpdated: '2023-05-16' }
      ]
    },
    {
      id: 'review',
      title: 'CV Review',
      candidates: [
        { id: 3, name: 'Bob Johnson', position: 'Backend Developer', email: 'bob@example.com', phone: '555-9012', stage: 'review', lastUpdated: '2023-05-14' }
      ]
    },
    {
      id: 'interview',
      title: 'Initial Interview',
      candidates: [
        { id: 4, name: 'Alice Williams', position: 'Project Manager', email: 'alice@example.com', phone: '555-3456', stage: 'interview', lastUpdated: '2023-05-12' }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Test',
      candidates: []
    },
    {
      id: 'final',
      title: 'Final Interview',
      candidates: [
        { id: 5, name: 'Charlie Brown', position: 'DevOps Engineer', email: 'charlie@example.com', phone: '555-7890', stage: 'final', lastUpdated: '2023-05-10' }
      ]
    },
    {
      id: 'offer',
      title: 'Offer Sent',
      candidates: []
    },
    {
      id: 'hired',
      title: 'Hired',
      candidates: [
        { id: 6, name: 'David Miller', position: 'Data Scientist', email: 'david@example.com', phone: '555-2345', stage: 'hired', lastUpdated: '2023-05-05' }
      ]
    },
    {
      id: 'rejected',
      title: 'Rejected',
      candidates: [
        { id: 7, name: 'Eva Garcia', position: 'Marketing Specialist', email: 'eva@example.com', phone: '555-6789', stage: 'rejected', lastUpdated: '2023-05-08' }
      ]
    }
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<{[key: number]: string[]}>({
    1: ['Excellent React skills', 'Needs to improve on communication'],
    3: ['Strong backend experience', 'Available to start immediately'],
    5: ['Great cultural fit', 'Salary expectations within range']
  });

  const handleDragStart = (e: React.DragEvent, candidateId: number, currentStage: string) => {
    e.dataTransfer.setData('candidateId', candidateId.toString());
    e.dataTransfer.setData('currentStage', currentStage);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const candidateId = parseInt(e.dataTransfer.getData('candidateId'));
    const currentStage = e.dataTransfer.getData('currentStage');
    
    if (currentStage === targetStage) return;
    
    // Find the candidate in the current stage
    const updatedStages = [...stages];
    const currentStageIndex = updatedStages.findIndex(s => s.id === currentStage);
    const targetStageIndex = updatedStages.findIndex(s => s.id === targetStage);
    
    if (currentStageIndex === -1 || targetStageIndex === -1) return;
    
    const candidateIndex = updatedStages[currentStageIndex].candidates.findIndex(c => c.id === candidateId);
    if (candidateIndex === -1) return;
    
    // Move the candidate to the target stage
    const candidate = {...updatedStages[currentStageIndex].candidates[candidateIndex], stage: targetStage};
    updatedStages[currentStageIndex].candidates.splice(candidateIndex, 1);
    updatedStages[targetStageIndex].candidates.push(candidate);
    
    setStages(updatedStages);
    
    // In a real application, you would also update the backend here
    alert(`Moved ${candidate.name} from ${updatedStages[currentStageIndex].title} to ${updatedStages[targetStageIndex].title}`);
  };

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleAddNote = () => {
    if (!selectedCandidate || note.trim() === '') return;
    
    setNotes(prev => ({
      ...prev,
      [selectedCandidate.id]: [...(prev[selectedCandidate.id] || []), note]
    }));
    
    setNote('');
    
    // In a real application, you would also update the backend here
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Candidate Tracker</h2>
      
      <div className="flex mb-4 space-x-4">
        <div className="flex-1">
          <div className="flex overflow-x-auto pb-4">
            {stages.map(stage => (
              <div 
                key={stage.id}
                className="min-w-[250px] bg-gray-100 rounded-lg mr-4 flex-shrink-0"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="p-3 bg-gray-200 rounded-t-lg font-semibold">
                  {stage.title} ({stage.candidates.length})
                </div>
                <div className="p-2">
                  {stage.candidates.map(candidate => (
                    <div 
                      key={candidate.id}
                      className="bg-white p-3 rounded-lg mb-2 shadow-sm cursor-pointer hover:shadow-md transition"
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate.id, candidate.stage)}
                      onClick={() => handleCandidateClick(candidate)}
                    >
                      <div className="font-medium">{candidate.name}</div>
                      <div className="text-sm text-gray-600">{candidate.position}</div>
                      <div className="text-xs text-gray-500 mt-1">Updated: {candidate.lastUpdated}</div>
                    </div>
                  ))}
                  {stage.candidates.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No candidates in this stage
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedCandidate && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">{selectedCandidate.name}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Position</p>
              <p>{selectedCandidate.position}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Stage</p>
              <p>{stages.find(s => s.id === selectedCandidate.stage)?.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{selectedCandidate.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p>{selectedCandidate.phone}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Notes</h4>
            {notes[selectedCandidate.id]?.length > 0 ? (
              <div className="space-y-2">
                {notes[selectedCandidate.id].map((note, index) => (
                  <div key={index} className="bg-white p-2 rounded border border-gray-200">
                    {note}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No notes for this candidate yet.</p>
            )}
          </div>
          
          <div className="flex">
            <input
              type="text"
              placeholder="Add a note..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition"
              onClick={handleAddNote}
            >
              Add Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateTracker; 