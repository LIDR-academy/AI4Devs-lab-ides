-- Restricciones para la tabla education
ALTER TABLE education
ADD CONSTRAINT education_date_check 
CHECK (start_date <= end_date);

-- Restricciones para la tabla work_experience
ALTER TABLE work_experience
ADD CONSTRAINT work_experience_date_check 
CHECK (start_date <= end_date);

-- Restricciones para la tabla documents
ALTER TABLE documents
ADD CONSTRAINT document_file_type_check 
CHECK (file_type IN ('PDF', 'DOCX')),
ADD CONSTRAINT document_file_size_check 
CHECK (file_size <= 5242880); -- 5MB en bytes

-- Índices para mejorar el rendimiento
CREATE INDEX idx_education_candidate_id ON education(candidate_id);
CREATE INDEX idx_work_experience_candidate_id ON work_experience(candidate_id);
CREATE INDEX idx_candidate_email ON candidates(email); 