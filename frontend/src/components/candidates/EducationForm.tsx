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
import { Education } from '../../types/candidate';

interface EducationFormProps {
  values: Education[];
  errors: FormikErrors<{education: Education[]}>;
  touched: FormikTouched<{education: Education[]}>;
  arrayHelpers: FieldArrayRenderProps;
}

const EducationForm: React.FC<EducationFormProps> = ({ values, errors, touched, arrayHelpers }) => {
  // Helper para verificar si hay un error en un campo específico
  const hasError = (index: number, field: keyof Education): boolean => {
    if (!touched.education || !errors.education) return false;
    
    const touchedEducation = touched.education as FormikTouched<Education>[] | undefined;
    const errorsEducation = errors.education as FormikErrors<Education>[] | undefined;
    
    if (!Array.isArray(touchedEducation) || !Array.isArray(errorsEducation)) return false;
    
    return Boolean(
      touchedEducation[index] && 
      touchedEducation[index][field] && 
      errorsEducation[index] && 
      errorsEducation[index][field]
    );
  };

  // Helper para obtener el mensaje de error
  const getErrorMessage = (index: number, field: keyof Education): string => {
    if (!hasError(index, field)) return '';
    
    const errorsEducation = errors.education as FormikErrors<Education>[] | undefined;
    
    if (!Array.isArray(errorsEducation)) return '';
    
    return errorsEducation[index] && 
           typeof errorsEducation[index] !== 'string' ? 
           (errorsEducation[index][field] as string) || '' : '';
  };

  return (
    <div>
      {values && values.length > 0 ? (
        values.map((education, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Educación #{index + 1}
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
                    name={`education[${index}].institution`}
                    label="Institución"
                    variant="outlined"
                    error={hasError(index, 'institution')}
                    helperText={getErrorMessage(index, 'institution')}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name={`education[${index}].degree`}
                    label="Título"
                    variant="outlined"
                    error={hasError(index, 'degree')}
                    helperText={getErrorMessage(index, 'degree')}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name={`education[${index}].fieldOfStudy`}
                    label="Campo de Estudio"
                    variant="outlined"
                    error={hasError(index, 'fieldOfStudy')}
                    helperText={getErrorMessage(index, 'fieldOfStudy')}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    type="date"
                    name={`education[${index}].startDate`}
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
                    name={`education[${index}].endDate`}
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
                    name={`education[${index}].description`}
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
        <Typography color="text.secondary">No hay información de educación</Typography>
      )}
      
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => arrayHelpers.push({
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          description: ''
        })}
        sx={{ mt: 2 }}
      >
        Añadir Educación
      </Button>
    </div>
  );
};

export default EducationForm;
