import React, { useState, useCallback, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { candidateService, autocompleteService } from "../services/api";
import { Candidate, CandidateFormData } from "../types";
import AutocompleteInput from "./AutocompleteInput";

const CandidateForm: React.FC = () => {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // State for form values
  const [education, setEducation] = useState("");
  const [workExperience, setWorkExperience] = useState("");

  // State for autocomplete suggestions
  const [educationQuery, setEducationQuery] = useState<string>("");
  const [experienceQuery, setExperienceQuery] = useState<string>("");

  // Ref for file input to reset it
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State to track the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CandidateFormData>({
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      education: "",
      workExperience: "",
      privacyConsent: true,
    },
  });

  // Fetch education suggestions
  const { data: educationSuggestions = [], isLoading: isLoadingEducation } =
    useQuery(
      ["educationSuggestions", educationQuery],
      () => autocompleteService.getEducationSuggestions(educationQuery),
      {
        enabled: educationQuery.length > 0,
        staleTime: 60000, // 1 minute
      }
    );

  // Fetch experience suggestions
  const { data: experienceSuggestions = [], isLoading: isLoadingExperience } =
    useQuery(
      ["experienceSuggestions", experienceQuery],
      () => autocompleteService.getExperienceSuggestions(experienceQuery),
      {
        enabled: experienceQuery.length > 0,
        staleTime: 60000, // 1 minute
      }
    );

  // Callbacks for autocomplete
  const handleEducationSearch = useCallback((query: string) => {
    setEducationQuery(query);
  }, []);

  const handleExperienceSearch = useCallback((query: string) => {
    setExperienceQuery(query);
  }, []);

  const handleEducationSelect = useCallback(
    (value: string) => {
      setEducation(value);
      setValue("education", value, { shouldValidate: true });
    },
    [setValue]
  );

  const handleExperienceSelect = useCallback(
    (value: string) => {
      setWorkExperience(value);
      setValue("workExperience", value, { shouldValidate: true });
    },
    [setValue]
  );

  // Custom reset function to clear all form fields
  const resetForm = useCallback(() => {
    // Reset form values using react-hook-form's reset
    reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      education: "",
      workExperience: "",
    });

    // Clear autocomplete state
    setEducation("");
    setWorkExperience("");
    setEducationQuery("");
    setExperienceQuery("");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Clear selected file
    setSelectedFile(null);
  }, [reset]);

  const mutation = useMutation(candidateService.create, {
    onSuccess: () => {
      setSubmitStatus("success");

      // Use our custom reset function
      resetForm();

      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    },
    onError: (error: any) => {
      setSubmitStatus("error");
      console.error("Form submission error:", error);

      // Extract error message from response if available
      let errorMessage = "An error occurred while submitting the form";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data && error.response.data.errors) {
          // Handle validation errors
          const validationErrors = error.response.data.errors;
          errorMessage = validationErrors.map((err: any) => err.msg).join(", ");
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage =
          "No response from server. Please check if the backend is running.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }

      setErrorMessage(errorMessage);
    },
  });

  const onSubmit: SubmitHandler<CandidateFormData> = (data) => {
    // Always set privacyConsent to true
    data.privacyConsent = true;

    // Create a text-only version of the data (without the file)
    const { cv, ...textData } = data;

    // Log the selected file if it exists
    if (selectedFile) {
      console.log(
        "Submitting file:",
        selectedFile.name,
        "Size:",
        selectedFile.size,
        "Type:",
        selectedFile.type
      );
    } else {
      console.log("No file selected for upload");
    }

    // Use the new method that handles FormData directly
    candidateService
      .createWithFormData(selectedFile, textData)
      .then((response: Candidate) => {
        console.log("Candidate created successfully:", response);
        setSubmitStatus("success");
        resetForm();
        setSelectedFile(null); // Clear the selected file
        setTimeout(() => setSubmitStatus("idle"), 3000);
      })
      .catch((error: any) => {
        console.error("Error creating candidate:", error);
        setSubmitStatus("error");

        // Extract error message
        let errorMessage = "An error occurred while submitting the form";
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setErrorMessage(errorMessage);
      });
  };

  // CSS class for required field labels
  const requiredLabelClass =
    "block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:ml-0.5 after:text-red-500";
  const optionalLabelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Add New Candidate
      </h1>

      {submitStatus === "success" && (
        <div
          className="mb-4 p-3 bg-green-100 text-green-700 rounded"
          role="alert"
          aria-live="polite"
        >
          <p className="font-medium">Success!</p>
          <p>Candidate added successfully!</p>
        </div>
      )}

      {submitStatus === "error" && (
        <div
          className="mb-4 p-3 bg-red-100 text-red-700 rounded"
          role="alert"
          aria-live="assertive"
        >
          <p className="font-medium">Error!</p>
          <p>{errorMessage}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
        aria-label="Candidate application form"
      >
        <fieldset className="space-y-4">
          <legend className="sr-only">Personal Information</legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className={requiredLabelClass}>
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className={`w-full p-2 border rounded ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                aria-invalid={errors.firstName ? "true" : "false"}
                aria-describedby={
                  errors.firstName ? "firstName-error" : undefined
                }
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p
                  id="firstName-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className={requiredLabelClass}>
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                {...register("lastName", { required: "Last name is required" })}
                className={`w-full p-2 border rounded ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                aria-invalid={errors.lastName ? "true" : "false"}
                aria-describedby={
                  errors.lastName ? "lastName-error" : undefined
                }
                autoComplete="family-name"
              />
              {errors.lastName && (
                <p
                  id="lastName-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={requiredLabelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`w-full p-2 border rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={optionalLabelClass}>
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full p-2 border border-gray-300 rounded"
              autoComplete="tel"
            />
            {errors.phone && (
              <p
                id="phone-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.phone?.message}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="sr-only">Additional Information</legend>

          {/* Address */}
          <div>
            <label htmlFor="address" className={optionalLabelClass}>
              Address
            </label>
            <textarea
              id="address"
              {...register("address")}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded"
              autoComplete="street-address"
            />
          </div>

          {/* Education with Autocomplete */}
          <AutocompleteInput
            id="education"
            label="Education"
            placeholder="Enter your education level or institution"
            register={register("education")}
            error={errors.education?.message}
            suggestions={educationSuggestions}
            isLoading={isLoadingEducation}
            onSearch={handleEducationSearch}
            onSelect={handleEducationSelect}
            isTextarea={true}
            rows={3}
            value={education}
          />

          {/* Work Experience with Autocomplete */}
          <AutocompleteInput
            id="workExperience"
            label="Work Experience"
            placeholder="Enter your work experience or job title"
            register={register("workExperience")}
            error={errors.workExperience?.message}
            suggestions={experienceSuggestions}
            isLoading={isLoadingExperience}
            onSearch={handleExperienceSearch}
            onSelect={handleExperienceSelect}
            isTextarea={true}
            rows={3}
            value={workExperience}
          />

          {/* CV Upload */}
          <div>
            <label htmlFor="cv" className={optionalLabelClass}>
              CV (PDF or DOCX)
            </label>
            <input
              id="cv"
              type="file"
              accept=".pdf,.docx"
              className="w-full p-2 border border-gray-300 rounded"
              aria-describedby="cv-help"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  console.log(
                    "File selected:",
                    file.name,
                    "Size:",
                    file.size,
                    "Type:",
                    file.type
                  );

                  // Verify the file is valid
                  if (file.size > 5 * 1024 * 1024) {
                    console.warn("File is too large:", file.size, "bytes");
                    alert("File is too large. Maximum size is 5MB.");
                    e.target.value = "";
                    setSelectedFile(null);
                    return;
                  }

                  const ext = file.name
                    .substring(file.name.lastIndexOf("."))
                    .toLowerCase();
                  if (![".pdf", ".docx"].includes(ext)) {
                    console.warn(
                      "Invalid file type:",
                      file.type,
                      "Extension:",
                      ext
                    );
                    alert("Only PDF and DOCX files are allowed.");
                    e.target.value = "";
                    setSelectedFile(null);
                    return;
                  }

                  // Set the selected file
                  setSelectedFile(file);
                } else {
                  console.log("No file selected or file selection cleared");
                  setSelectedFile(null);
                }
              }}
            />
            {selectedFile && (
              <p className="mt-1 text-sm text-green-600">
                Selected file: {selectedFile.name} (
                {Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}
            <p id="cv-help" className="mt-1 text-sm text-gray-500">
              Upload your CV in PDF or DOCX format (max 5MB)
            </p>
          </div>
        </fieldset>

        {/* Privacy Policy Notice - No Checkbox */}
        <div className="pt-4 border-t border-gray-200 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Privacy Notice:</span> By submitting
              this form, you agree to our{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Privacy Policy
              </a>{" "}
              and consent to the collection and processing of your personal
              information.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            aria-busy={mutation.isLoading ? "true" : "false"}
          >
            {mutation.isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm;
