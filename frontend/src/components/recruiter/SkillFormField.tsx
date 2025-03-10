import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Grid, 
  IconButton, 
  MenuItem, 
  TextField, 
  Typography 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { FieldArray, useFormikContext, FormikErrors } from 'formik';
import { Skill, SkillLevel } from '../../types';
import { getSkillCategories } from '../../services/api';

interface FormValues {
  skills: Skill[];
}

type FormErrors = FormikErrors<FormValues>;

const SkillFormField: React.FC = () => {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext<FormValues>();
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getSkillCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Helper para determinar si se debe mostrar un error
  const shouldShowError = (index: number, field: keyof Skill): boolean => {
    if (!touched.skills?.[index] || !errors.skills?.[index]) return false;
    
    const error = errors.skills[index];
    // Verificar si el error es un objeto (FormikErrors<Skill>) y no un string
    return typeof error === 'object' && error !== null && field in error;
  };
  
  // Helper para obtener el mensaje de error
  const getErrorMessage = (index: number, field: keyof Skill): string | undefined => {
    if (!shouldShowError(index, field)) return undefined;
    
    const error = errors.skills?.[index];
    if (typeof error === 'object' && error !== null) {
      return error[field] as string;
    }
    return undefined;
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Habilidades
      </Typography>
      
      <FieldArray
        name="skills"
        render={arrayHelpers => (
          <>
            {values.skills && values.skills.length > 0 ? (
              values.skills.map((skill, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      name={`skills[${index}].name`}
                      value={skill.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={shouldShowError(index, 'name')}
                      helperText={getErrorMessage(index, 'name')}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <TextField
                      select
                      fullWidth
                      label="Categoría"
                      name={`skills[${index}].category`}
                      value={skill.category || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <TextField
                      select
                      fullWidth
                      label="Nivel"
                      name={`skills[${index}].level`}
                      value={skill.level}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={shouldShowError(index, 'level')}
                      helperText={getErrorMessage(index, 'level')}
                    >
                      {Object.values(SkillLevel).map((level) => (
                        <MenuItem key={level} value={level}>
                          {level === SkillLevel.BEGINNER ? 'Principiante' :
                            level === SkillLevel.INTERMEDIATE ? 'Intermedio' :
                            level === SkillLevel.ADVANCED ? 'Avanzado' : 'Experto'}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={() => arrayHelpers.remove(index)}
                      aria-label="Eliminar habilidad"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Typography color="textSecondary" sx={{ mt: 2, mb: 2 }}>
                No se han agregado habilidades
              </Typography>
            )}
            
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={() => arrayHelpers.push({ name: '', level: SkillLevel.INTERMEDIATE })}
            >
              Añadir Habilidad
            </Button>
          </>
        )}
      />
    </Box>
  );
};

export default SkillFormField; 