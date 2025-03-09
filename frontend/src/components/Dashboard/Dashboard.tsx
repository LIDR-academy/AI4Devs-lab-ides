import React, { useState, useEffect } from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CandidateForm from "../CandidateForm/CandidateForm";
import styles from "./Dashboard.module.css";
import { candidateService } from "../../services/api";
import { Candidate } from "../../types/candidate";

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await candidateService.getCandidates();
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <Container className={styles.dashboard}>
      <Box className={styles.header}>
        <Typography variant="h4" component="h1">
          Recruiter Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
          aria-label="Add new candidate"
          className={styles.addButton}
        >
          Add Candidate
        </Button>
      </Box>

      {showForm && <CandidateForm onClose={() => setShowForm(false)} />}

      <Box className={styles.candidatesList}>
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <Box key={candidate.id} className={styles.candidateItem}>
              <Typography variant="h6">
                {candidate.firstName} {candidate.lastName}
              </Typography>
              <Typography variant="body1">{candidate.email}</Typography>
              <Typography variant="body2">{candidate.phone}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body1">No candidates found</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
