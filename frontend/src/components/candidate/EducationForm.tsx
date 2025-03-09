import React, { useEffect } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Education } from '../../types/candidate';

const EducationForm: React.FC = () => {
  const { control, register, formState: { errors }, setError, clearErrors } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  // Tipo seguro para acceder a los errores
  const getFieldError = (index: number, field: string) => {
    return errors.education && 
           Array.isArray((errors.education as any)) && 
           (errors.education as any)[index]?.[field]?.message?.toString();
  };

  // Observar cambios en las fechas para validación en tiempo real
  const educationFields = useWatch({
    control,
    name: 'education'
  });

  // Validar fechas en tiempo real
  useEffect(() => {
    if (!educationFields) return;

    educationFields.forEach((education: Education, index: number) => {
      // Solo validar si ambas fechas están presentes
      if (education.startDate && education.endDate) {
        const startDate = new Date(education.startDate);
        const endDate = new Date(education.endDate);

        if (startDate > endDate) {
          setError(`education.${index}.endDate`, {
            type: 'manual',
            message: 'La fecha de finalización debe ser posterior a la fecha de inicio'
          });
        } else {
          clearErrors(`education.${index}.endDate`);
        }
      }
    });
  }, [educationFields, setError, clearErrors]);

  const addEducation = () => {
    append({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: '',
    } as Education);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Educación
      </Typography>
      
      {fields.map((field, index) => (
        <Grid container spacing={2} key={field.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Educación #{index + 1}
              <IconButton 
                color="error" 
                onClick={() => remove(index)}
                sx={{ float: 'right' }}
              >
                <DeleteIcon />
              </IconButton>
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Institución"
              {...register(`education.${index}.institution` as const, { required: 'Este campo es obligatorio' })}
              error={!!getFieldError(index, 'institution')}
              helperText={getFieldError(index, 'institution')}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Título"
              {...register(`education.${index}.degree` as const, { required: 'Este campo es obligatorio' })}
              error={!!getFieldError(index, 'degree')}
              helperText={getFieldError(index, 'degree')}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Campo de estudio"
              {...register(`education.${index}.fieldOfStudy` as const, { required: 'Este campo es obligatorio' })}
              error={!!getFieldError(index, 'fieldOfStudy')}
              helperText={getFieldError(index, 'fieldOfStudy')}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Fecha de inicio"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register(`education.${index}.startDate` as const, { required: 'Este campo es obligatorio' })}
              error={!!getFieldError(index, 'startDate')}
              helperText={getFieldError(index, 'startDate')}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Fecha de finalización"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register(`education.${index}.endDate` as const)}
              error={!!getFieldError(index, 'endDate')}
              helperText={getFieldError(index, 'endDate') || 'Opcional (dejar en blanco para "Actualmente")'}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              multiline
              rows={3}
              {...register(`education.${index}.description` as const)}
            />
          </Grid>
        </Grid>
      ))}
      
      <Button 
        variant="outlined" 
        startIcon={<AddIcon />} 
        onClick={addEducation}
        sx={{ mt: 2 }}
      >
        Añadir educación
      </Button>
    </div>
  );
};

export default EducationForm; 