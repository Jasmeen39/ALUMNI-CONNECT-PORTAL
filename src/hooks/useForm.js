import { useState } from 'react';

export const useForm = (initialValues, validate = () => ({})) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Run validation (if provided)
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validate(values)[name] || '',
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, handleChange, resetForm, errors };
};
