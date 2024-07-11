// frontend/src/domain/candidate/AddCandidateForm/AddCandidateForm.tsx

import React, { useState } from "react";
import { useAddCandidateForm } from "./useAddCandidateForm";

const AddCandidateForm: React.FC = () => {
  const {
    submitForm,
    formData,
    setFormData,
    validateForm,
    validateStep1,
    validateStep2,
    errors,
  } = useAddCandidateForm();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const handleResetForm = () => {
    setIsSubmitted(false);
    setStep(1);
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) {
      console.error("Validation failed", errors);
      return;
    }
    if (step === 2 && !validateStep2()) {
      console.error("Validation failed", errors);
      return;
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error("Validation failed", errors);
      return;
    }
    submitForm(formData);
    setIsSubmitted(true);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {step === 1 && !isSubmitted && (
          <>
            {
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  id="name"
                  className="form-input"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {errors.name && <div className="form-error">{errors.name}</div>}

                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  className="form-input"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
                {errors.lastName && (
                  <div className="form-error">{errors.lastName}</div>
                )}
              </div>
            }
          </>
        )}
        {step === 2 && !isSubmitted && (
          <>
            {
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  className="form-input"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <div className="form-error">{errors.email}</div>
                )}

                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input
                  id="phone"
                  className="form-input"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                {errors.phone && (
                  <div className="form-error">{errors.phone}</div>
                )}

                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  id="address"
                  className="form-input"
                  autoComplete="street-address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
                {errors.address && (
                  <div className="form-error">{errors.address}</div>
                )}

                <label htmlFor="education" className="form-label">
                  Education
                </label>
                <input
                  id="education"
                  className="form-input"
                  autoComplete="off"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                />
                {errors.education && (
                  <div className="form-error">{errors.education}</div>
                )}

                <label htmlFor="workExperience" className="form-label">
                  Work Experience
                </label>
                <input
                  id="workExperience"
                  autoComplete="off"
                  className="form-input"
                  value={formData.workExperience}
                  onChange={(e) =>
                    setFormData({ ...formData, workExperience: e.target.value })
                  }
                />
                {errors.workExperience && (
                  <div className="form-error">{errors.workExperience}</div>
                )}
              </div>
            }
          </>
        )}
        {step === 3 && !isSubmitted && (
          <>
            {
              <div className="form-group">
                <label htmlFor="cv" className="form-label">
                  CV (PDF or DOCX)
                </label>
                <input
                  id="cv"
                  type="file"
                  className="form-input"
                  accept=".pdf,.docx"
                  autoComplete="off"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cv: e.target.files?.[0] || null,
                    })
                  }
                />
                {errors.cv && <div className="form-error">{errors.cv}</div>}
              </div>
            }
          </>
        )}

        <div className="form-navigation">
          {step > 1 && !isSubmitted && (
            <button type="button" onClick={prevStep}>
              Anterior
            </button>
          )}
          {step < 3 && !isSubmitted && (
            <button type="button" onClick={nextStep}>
              Siguiente
            </button>
          )}
          {step === 3 && !isSubmitted && <button type="submit">Enviar</button>}
          {isSubmitted && !errors.global && (
            <div>
              <div>Formulario guardado satisfactoriamente!</div>
              <br />
              <button onClick={handleResetForm}>Enviar otro formulario</button>
            </div>
          )}
          {isSubmitted && errors.global && (
            <div className="error">{errors.global}</div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddCandidateForm;
