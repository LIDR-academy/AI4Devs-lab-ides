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
import { Education } from '../../types';

interface FormValues {
  educations: Education[];
}

const EducationFormField: React.FC = () => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = 
    useFormikContext<FormValues>();
  
  // Helper para determinar si se debe mostrar un error
  const shouldShowError = (index: number, field: keyof Education): boolean => {
    if (!touched.educations?.[index] || !errors.educations?.[index]) return false;
    
    const error = errors.educations[index];
    // Verificar si el error es un objeto (FormikErrors<Education>) y no un string
    return typeof error === 'object' && error !== null && field in error;
  };
  
  // Helper para obtener el mensaje de error
  const getErrorMessage = (index: number, field: keyof Education): string | undefined => {
    if (!shouldShowError(index, field)) return undefined;
    
    const error = errors.educations?.[index];
    if (typeof error === 'object' && error !== null) {
      return error[field] as string;
    }
    return undefined;
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Formación
      </Typography>
      
      <FieldArray
        name="educations"
        render={arrayHelpers => (
          <>
            {values.educations && values.educations.length > 0 ? (
              values.educations.map((education, index) => (
                <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Institución"
                        name={`educations[${index}].institution`}
                        value={education.institution}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={shouldShowError(index, 'institution')}
                        helperText={getErrorMessage(index, 'institution')}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Título"
                        name={`educations[${index}].degree`}
                        value={education.degree}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={shouldShowError(index, 'degree')}
                        helperText={getErrorMessage(index, 'degree')}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Fecha de inicio"
                        type="date"
                        name={`educations[${index}].startDate`}
                        value={education.startDate instanceof Date 
                          ? education.startDate.toISOString().split('T')[0] 
                          : education.startDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        InputLabelProps={{ shrink: true }}
                        error={shouldShowError(index, 'startDate')}
                        helperText={getErrorMessage(index, 'startDate')}
                      />
                    </Grid>
                    
                    {!education.current && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Fecha de finalización"
                          type="date"
                          name={`educations[${index}].endDate`}
                          value={education.endDate instanceof Date 
                            ? education.endDate.toISOString().split('T')[0] 
                            : education.endDate || ''}
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
                            checked={education.current}
                            onChange={(e) => {
                              setFieldValue(`educations[${index}].current`, e.target.checked);
                              if (e.target.checked) {
                                setFieldValue(`educations[${index}].endDate`, undefined);
                              }
                            }}
                            name={`educations[${index}].current`}
                          />
                        }
                        label="Actualmente estudiando aquí"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Descripción"
                        name={`educations[${index}].description`}
                        value={education.description || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      onClick={() => arrayHelpers.remove(index)}
                      aria-label="Eliminar formación"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary" sx={{ mt: 2, mb: 2 }}>
                No se ha añadido información sobre formación
              </Typography>
            )}
            
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={() => 
                arrayHelpers.push({
                  institution: '',
                  degree: '',
                  startDate: '',
                  current: false
                })
              }
            >
              Añadir Formación
            </Button>
          </>
        )}
      />
    </Box>
  );
};

export default EducationFormField; 