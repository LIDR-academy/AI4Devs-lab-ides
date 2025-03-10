import React from 'react';
import { 
  Grid, 
  TextField, 
  Button, 
  IconButton, 
  Card, 
  CardContent, 
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Field, FieldArrayRenderProps, FormikErrors, FormikTouched } from 'formik';
import { Experience } from '../../types/candidate';

interface ExperienceFormProps {
  values: Experience[];
  errors: FormikErrors<{experience: Experience[]}>;
  touched: FormikTouched<{experience: Experience[]}>;
  arrayHelpers: FieldArrayRenderProps;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ values, errors, touched, arrayHelpers }) => {
  // Helper para verificar si hay un error en un campo específico
  const hasError = (index: number, field: keyof Experience): boolean => {
    if (!touched.experience || !errors.experience) return false;
    
    const touchedExperience = touched.experience as FormikTouched<Experience>[] | undefined;
    const errorsExperience = errors.experience as FormikErrors<Experience>[] | undefined;
    
    if (!Array.isArray(touchedExperience) || !Array.isArray(errorsExperience)) return false;
    
    return Boolean(
      touchedExperience[index] && 
      touchedExperience[index][field] && 
      errorsExperience[index] && 
      errorsExperience[index][field]
    );
  };

  // Helper para obtener el mensaje de error
  const getErrorMessage = (index: number, field: keyof Experience): string => {
    if (!hasError(index, field)) return '';
    
    const errorsExperience = errors.experience as FormikErrors<Experience>[] | undefined;
    
    if (!Array.isArray(errorsExperience)) return '';
    
    return errorsExperience[index] && 
           typeof errorsExperience[index] !== 'string' ? 
           (errorsExperience[index][field] as string) || '' : '';
  };

  return (
    <div>
      {values && values.length > 0 ? (
        values.map((experience, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Experiencia #{index + 1}
                </Typography>
                {values.length > 1 && (
                  <IconButton 
                    color="error" 
                    onClick={() => arrayHelpers.remove(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name={`experience[${index}].company`}
                    label="Empresa"
                    variant="outlined"
                    error={hasError(index, 'company')}
                    helperText={getErrorMessage(index, 'company')}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name={`experience[${index}].position`}
                    label="Cargo"
                    variant="outlined"
                    error={hasError(index, 'position')}
                    helperText={getErrorMessage(index, 'position')}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name={`experience[${index}].location`}
                    label="Ubicación"
                    variant="outlined"
                    error={hasError(index, 'location')}
                    helperText={getErrorMessage(index, 'location')}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    type="date"
                    name={`experience[${index}].startDate`}
                    label="Fecha de Inicio"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={hasError(index, 'startDate')}
                    helperText={getErrorMessage(index, 'startDate')}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    type="date"
                    name={`experience[${index}].endDate`}
                    label="Fecha de Fin (opcional)"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={hasError(index, 'endDate')}
                    helperText={getErrorMessage(index, 'endDate')}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    multiline
                    rows={3}
                    name={`experience[${index}].description`}
                    label="Descripción (opcional)"
                    variant="outlined"
                    error={hasError(index, 'description')}
                    helperText={getErrorMessage(index, 'description')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography color="text.secondary">No hay información de experiencia laboral</Typography>
      )}
      
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => arrayHelpers.push({
          company: '',
          position: '',
          location: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          description: ''
        })}
        sx={{ mt: 2 }}
      >
        Añadir Experiencia
      </Button>
    </div>
  );
};

export default ExperienceForm;
