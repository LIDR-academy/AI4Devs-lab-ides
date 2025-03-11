import { useState } from "react";
import { useRouter } from "next/router";
import PersonalInfoForm from "./PersonalInfoForm";
import EducationForm from "./EducationForm";
import ExperienceForm from "./ExperienceForm";
import DocumentUpload from "./DocumentUpload";
import Notification from "../common/Notification";
import { addCandidate } from "../../api/candidatesApi";

/**
 * Componente principal del formulario de candidatos
 * Implementa un formulario por pasos para mejorar la experiencia de usuario
 */
export const CandidateForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    personalInfo: {
      name: "",
      surnames: "",
      email: "",
      phone: "",
      address: "",
    },
    education: [
      {
        id: Date.now(),
        title: "",
        institution: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    experience: [
      {
        id: Date.now(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    documents: {
      cv: null,
      photo: null,
    },
  });

  // Actualiza datos personales
  const handlePersonalInfoChange = (personalInfo) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo,
    }));
  };

  // Actualiza datos de formación académica
  const handleEducationChange = (education) => {
    setFormData((prev) => ({
      ...prev,
      education,
    }));
  };

  // Actualiza datos de experiencia laboral
  const handleExperienceChange = (experience) => {
    setFormData((prev) => ({
      ...prev,
      experience,
    }));
  };

  // Actualiza documentos subidos
  const handleDocumentsChange = (documents) => {
    setFormData((prev) => ({
      ...prev,
      documents,
    }));
  };

  // Avanza al siguiente paso
  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  // Retrocede al paso anterior
  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  // Maneja el envío del formulario completo
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Incluso sin CV, formación o experiencia, permitimos guardar
      // Solo validamos que haya información personal
      if (
        !formData.personalInfo.name ||
        !formData.personalInfo.surnames ||
        !formData.personalInfo.email ||
        !formData.personalInfo.phone
      ) {
        setNotification({
          show: true,
          type: "error",
          message: "Por favor, complete la información personal básica",
        });
        return;
      }

      // Llamada a la API para añadir candidato
      const response = await addCandidate(formData);

      // Muestra notificación de éxito
      setNotification({
        show: true,
        type: "success",
        message: "Candidato añadido correctamente",
      });

      // Redirecciona al dashboard después de 2 segundos
      setTimeout(() => {
        router.push("/dashboard/candidates");
      }, 2000);
    } catch (error) {
      // Muestra notificación de error
      setNotification({
        show: true,
        type: "error",
        message: error.message || "Ha ocurrido un error al añadir el candidato",
      });
    }
  };

  // Cierra la notificación
  const handleCloseNotification = () => {
    setNotification({ ...notification, show: false });
  };

  // Renderiza el paso actual del formulario
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoForm
            data={formData.personalInfo}
            onChange={handlePersonalInfoChange}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <EducationForm
            data={formData.education}
            onChange={handleEducationChange}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 3:
        return (
          <ExperienceForm
            data={formData.experience}
            onChange={handleExperienceChange}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 4:
        return (
          <DocumentUpload
            data={formData.documents}
            onChange={handleDocumentsChange}
            onSubmit={handleSubmit}
            onPrev={handlePrevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="candidate-form">
      <h1 className="candidate-form__title">Añadir Candidato</h1>

      <div className="candidate-form__progress">
        <div
          className={`candidate-form__step ${
            step >= 1 ? "candidate-form__step--active" : ""
          }`}>
          Información Personal
        </div>
        <div
          className={`candidate-form__step ${
            step >= 2 ? "candidate-form__step--active" : ""
          }`}>
          Formación Académica
        </div>
        <div
          className={`candidate-form__step ${
            step >= 3 ? "candidate-form__step--active" : ""
          }`}>
          Experiencia Laboral
        </div>
        <div
          className={`candidate-form__step ${
            step >= 4 ? "candidate-form__step--active" : ""
          }`}>
          Documentos
        </div>
      </div>

      <form className="candidate-form__container">{renderStep()}</form>

      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default CandidateForm;
