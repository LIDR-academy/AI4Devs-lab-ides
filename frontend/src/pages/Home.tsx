import { Typography, Box } from '@mui/material';
import CandidateList from '@/components/CandidateList/CandidateList';

export default function Home() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Panel de Gestión
      </Typography>
      <CandidateList />
    </Box>
  );
} 