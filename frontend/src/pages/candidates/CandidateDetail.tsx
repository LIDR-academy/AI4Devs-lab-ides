import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, 
  Button, 
  Typography,
  Divider,
  IconButton,
  Box
} from '@mui/material';
import { Edit as EditIcon, Upload as UploadIcon } from '@mui/icons-material';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Candidates.css';

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<any>(null);

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    try {
      const response = await api.get(`/candidates/${id}`);
      setCandidate(response.data.data);
    } catch (error) {
      console.error('Failed to fetch candidate:', error);
      toast.error('Failed to load candidate details');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/documents/upload/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Document uploaded successfully');
      fetchCandidate();
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error('Failed to upload document');
    }
  };

  if (!candidate) return <div>Loading...</div>;

  return (
    <div className="candidate-form-container">
      <div className="header-actions">
        <h1>Candidate Details</h1>
        <div className="action-buttons">
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/dashboard/candidates/${id}/edit`)}
          >
            Edit
          </Button>
          <input
            type="file"
            id="cv-upload"
            hidden
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
          />
          <label htmlFor="cv-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
            >
              Upload CV
            </Button>
          </label>
        </div>
      </div>

      <div className="form-section">
        <Paper className="section-content">
          <h2 className="form-section-title">Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <Typography variant="subtitle2">Full Name</Typography>
              <Typography>{`${candidate.firstName} ${candidate.lastName}`}</Typography>
            </div>
            <div className="info-item">
              <Typography variant="subtitle2">Email</Typography>
              <Typography>{candidate.email}</Typography>
            </div>
            <div className="info-item">
              <Typography variant="subtitle2">Phone</Typography>
              <Typography>{candidate.phoneNumber}</Typography>
            </div>
            <div className="info-item">
              <Typography variant="subtitle2">Address</Typography>
              <Typography>{candidate.address}</Typography>
            </div>
          </div>
        </Paper>
      </div>

      <div className="form-section">
        <Paper className="section-content">
          <h2 className="form-section-title">Education</h2>
          {candidate.education.map((edu: any, index: number) => (
            <div key={index} className="detail-item">
              <Typography variant="h6">{edu.institution}</Typography>
              <Typography>{`${edu.degree} in ${edu.fieldOfStudy}`}</Typography>
              <Typography variant="body2" color="textSecondary">
                {`${new Date(edu.startDate).toLocaleDateString()} - ${
                  edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'
                }`}
              </Typography>
              {index < candidate.education.length - 1 && <Divider className="item-divider" />}
            </div>
          ))}
        </Paper>
      </div>

      <div className="form-section">
        <Paper className="section-content">
          <h2 className="form-section-title">Experience</h2>
          {candidate.experience.map((exp: any, index: number) => (
            <div key={index} className="detail-item">
              <Typography variant="h6">{exp.company}</Typography>
              <Typography>{`${exp.position} | ${exp.location}`}</Typography>
              <Typography variant="body2" color="textSecondary">
                {`${new Date(exp.startDate).toLocaleDateString()} - ${
                  exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'
                }`}
              </Typography>
              <Typography className="description">{exp.description}</Typography>
              {index < candidate.experience.length - 1 && <Divider className="item-divider" />}
            </div>
          ))}
        </Paper>
      </div>

      {candidate.documents?.length > 0 && (
        <div className="form-section">
          <Paper className="section-content">
            <h2 className="form-section-title">Documents</h2>
            {candidate.documents.map((doc: any) => (
              <div key={doc.id} className="document-item">
                <Typography>{doc.originalName}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(`/api/documents/${doc.filename}`, '_blank')}
                >
                  Download
                </Button>
              </div>
            ))}
          </Paper>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail;