import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { Candidate } from "../types";
import { candidateService } from "../services/api";

// Esquema de validación
const validationSchema = Yup.object({
  firstName: Yup.string().required("El nombre es obligatorio"),
  lastName: Yup.string().required("El apellido es obligatorio"),
  email: Yup.string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  phone: Yup.string().matches(/^[0-9+\-\s]+$/, "Número de teléfono inválido"),
});

// Valores iniciales
const initialValues: Candidate = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  education: "",
  workExperience: "",
};

const CandidateForm: React.FC = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSubmit = async (
    values: Candidate,
    { resetForm, setSubmitting }: any
  ) => {
    try {
      await candidateService.create(values);
      setSnackbar({
        open: true,
        message: "¡Candidato añadido exitosamente!",
        severity: "success",
      });
      resetForm();
    } catch (error: any) {
      console.error("Error al añadir candidato:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Error al añadir candidato",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Añadir Nuevo Candidato
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="firstName"
                  label="Nombre *"
                  variant="outlined"
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="lastName"
                  label="Apellido *"
                  variant="outlined"
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  label="Email *"
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="phone"
                  label="Teléfono"
                  variant="outlined"
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  name="address"
                  label="Dirección"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  name="education"
                  label="Educación"
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  name="workExperience"
                  label="Experiencia Laboral"
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  * Campos obligatorios
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Añadiendo..." : "Añadir Candidato"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CandidateForm;
