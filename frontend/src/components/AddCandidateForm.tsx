import React, { useState, CSSProperties } from 'react';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    education: string;
    workExperience: string;
    cv: File | null;
  }
  
interface AddCandidateFormProps {
  onCandidateAdded: () => void;
}

const AddCandidateForm: React.FC<AddCandidateFormProps> = ({ onCandidateAdded }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    workExperience: '',
    cv: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, cv: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('first_name', formData.firstName);
    formDataToSend.append('last_name', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('education', JSON.stringify({ degree: formData.education }));
    formDataToSend.append('work_experience', JSON.stringify({ position: formData.workExperience }));
    if (formData.cv) {
      formDataToSend.append('cv', formData.cv);
    }

    try {
      const response = await fetch('http://localhost:3010/api/candidates', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Validation errors:', data.errors);
        alert('Failed to add candidate. Please check the form data.');
        return;
      }

      alert('Candidate added successfully!');
      // Reset the form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        education: '',
        workExperience: '',
        cv: null,
      });
      onCandidateAdded(); // Notify parent component
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the candidate.');
    }
  };

  const inputStyle: CSSProperties = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box'
  };

  const textareaStyle: CSSProperties = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical'
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: 'auto'
    }}>
      <div style={{ flex: '1 1 30%', minWidth: '250px' }}>
        <label style={{ fontWeight: 'bold', color: '#333' }}>
          First Name
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required style={inputStyle} />
        </label>
        <label style={{ fontWeight: 'bold', color: '#333' }}>
          Last Name
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required style={inputStyle} />
        </label>
        <label style={{ fontWeight: 'bold', color: '#333' }}>
          Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required style={inputStyle} />
        </label>
      </div>
      <div style={{ flex: '1 1 30%', minWidth: '250px' }}>
        <label style={{ fontWeight: 'bold', color: '#333' }}>
          Phone
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required style={inputStyle} />
        </label>
        <label style={{ fontWeight: 'bold', color: '#333' }}>
          Address
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required style={inputStyle} />
        </label>
        <label style={{ fontWeight: 'bold', color: '#333' }}>
          Education
          <textarea name="education" value={formData.education} onChange={handleChange} placeholder="Education" required style={textareaStyle}></textarea>
        </label>
      </div>
      <div style={{ flex: '1 1 30%', minWidth: '250px' }}>
        <label style={{ fontWeight: 'bold', color: '#333' }}>
          Work Experience
          <textarea name="workExperience" value={formData.workExperience} onChange={handleChange} placeholder="Work Experience" required style={textareaStyle}></textarea>
        </label>
        <label style={{ fontWeight: 'bold', color: '#333' }}>
          CV
          <input type="file" name="cv" onChange={handleFileChange} accept=".pdf,.doc,.docx" required style={inputStyle} />
        </label>
        <button type="submit" style={{
          padding: '12px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#007BFF',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          width: '100%'
        }}>Add Candidate</button>
      </div>
    </form>
  );
};

export default AddCandidateForm;
