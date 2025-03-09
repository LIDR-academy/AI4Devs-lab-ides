// src/components/CandidateForm/CandidateForm.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  IconButton,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styles from "./CandidateForm.module.css";
import { candidateService } from "../../services/api";

const candidateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

interface CandidateFormProps {
  onClose: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      education: "",
      experience: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (fileExtension === "pdf" || fileExtension === "docx") {
        setResumeFile(file);
      } else {
        setResumeFile(null);
        setFileError("Please upload a PDF or DOCX file");
      }
    }
  };

  const onSubmit = async (data: CandidateFormValues) => {
    if (!resumeFile) {
      setFileError("Please upload a resume file");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      formData.append("resume", resumeFile);

      await candidateService.createCandidate(formData);

      toast.success("Candidate added successfully!");
      reset();
      setResumeFile(null);
      onClose();
    } catch (error) {
      console.error("Error submitting candidate:", error);
      toast.error("Failed to add candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} className={styles.formContainer}>
      <Box className={styles.formHeader}>
        <Typography variant="h5" component="h2">
          Add New Candidate
        </Typography>
        <IconButton onClick={onClose} aria-label="Close form" size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        noValidate
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={loading}
                  inputProps={{
                    "aria-required": "true",
                    "aria-invalid": !!errors.firstName,
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  fullWidth
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={loading}
                  inputProps={{
                    "aria-required": "true",
                    "aria-invalid": !!errors.lastName,
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={loading}
                  inputProps={{
                    "aria-required": "true",
                    "aria-invalid": !!errors.email,
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={loading}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address"
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  disabled={loading}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Education"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="E.g., BS in Computer Science, Harvard University, 2018-2022"
                  error={!!errors.education}
                  helperText={errors.education?.message}
                  disabled={loading}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Work Experience"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="E.g., Software Engineer at Google, 2022-Present"
                  error={!!errors.experience}
                  helperText={errors.experience?.message}
                  disabled={loading}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled={loading}
              className={styles.uploadButton}
              fullWidth
            >
              {resumeFile ? resumeFile.name : "Upload Resume (PDF/DOCX)"}
              <input
                data-testid="resume-file-input"
                type="file"
                hidden
                accept=".pdf,.docx"
                onChange={handleFileChange}
                aria-describedby="resume-file-error"
              />
            </Button>
            {fileError && (
              <FormHelperText error id="resume-file-error">
                {fileError}
              </FormHelperText>
            )}
            {resumeFile && (
              <Typography variant="caption" display="block" gutterBottom>
                File selected: {resumeFile.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} className={styles.actionButtons}>
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CandidateForm;
