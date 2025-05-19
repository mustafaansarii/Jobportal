import React from 'react';
import { Box, Typography, Button, Skeleton, Paper } from '@mui/material';

const JobList = ({ jobs, loading, onSelect, onDelete }) => {
  if (loading) {
    return (
      <Box>
        {[...Array(5)].map((_, i) => (
          <Paper key={i} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <Box>
      {jobs.map(job => (
        <Paper key={job.id} elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{job.role}</Typography>
          <Typography variant="body2" color="text.secondary">{job.company}</Typography>
          <Box mt={1}>
            <Button
              size="small"
              variant="contained"
              onClick={() => onSelect(job)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => onDelete(job.id)}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default JobList; 