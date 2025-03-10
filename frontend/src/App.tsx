import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import AddCandidatePage from './pages/AddCandidatePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ATS Recruitment System
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/add-candidate">
              Add Candidate
            </Button>
          </Toolbar>
        </AppBar>
        
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/add-candidate" element={<AddCandidatePage />} />
            <Route path="/" element={
              <Box sx={{ my: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Welcome to the ATS Recruitment System
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Manage your candidates efficiently
                </Typography>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/add-candidate"
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Add New Candidate
                </Button>
              </Box>
            } />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
