import React, { useEffect } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Experience } from '../../types/candidate';

const ExperienceForm: React.FC = () => {
  const { control, register, formState: { errors }, setError, clearErrors } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  });

  // Tipo seguro para acceder a los errores
  const getFieldError = (index: number, field: string) => {
    return errors.experience && 
           Array.isArray((errors.experience as any)) && 
           (errors.experience as any)[index]?.[field]?.message?.toString();
  };

  // Observar cambios en las fechas para validación en tiempo real
  const experienceFields = useWatch({
    control,
    name: 'experience'
  });

  // Validar fechas en tiempo real
  useEffect(() => {
    if (!experienceFields) return;

    experienceFields.forEach((experience: Experience, index: number) => {
      // Solo validar si ambas fechas están presentes
      if (experience.startDate && experience.endDate) {
        const startDate = new Date(experience.startDate);
        const endDate = new Date(experience.endDate);

        if (startDate > endDate) {
          setError(`experience.${index}.endDate`, {
            type: 'manual',
            message: 'La fecha de finalización debe ser posterior a la fecha de inicio'
          });
        } else {
          clearErrors(`experience.${index}.endDate`);
        }
      }
    });
  }, [experienceFields, setError, clearErrors]);

  const addExperience = () => {
    append({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    } as Experience);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Experiencia Laboral
      </Typography>
      
      {fields.map((field, index) => (
        <Grid container spacing={2} key={field.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Experiencia #{index + 1}
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
              label="Empresa"
              {...register(`experience.${index}.company` as const, { required: 'Este campo es obligatorio' })}
              error={!!getFieldError(index, 'company')}
              helperText={getFieldError(index, 'company')}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Puesto"
              {...register(`experience.${index}.position` as const, { required: 'Este campo es obligatorio' })}
              error={!!getFieldError(index, 'position')}
              helperText={getFieldError(index, 'position')}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha de inicio"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register(`experience.${index}.startDate` as const, { required: 'Este campo es obligatorio' })}
              error={!!getFieldError(index, 'startDate')}
              helperText={getFieldError(index, 'startDate')}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha de finalización"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register(`experience.${index}.endDate` as const)}
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
              {...register(`experience.${index}.description` as const)}
            />
          </Grid>
        </Grid>
      ))}
      
      <Button 
        variant="outlined" 
        startIcon={<AddIcon />} 
        onClick={addExperience}
        sx={{ mt: 2 }}
      >
        Añadir experiencia
      </Button>
    </div>
  );
};

export default ExperienceForm; 