// frontend/src/domain/candidate/AddCandidateForm/useAddCandidateForm.ts

import { useState } from "react";
import { Candidate } from "./Candidate";
import { CandidateErrors } from "./CandidateErrors";

export const useAddCandidateForm = () => {
  const [formData, setFormData] = useState<Candidate>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    education: "",
    workExperience: "",
    cv: null,
  });

  const [errors, setErrors] = useState<CandidateErrors>({});

  const validateStep1 = () => {
    let newErrors = {};
    if (!formData.name.trim())
      newErrors = { ...newErrors, name: "Name is required" };
    if (!formData.lastName.trim())
      newErrors = { ...newErrors, lastName: "Last name is required" };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};
    if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors = { ...newErrors, email: "Invalid email" };
    if (!formData.phone.trim())
      newErrors = { ...newErrors, phone: "Phone is required" };
    if (!formData.phone.match(/^\+34\d{9}$/))
      newErrors = { ...newErrors, phone: "Invalid phone number" };
    if (!formData.address.trim())
      newErrors = { ...newErrors, address: "Address is required" };
    if (!formData.education.trim())
      newErrors = { ...newErrors, education: "Education is required" };
    if (!formData.workExperience.trim())
      newErrors = {
        ...newErrors,
        workExperience: "Work experience is required",
      };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim())
      newErrors = { ...newErrors, name: "Name is required" };
    if (!formData.lastName.trim())
      newErrors = { ...newErrors, lastName: "Last name is required" };
    if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors = { ...newErrors, email: "Invalid email" };
    if (!formData.phone.trim())
      newErrors = { ...newErrors, phone: "Phone is required" };
    if (!formData.phone.match(/^\+34\d{9}$/))
      newErrors = { ...newErrors, phone: "Invalid phone number" };
    if (!formData.address.trim())
      newErrors = { ...newErrors, address: "Address is required" };
    if (!formData.education.trim())
      newErrors = { ...newErrors, education: "Education is required" };
    if (!formData.workExperience.trim())
      newErrors = {
        ...newErrors,
        workExperience: "Work experience is required",
      };
    if (!formData.cv) newErrors = { ...newErrors, cv: "CV is required" };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      education: "",
      workExperience: "",
      cv: null,
    });
    setErrors({});
  };

  const submitForm = async (formData: Candidate) => {
    try {
      const response = await fetch("http://localhost:3010/api/candidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors({ global: data.errors || {} });
      }

      resetForm();
    } catch (error) {
      console.error(error);
      setErrors({ global: "Error de conexión con el servidor" });
    }
  };

  return {
    submitForm,
    formData,
    setFormData,
    validateForm,
    validateStep1,
    validateStep2,
    errors,
    setErrors,
  };
};
