import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';

const JobForm = ({ job, onCreate, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    company_url: '',
    description: '',
    heading: '',
    applylink: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (job) {
      setFormData(job);
    }
  }, [job]);

  const validateField = (name, value) => {
    switch (name) {
      case 'role':
        return value.trim() ? '' : 'Role is required';
      case 'company':
        return value.trim() ? '' : 'Company is required';
      case 'company_url':
        return value.trim() && /^https?:\/\/.+\..+$/.test(value) ? '' : 'Valid URL is required';
      case 'description':
        return value.trim() ? '' : 'Description is required';
      case 'heading':
        return value.trim() ? '' : 'Heading is required';
      case 'applylink':
        return value.trim() && /^https?:\/\/.+\..+$/.test(value) ? '' : 'Valid URL is required';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (job) {
      onUpdate(job.id, formData);
    } else {
      onCreate(formData);
    }
  };

  return (
    <Box
      bgcolor="background.paper"
      p={3}
      borderRadius={2}
      boxShadow={1}
    >
      <Typography variant="h5" mb={3}>
        {job ? 'Edit Job' : 'Create New Job'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.role}
            helperText={errors.role}
          />
          <TextField
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.company}
            helperText={errors.company}
          />
          <TextField
            label="Company URL"
            name="company_url"
            value={formData.company_url}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.company_url}
            helperText={errors.company_url}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            label="Heading (comma separated)"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.heading}
            helperText={errors.heading}
          />
          <TextField
            label="Apply Link"
            name="applylink"
            value={formData.applylink}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.applylink}
            helperText={errors.applylink}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {job ? 'Update' : 'Create'}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default JobForm; 