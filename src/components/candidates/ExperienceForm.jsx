import { useState, useEffect } from "react";

/**
 * Componente para gestionar múltiples entradas de experiencia laboral
 */
export const ExperienceForm = ({ data, onChange, onNext, onPrev }) => {
  const [experience, setExperience] = useState(data);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Añade una nueva entrada de experiencia laboral
  const handleAddExperience = () => {
    const newExperience = [
      ...experience,
      {
        id: Date.now(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ];
    setExperience(newExperience);
    onChange(newExperience);
  };

  // Elimina una entrada de experiencia laboral
  const handleRemoveExperience = (id) => {
    if (experience.length === 1) return; // Mantener al menos una entrada

    const newExperience = experience.filter((item) => item.id !== id);
    setExperience(newExperience);
    onChange(newExperience);
  };

  // Maneja los cambios en los campos del formulario
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newExperience = [...experience];
    newExperience[index] = {
      ...newExperience[index],
      [name]: value,
    };
    setExperience(newExperience);

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

    experience.forEach((exp, index) => {
      const companyFieldId = `${index}-company`;
      const positionFieldId = `${index}-position`;
      const startDateFieldId = `${index}-startDate`;
      const endDateFieldId = `${index}-endDate`;

      if (touched[companyFieldId] && !exp.company) {
        newErrors[companyFieldId] = "La empresa es obligatoria";
      }

      if (touched[positionFieldId] && !exp.position) {
        newErrors[positionFieldId] = "El puesto es obligatorio";
      }

      if (touched[startDateFieldId] && !exp.startDate) {
        newErrors[startDateFieldId] = "La fecha de inicio es obligatoria";
      }

      if (touched[endDateFieldId] && !exp.endDate) {
        newErrors[endDateFieldId] = "La fecha de finalización es obligatoria";
      }

      if (
        touched[startDateFieldId] &&
        touched[endDateFieldId] &&
        exp.startDate &&
        exp.endDate &&
        new Date(exp.startDate) > new Date(exp.endDate)
      ) {
        newErrors[endDateFieldId] =
          "La fecha de finalización debe ser posterior a la de inicio";
      }
    });

    setErrors(newErrors);
  }, [experience, touched]);

  // Comprueba si el formulario es válido
  const isFormValid = () => {
    // Ahora la experiencia laboral no es obligatoria, solo verificamos que no haya errores
    // Incluso un formulario vacío es válido
    return Object.keys(errors).length === 0;
  };

  // Maneja el envío del formulario para pasar al siguiente paso
  const handleSubmit = (e) => {
    e.preventDefault();

    // Si hay datos, los validamos
    if (
      experience.some(
        (exp) => exp.company || exp.position || exp.startDate || exp.endDate
      )
    ) {
      // Marca todos los campos con datos como tocados para validarlos
      const allTouched = {};
      experience.forEach((exp, index) => {
        if (exp.company) allTouched[`${index}-company`] = true;
        if (exp.position) allTouched[`${index}-position`] = true;
        if (exp.startDate) allTouched[`${index}-startDate`] = true;
        if (exp.endDate) allTouched[`${index}-endDate`] = true;
      });
      setTouched(allTouched);
    }

    // Si el formulario es válido (incluso vacío), pasa al siguiente paso
    if (isFormValid()) {
      onChange(experience);
      onNext();
    }
  };

  return (
    <div className="experience-form">
      <h2 className="experience-form__title">Experiencia Laboral</h2>

      {experience.map((exp, index) => (
        <div key={exp.id} className="experience-form__item">
          <h3 className="experience-form__subtitle">
            Experiencia {index + 1}
            {experience.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveExperience(exp.id)}
                className="experience-form__remove"
                aria-label="Eliminar experiencia laboral">
                Eliminar
              </button>
            )}
          </h3>

          <div className="experience-form__field">
            <label
              htmlFor={`company-${index}`}
              className="experience-form__label">
              Empresa
            </label>
            <input
              type="text"
              id={`company-${index}`}
              name="company"
              value={exp.company}
              onChange={(e) => handleChange(index, e)}
              className={`experience-form__input ${
                errors[`${index}-company`]
                  ? "experience-form__input--error"
                  : ""
              }`}
              aria-invalid={!!errors[`${index}-company`]}
              aria-describedby={
                errors[`${index}-company`]
                  ? `company-error-${index}`
                  : undefined
              }
            />
            {errors[`${index}-company`] && (
              <p
                id={`company-error-${index}`}
                className="experience-form__error">
                {errors[`${index}-company`]}
              </p>
            )}
          </div>

          <div className="experience-form__field">
            <label
              htmlFor={`position-${index}`}
              className="experience-form__label">
              Puesto
            </label>
            <input
              type="text"
              id={`position-${index}`}
              name="position"
              value={exp.position}
              onChange={(e) => handleChange(index, e)}
              className={`experience-form__input ${
                errors[`${index}-position`]
                  ? "experience-form__input--error"
                  : ""
              }`}
              aria-invalid={!!errors[`${index}-position`]}
              aria-describedby={
                errors[`${index}-position`]
                  ? `position-error-${index}`
                  : undefined
              }
            />
            {errors[`${index}-position`] && (
              <p
                id={`position-error-${index}`}
                className="experience-form__error">
                {errors[`${index}-position`]}
              </p>
            )}
          </div>

          <div className="experience-form__row">
            <div className="experience-form__field experience-form__field--half">
              <label
                htmlFor={`startDate-${index}`}
                className="experience-form__label">
                Fecha de inicio
              </label>
              <input
                type="date"
                id={`startDate-${index}`}
                name="startDate"
                value={exp.startDate}
                onChange={(e) => handleChange(index, e)}
                className={`experience-form__input ${
                  errors[`${index}-startDate`]
                    ? "experience-form__input--error"
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
                  className="experience-form__error">
                  {errors[`${index}-startDate`]}
                </p>
              )}
            </div>

            <div className="experience-form__field experience-form__field--half">
              <label
                htmlFor={`endDate-${index}`}
                className="experience-form__label">
                Fecha de finalización
              </label>
              <input
                type="date"
                id={`endDate-${index}`}
                name="endDate"
                value={exp.endDate}
                onChange={(e) => handleChange(index, e)}
                className={`experience-form__input ${
                  errors[`${index}-endDate`]
                    ? "experience-form__input--error"
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
                  className="experience-form__error">
                  {errors[`${index}-endDate`]}
                </p>
              )}
            </div>
          </div>

          <div className="experience-form__field">
            <label
              htmlFor={`description-${index}`}
              className="experience-form__label">
              Descripción
            </label>
            <textarea
              id={`description-${index}`}
              name="description"
              value={exp.description}
              onChange={(e) => handleChange(index, e)}
              className="experience-form__textarea"
              rows="3"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddExperience}
        className="experience-form__add">
        + Añadir otra experiencia
      </button>

      <div className="experience-form__actions">
        <button
          type="button"
          onClick={onPrev}
          className="experience-form__button experience-form__button--secondary">
          Anterior
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="experience-form__button experience-form__button--primary">
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ExperienceForm;
