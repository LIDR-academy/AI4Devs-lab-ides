import React from 'react';
import { 
  Box, 
  Button, 
  Checkbox,
  FormControlLabel,
  Grid, 
  IconButton, 
  TextField, 
  Typography 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { FieldArray, useFormikContext, FormikErrors } from 'formik';
import { WorkExperience } from '../../types';

interface FormValues {
  experiences: WorkExperience[];
}

const ExperienceFormField: React.FC = () => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = 
    useFormikContext<FormValues>();
  
  // Helper para determinar si se debe mostrar un error
  const shouldShowError = (index: number, field: keyof WorkExperience): boolean => {
    if (!touched.experiences?.[index] || !errors.experiences?.[index]) return false;
    
    const error = errors.experiences[index];
    // Verificar si el error es un objeto (FormikErrors<WorkExperience>) y no un string
    return typeof error === 'object' && error !== null && field in error;
  };
  
  // Helper para obtener el mensaje de error
  const getErrorMessage = (index: number, field: keyof WorkExperience): string | undefined => {
    if (!shouldShowError(index, field)) return undefined;
    
    const error = errors.experiences?.[index];
    if (typeof error === 'object' && error !== null) {
      return error[field] as string;
    }
    return undefined;
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Experiencia Laboral
      </Typography>
      
      <FieldArray
        name="experiences"
        render={arrayHelpers => (
          <>
            {values.experiences && values.experiences.length > 0 ? (
              values.experiences.map((experience, index) => (
                <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Empresa"
                        name={`experiences[${index}].company`}
                        value={experience.company}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={shouldShowError(index, 'company')}
                        helperText={getErrorMessage(index, 'company')}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Puesto"
                        name={`experiences[${index}].position`}
                        value={experience.position}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={shouldShowError(index, 'position')}
                        helperText={getErrorMessage(index, 'position')}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Fecha de inicio"
                        type="date"
                        name={`experiences[${index}].startDate`}
                        value={experience.startDate instanceof Date 
                          ? experience.startDate.toISOString().split('T')[0] 
                          : experience.startDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        InputLabelProps={{ shrink: true }}
                        error={shouldShowError(index, 'startDate')}
                        helperText={getErrorMessage(index, 'startDate')}
                      />
                    </Grid>
                    
                    {!experience.current && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Fecha de finalización"
                          type="date"
                          name={`experiences[${index}].endDate`}
                          value={experience.endDate instanceof Date 
                            ? experience.endDate.toISOString().split('T')[0] 
                            : experience.endDate || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          InputLabelProps={{ shrink: true }}
                          error={shouldShowError(index, 'endDate')}
                          helperText={getErrorMessage(index, 'endDate')}
                        />
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={experience.current}
                            onChange={(e) => {
                              setFieldValue(`experiences[${index}].current`, e.target.checked);
                              if (e.target.checked) {
                                setFieldValue(`experiences[${index}].endDate`, undefined);
                              }
                            }}
                            name={`experiences[${index}].current`}
                          />
                        }
                        label="Trabajo actualmente aquí"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Descripción"
                        name={`experiences[${index}].description`}
                        value={experience.description || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      onClick={() => arrayHelpers.remove(index)}
                      aria-label="Eliminar experiencia"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary" sx={{ mt: 2, mb: 2 }}>
                No se ha añadido información sobre experiencia laboral
              </Typography>
            )}
            
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={() => 
                arrayHelpers.push({
                  company: '',
                  position: '',
                  startDate: '',
                  current: false
                })
              }
            >
              Añadir Experiencia
            </Button>
          </>
        )}
      />
    </Box>
  );
};

export default ExperienceFormField; 