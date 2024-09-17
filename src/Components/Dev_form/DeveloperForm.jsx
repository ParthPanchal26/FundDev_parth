import React, { useState } from 'react';
import './DeveloperForm.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const DeveloperForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType, firstname, lastname, username, email, password } = location.state;

  const steps = [
    { name: 'bio', label: 'Bio', type: 'textarea', optional: true },
    { name: 'location', label: 'Location', type: 'text', optional: true },
    { name: 'website', label: 'Website', type: 'text', optional: true },
    { name: 'linkedin', label: 'LinkedIn', type: 'text', optional: true },
    { name: 'github', label: 'GitHub', type: 'text', optional: true },
    { name: 'twitter', label: 'Twitter', type: 'text', optional: true },
    { name: 'skills', label: 'Skills', type: 'text', optional: false },
    { name: 'experience', label: 'Experience (in years)', type: 'number', optional: false },
    { name: 'availability', label: 'Availability', type: 'select', options: ['Full-time', 'Part-time', 'Contract', 'Not Available'], optional: false },
    { name: 'preferredRole', label: 'Preferred Roles', type: 'select', options: ['Frontend', 'Backend', 'Full-stack', 'Mobile', 'AI/ML', 'DevOps', 'Other'], optional: false },
    { name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', optional: false },
    { name: 'remote', label: 'Remote Work', type: 'checkbox', optional: false },
    { name: 'portfolio', label: 'Portfolio (Title, Description, Link)', type: 'text', optional: true },

  ];

  const [formData, setFormData] = useState({});

  // const handleSubmit = () => {
  //   console.log('All Information:', {
  //     userType,
  //     firstname,
  //     lastname,
  //     username,
  //     email,
  //     password,
  //     ...formData
  //   });
  //   navigate(`/MainPage?userType=${userType}`);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log all the form data to check if it's correctly captured
    console.log({
      userType,
      firstname,
      lastname,
      username,
      email,
      password,
      ...formData
    });

    const dataToSend = {
      userType,
      firstname,
      lastname,
      username,
      email,
      password,
      ...formData
    };

    try {
      // Make the POST request to the backend API
      const response = await axios.post('https://funddev-backend.onrender.com/api/v1/dev/register', dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Log the response from the server
      console.log('Server Response:', response.data);

      // Redirect the user to the main page after successful registration
      navigate(`/MainPage?userType=${userType}`);
    } catch (error) {
      // Handle different error cases and log the specific error
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Server Error:', error.response.data);
        console.error('Status:', error.response.status);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No Response:', error.request);
      } else {
        // Something else happened during the request
        console.error('Error:', error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, type, files, value, checked } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const renderStep = (step) => {
    switch (step.type) {
      case 'textarea':
        return <textarea name={step.name} value={formData[step.name] || ''} onChange={handleChange} />;
      case 'select':
        return (
          <select name={step.name} value={formData[step.name] || ''} onChange={handleChange}>
            <option value="">-- Select --</option>
            {step.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return <input type="checkbox" name={step.name} checked={formData[step.name] || false} onChange={handleChange} />;
      case 'file':
        return <input type="file" name={step.name} onChange={handleChange} />;
      default:
        return <input type={step.type} name={step.name} value={formData[step.name] || ''} onChange={handleChange} />;
    }
  };

  return (
    <div className="developer-form">
      <h2>Developer Information</h2>
      <form onSubmit={handleSubmit}>
        {steps.map(step => (
          <div key={step.name} className="form-step">
            <label>{step.label}</label>
            {renderStep(step)}
          </div>
        ))}
        <div className="form-buttons">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default DeveloperForm;
