import { useState, useEffect, useRef } from "react";

/**
 * Componente para la carga de documentos del candidato (CV y foto)
 */
export const DocumentUpload = ({ data, onChange, onSubmit, onPrev }) => {
  const [documents, setDocuments] = useState(data);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({ cv: false, photo: false });
  const [previews, setPreviews] = useState({ cv: null, photo: null });

  const cvInputRef = useRef(null);
  const photoInputRef = useRef(null);

  // Maneja la carga del CV
  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Valida el tipo de archivo
    const isValidType = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(file.type);

    if (!isValidType) {
      setErrors((prev) => ({
        ...prev,
        cv: "El archivo debe ser PDF o DOCX",
      }));
      return;
    }

    // Valida el tamaño del archivo (máx. 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        cv: "El tamaño máximo del archivo es 5MB",
      }));
      return;
    }

    // Actualiza el estado
    setDocuments((prev) => ({
      ...prev,
      cv: file,
    }));

    // Marca como tocado para validación
    setTouched((prev) => ({
      ...prev,
      cv: true,
    }));

    // Elimina errores previos
    setErrors((prev) => ({
      ...prev,
      cv: null,
    }));

    // Crea una vista previa del nombre del archivo
    setPreviews((prev) => ({
      ...prev,
      cv: file.name,
    }));
  };

  // Maneja la carga de la foto
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Valida el tipo de archivo
    const isValidType = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ].includes(file.type);

    if (!isValidType) {
      setErrors((prev) => ({
        ...prev,
        photo: "El archivo debe ser una imagen (JPEG, PNG, GIF, WEBP)",
      }));
      return;
    }

    // Valida el tamaño del archivo (máx. 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        photo: "El tamaño máximo de la imagen es 2MB",
      }));
      return;
    }

    // Actualiza el estado
    setDocuments((prev) => ({
      ...prev,
      photo: file,
    }));

    // Marca como tocado para validación
    setTouched((prev) => ({
      ...prev,
      photo: true,
    }));

    // Elimina errores previos
    setErrors((prev) => ({
      ...prev,
      photo: null,
    }));

    // Crea una vista previa de la imagen
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews((prev) => ({
        ...prev,
        photo: e.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Elimina un documento
  const handleRemoveDocument = (type) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: null,
    }));

    setPreviews((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  // Efecto para propagar cambios al componente padre
  useEffect(() => {
    // Usamos una función de referencia estable para evitar bucles
    const timeoutId = setTimeout(() => {
      onChange(documents);
    }, 0);

    // Limpieza del timeout
    return () => clearTimeout(timeoutId);
  }, [documents]);

  // Validación cuando los campos son marcados como tocados
  useEffect(() => {
    const newErrors = {};

    setErrors(newErrors);
  }, [touched, documents.cv]);

  // Comprueba si el formulario es válido
  const isFormValid = () => {
    // El CV ya no es obligatorio, solo verificamos que no haya errores
    return (!documents.cv || !errors.cv) && (!documents.photo || !errors.photo);
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Marca todos los campos como tocados para mostrar posibles errores
    setTouched({ cv: true, photo: true });

    // Si el formulario es válido, envía los datos
    if (isFormValid()) {
      onSubmit(e);
    }
  };

  return (
    <div className="document-upload">
      <h2 className="document-upload__title">Documentos</h2>

      <div className="document-upload__container">
        {/* CV Upload */}
        <div className="document-upload__section">
          <h3 className="document-upload__subtitle">Currículum Vitae</h3>
          <p className="document-upload__description">
            Sube tu CV en formato PDF o DOCX (máx. 5MB)
          </p>

          <div className="document-upload__dropzone">
            <input
              type="file"
              id="cv-upload"
              ref={cvInputRef}
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleCvUpload}
              className="document-upload__input"
              aria-invalid={!!errors.cv}
              aria-describedby={errors.cv ? "cv-error" : undefined}
            />

            {!previews.cv ? (
              <div
                className="document-upload__placeholder"
                onClick={() => cvInputRef.current.click()}
                onKeyDown={(e) =>
                  e.key === "Enter" && cvInputRef.current.click()
                }
                tabIndex={0}
                role="button"
                aria-label="Subir currículum vitae">
                <span className="document-upload__icon">📄</span>
                <span className="document-upload__text">
                  Haz clic para subir tu CV
                </span>
              </div>
            ) : (
              <div className="document-upload__preview">
                <span className="document-upload__filename">{previews.cv}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument("cv")}
                  className="document-upload__remove"
                  aria-label="Eliminar CV">
                  Eliminar
                </button>
              </div>
            )}
          </div>

          {errors.cv && (
            <p id="cv-error" className="document-upload__error">
              {errors.cv}
            </p>
          )}
        </div>

        {/* Photo Upload */}
        <div className="document-upload__section">
          <h3 className="document-upload__subtitle">Fotografía</h3>
          <p className="document-upload__description">
            Sube una foto en formato JPEG, PNG, GIF o WEBP (máx. 2MB)
          </p>

          <div className="document-upload__dropzone">
            <input
              type="file"
              id="photo-upload"
              ref={photoInputRef}
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handlePhotoUpload}
              className="document-upload__input"
              aria-invalid={!!errors.photo}
              aria-describedby={errors.photo ? "photo-error" : undefined}
            />

            {!previews.photo ? (
              <div
                className="document-upload__placeholder"
                onClick={() => photoInputRef.current.click()}
                onKeyDown={(e) =>
                  e.key === "Enter" && photoInputRef.current.click()
                }
                tabIndex={0}
                role="button"
                aria-label="Subir fotografía">
                <span className="document-upload__icon">📷</span>
                <span className="document-upload__text">
                  Haz clic para subir una foto (opcional)
                </span>
              </div>
            ) : (
              <div className="document-upload__preview document-upload__preview--photo">
                {typeof previews.photo === "string" &&
                previews.photo.startsWith("data:image/") ? (
                  <img
                    src={previews.photo}
                    alt="Vista previa"
                    className="document-upload__image"
                  />
                ) : (
                  <span className="document-upload__filename">
                    {previews.photo}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveDocument("photo")}
                  className="document-upload__remove"
                  aria-label="Eliminar foto">
                  Eliminar
                </button>
              </div>
            )}
          </div>

          {errors.photo && (
            <p id="photo-error" className="document-upload__error">
              {errors.photo}
            </p>
          )}
        </div>
      </div>

      <div className="document-upload__actions">
        <button
          type="button"
          onClick={onPrev}
          className="document-upload__button document-upload__button--secondary">
          Anterior
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="document-upload__button document-upload__button--primary"
          disabled={!isFormValid()}>
          Guardar Candidato
        </button>
      </div>
    </div>
  );
};

export default DocumentUpload;
