import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Snackbar, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import { CandidateFormData } from '../types/candidate';
import { candidateService } from '../services/candidateService';

const CandidateForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<CandidateFormData>();
  
  const onSubmit: SubmitHandler<CandidateFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Add the file to the data if selected
      if (selectedFile) {
        data.cv = selectedFile;
      }
      
      await candidateService.addCandidate(data);
      
      setSuccess(true);
      reset(); // Reset form after successful submission
      setSelectedFile(null);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };
  
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Candidate
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          {/* First Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name *"
              {...register('firstName', { 
                required: 'First name is required' 
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          
          {/* Last Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name *"
              {...register('lastName', { 
                required: 'Last name is required' 
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          
          {/* Email */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email *"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          
          {/* Phone */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              {...register('phone')}
            />
          </Grid>
          
          {/* Address */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address"
              {...register('address')}
            />
          </Grid>
          
          {/* Education */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Education"
              multiline
              rows={3}
              {...register('education')}
            />
          </Grid>
          
          {/* Work Experience */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Work Experience"
              multiline
              rows={3}
              {...register('workExperience')}
            />
          </Grid>
          
          {/* CV Upload */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                CV Upload (PDF or DOCX)
              </Typography>
              <input
                type="file"
                accept=".pdf,.docx"
                id="cv-upload"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="cv-upload">
                <Button 
                  variant="outlined" 
                  component="span"
                >
                  Choose File
                </Button>
              </label>
              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {selectedFile.name}
                </Typography>
              )}
            </Box>
          </Grid>
          
          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Submitting...' : 'Add Candidate'}
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Success/Error Messages */}
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Candidate added successfully!
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CandidateForm; 