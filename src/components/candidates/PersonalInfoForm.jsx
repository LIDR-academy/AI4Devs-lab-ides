import { useState, useEffect } from "react";
import { validateEmail, validatePhone } from "../../utils/validators";

/**
 * Componente que gestiona el formulario de información personal
 */
export const PersonalInfoForm = ({ data, onChange, onNext }) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Marca el campo como tocado para validarlo
    if (!touched[name]) {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    }
  };

  // Valida los campos cuando cambian
  useEffect(() => {
    const newErrors = {};

    // Validación de campos obligatorios
    if (touched.name && !formData.name) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (touched.surnames && !formData.surnames) {
      newErrors.surnames = "Los apellidos son obligatorios";
    }

    if (touched.email) {
      if (!formData.email) {
        newErrors.email = "El correo electrónico es obligatorio";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "El formato del correo electrónico no es válido";
      }
    }

    if (touched.phone) {
      if (!formData.phone) {
        newErrors.phone = "El teléfono es obligatorio";
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "El formato del teléfono no es válido";
      }
    }

    setErrors(newErrors);
  }, [formData, touched]);

  // Comprueba si el formulario es válido
  const isFormValid = () => {
    // Asegura que los campos obligatorios estén llenos y no haya errores
    return (
      formData.name &&
      formData.surnames &&
      formData.email &&
      formData.phone &&
      Object.keys(errors).length === 0
    );
  };

  // Maneja el envío del formulario para pasar al siguiente paso
  const handleSubmit = (e) => {
    e.preventDefault();

    // Marca todos los campos como tocados para mostrar posibles errores
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Si el formulario es válido, pasa al siguiente paso
    if (isFormValid()) {
      onChange(formData);
      onNext();
    }
  };

  return (
    <div className="personal-info-form">
      <h2 className="personal-info-form__title">Información Personal</h2>

      <div className="personal-info-form__field">
        <label htmlFor="name" className="personal-info-form__label">
          Nombre <span className="personal-info-form__required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`personal-info-form__input ${
            errors.name ? "personal-info-form__input--error" : ""
          }`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="personal-info-form__error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="personal-info-form__field">
        <label htmlFor="surnames" className="personal-info-form__label">
          Apellidos <span className="personal-info-form__required">*</span>
        </label>
        <input
          type="text"
          id="surnames"
          name="surnames"
          value={formData.surnames}
          onChange={handleChange}
          className={`personal-info-form__input ${
            errors.surnames ? "personal-info-form__input--error" : ""
          }`}
          aria-invalid={!!errors.surnames}
          aria-describedby={errors.surnames ? "surnames-error" : undefined}
        />
        {errors.surnames && (
          <p id="surnames-error" className="personal-info-form__error">
            {errors.surnames}
          </p>
        )}
      </div>

      <div className="personal-info-form__field">
        <label htmlFor="email" className="personal-info-form__label">
          Correo electrónico{" "}
          <span className="personal-info-form__required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`personal-info-form__input ${
            errors.email ? "personal-info-form__input--error" : ""
          }`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="personal-info-form__error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="personal-info-form__field">
        <label htmlFor="phone" className="personal-info-form__label">
          Teléfono <span className="personal-info-form__required">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`personal-info-form__input ${
            errors.phone ? "personal-info-form__input--error" : ""
          }`}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="personal-info-form__error">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="personal-info-form__field">
        <label htmlFor="address" className="personal-info-form__label">
          Dirección
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="personal-info-form__textarea"
          rows="3"
        />
      </div>

      <div className="personal-info-form__actions">
        <button
          type="button"
          onClick={handleSubmit}
          className="personal-info-form__button personal-info-form__button--primary">
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
