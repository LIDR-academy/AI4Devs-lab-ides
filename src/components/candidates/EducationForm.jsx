import { useState, useEffect } from "react";

/**
 * Componente para gestionar múltiples entradas de formación académica
 */
export const EducationForm = ({ data, onChange, onNext, onPrev }) => {
  const [education, setEducation] = useState(data);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Añade una nueva entrada de formación académica
  const handleAddEducation = () => {
    const newEducation = [
      ...education,
      {
        id: Date.now(),
        title: "",
        institution: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ];
    setEducation(newEducation);
    onChange(newEducation);
  };

  // Elimina una entrada de formación académica
  const handleRemoveEducation = (id) => {
    if (education.length === 1) return; // Mantener al menos una entrada

    const newEducation = education.filter((item) => item.id !== id);
    setEducation(newEducation);
    onChange(newEducation);
  };

  // Maneja los cambios en los campos del formulario
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newEducation = [...education];
    newEducation[index] = {
      ...newEducation[index],
      [name]: value,
    };
    setEducation(newEducation);

    // Marca el campo como tocado para validarlo
    const fieldId = `${index}-${name}`;
    if (!touched[fieldId]) {
      setTouched((prev) => ({
        ...prev,
        [fieldId]: true,
      }));
    }
  };

  // Valida los campos cuando cambian
  useEffect(() => {
    const newErrors = {};

    education.forEach((edu, index) => {
      const titleFieldId = `${index}-title`;
      const institutionFieldId = `${index}-institution`;
      const startDateFieldId = `${index}-startDate`;
      const endDateFieldId = `${index}-endDate`;

      if (touched[titleFieldId] && !edu.title) {
        newErrors[titleFieldId] = "El título es obligatorio";
      }

      if (touched[institutionFieldId] && !edu.institution) {
        newErrors[institutionFieldId] = "La institución es obligatoria";
      }

      if (touched[startDateFieldId] && !edu.startDate) {
        newErrors[startDateFieldId] = "La fecha de inicio es obligatoria";
      }

      if (touched[endDateFieldId] && !edu.endDate) {
        newErrors[endDateFieldId] = "La fecha de finalización es obligatoria";
      }

      if (
        touched[startDateFieldId] &&
        touched[endDateFieldId] &&
        edu.startDate &&
        edu.endDate &&
        new Date(edu.startDate) > new Date(edu.endDate)
      ) {
        newErrors[endDateFieldId] =
          "La fecha de finalización debe ser posterior a la de inicio";
      }
    });

    setErrors(newErrors);
  }, [education, touched]);

  // Comprueba si el formulario es válido
  const isFormValid = () => {
    // Ahora la formación académica no es obligatoria, solo verificamos que no haya errores
    // Incluso un formulario vacío es válido
    return Object.keys(errors).length === 0;
  };

  // Maneja el envío del formulario para pasar al siguiente paso
  const handleSubmit = (e) => {
    e.preventDefault();

    // Si hay datos, los validamos
    if (
      education.some(
        (edu) => edu.title || edu.institution || edu.startDate || edu.endDate
      )
    ) {
      // Marca todos los campos con datos como tocados para validarlos
      const allTouched = {};
      education.forEach((edu, index) => {
        if (edu.title) allTouched[`${index}-title`] = true;
        if (edu.institution) allTouched[`${index}-institution`] = true;
        if (edu.startDate) allTouched[`${index}-startDate`] = true;
        if (edu.endDate) allTouched[`${index}-endDate`] = true;
      });
      setTouched(allTouched);
    }

    // Si el formulario es válido (incluso vacío), pasa al siguiente paso
    if (isFormValid()) {
      onChange(education);
      onNext();
    }
  };

  return (
    <div className="education-form">
      <h2 className="education-form__title">Formación Académica</h2>

      {education.map((edu, index) => (
        <div key={edu.id} className="education-form__item">
          <h3 className="education-form__subtitle">
            Formación {index + 1}
            {education.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveEducation(edu.id)}
                className="education-form__remove"
                aria-label="Eliminar formación académica">
                Eliminar
              </button>
            )}
          </h3>

          <div className="education-form__field">
            <label htmlFor={`title-${index}`} className="education-form__label">
              Título
            </label>
            <input
              type="text"
              id={`title-${index}`}
              name="title"
              value={edu.title}
              onChange={(e) => handleChange(index, e)}
              className={`education-form__input ${
                errors[`${index}-title`] ? "education-form__input--error" : ""
              }`}
              aria-invalid={!!errors[`${index}-title`]}
              aria-describedby={
                errors[`${index}-title`] ? `title-error-${index}` : undefined
              }
            />
            {errors[`${index}-title`] && (
              <p id={`title-error-${index}`} className="education-form__error">
                {errors[`${index}-title`]}
              </p>
            )}
          </div>

          <div className="education-form__field">
            <label
              htmlFor={`institution-${index}`}
              className="education-form__label">
              Institución
            </label>
            <input
              type="text"
              id={`institution-${index}`}
              name="institution"
              value={edu.institution}
              onChange={(e) => handleChange(index, e)}
              className={`education-form__input ${
                errors[`${index}-institution`]
                  ? "education-form__input--error"
                  : ""
              }`}
              aria-invalid={!!errors[`${index}-institution`]}
              aria-describedby={
                errors[`${index}-institution`]
                  ? `institution-error-${index}`
                  : undefined
              }
            />
            {errors[`${index}-institution`] && (
              <p
                id={`institution-error-${index}`}
                className="education-form__error">
                {errors[`${index}-institution`]}
              </p>
            )}
          </div>

          <div className="education-form__row">
            <div className="education-form__field education-form__field--half">
              <label
                htmlFor={`startDate-${index}`}
                className="education-form__label">
                Fecha de inicio
              </label>
              <input
                type="date"
                id={`startDate-${index}`}
                name="startDate"
                value={edu.startDate}
                onChange={(e) => handleChange(index, e)}
                className={`education-form__input ${
                  errors[`${index}-startDate`]
                    ? "education-form__input--error"
                    : ""
                }`}
                aria-invalid={!!errors[`${index}-startDate`]}
                aria-describedby={
                  errors[`${index}-startDate`]
                    ? `startDate-error-${index}`
                    : undefined
                }
              />
              {errors[`${index}-startDate`] && (
                <p
                  id={`startDate-error-${index}`}
                  className="education-form__error">
                  {errors[`${index}-startDate`]}
                </p>
              )}
            </div>

            <div className="education-form__field education-form__field--half">
              <label
                htmlFor={`endDate-${index}`}
                className="education-form__label">
                Fecha de finalización
              </label>
              <input
                type="date"
                id={`endDate-${index}`}
                name="endDate"
                value={edu.endDate}
                onChange={(e) => handleChange(index, e)}
                className={`education-form__input ${
                  errors[`${index}-endDate`]
                    ? "education-form__input--error"
                    : ""
                }`}
                aria-invalid={!!errors[`${index}-endDate`]}
                aria-describedby={
                  errors[`${index}-endDate`]
                    ? `endDate-error-${index}`
                    : undefined
                }
              />
              {errors[`${index}-endDate`] && (
                <p
                  id={`endDate-error-${index}`}
                  className="education-form__error">
                  {errors[`${index}-endDate`]}
                </p>
              )}
            </div>
          </div>

          <div className="education-form__field">
            <label
              htmlFor={`description-${index}`}
              className="education-form__label">
              Descripción
            </label>
            <textarea
              id={`description-${index}`}
              name="description"
              value={edu.description}
              onChange={(e) => handleChange(index, e)}
              className="education-form__textarea"
              rows="3"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddEducation}
        className="education-form__add">
        + Añadir otra formación
      </button>

      <div className="education-form__actions">
        <button
          type="button"
          onClick={onPrev}
          className="education-form__button education-form__button--secondary">
          Anterior
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="education-form__button education-form__button--primary">
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default EducationForm;
