import React, { useEffect, useState } from 'react';
import { 
  Autocomplete, 
  Box, 
  Chip, 
  TextField, 
  Typography 
} from '@mui/material';
import { useFormikContext } from 'formik';
import { Tag } from '../../types';
import { getTags } from '../../services/api';

const TagsFormField: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<{ tags: Tag[] }>();
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const response = await getTags();
        if (response.success && response.data) {
          setAvailableTags(response.data);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, []);
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Etiquetas
      </Typography>
      
      <Autocomplete
        multiple
        id="tags"
        options={availableTags}
        value={values.tags}
        loading={isLoading}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option.name}
              {...getTagProps({ index })}
              key={option.id}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Etiquetas"
            placeholder="Selecciona etiquetas"
            helperText="Selecciona las etiquetas que mejor describen al candidato"
          />
        )}
        onChange={(_, newValue) => {
          setFieldValue('tags', newValue);
        }}
      />
    </Box>
  );
};

export default TagsFormField; 