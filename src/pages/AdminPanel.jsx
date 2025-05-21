import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import JobList from '../components/admin/JobList';
import JobForm from '../components/admin/JobForm';
import { Box, Typography, Container, CircularProgress, Alert, Button } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import config from '../config';

const AdminPanel = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const sendTelegramMessage = async (jobData) => {
    // Function to convert markdown to plain text
    const markdownToPlainText = (text) => {
      return text
        .replace(/#{1,6}\s*/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italics
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
        .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Remove code blocks
        .replace(/\n{2,}/g, '\n') // Reduce multiple newlines
        .trim();
    };

    const jobUrl = `${window.location.origin}/jobs/${jobData.id}`;
    const message =
      `Role: ${jobData.role}\n` +
      `Company: ${jobData.company}\n` +
      `Location: ${jobData.heading || 'Not specified'}\n\n` +
      `Description:\n${jobData.description ? markdownToPlainText(jobData.description).slice(0, 500) + '...' : 'No description provided'}\n\n` +
      `Apply Here: ${jobData.applylink}\n\n` +
      `Job Details: ${jobUrl}\n\n`

    try {
      const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: config.telegramChannelId,
          text: message,
          disable_web_page_preview: false
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(`Telegram API Error: ${responseData.description || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      toast.error('Failed to send Telegram notification');
    }
  };

  const handleCreate = async (jobData) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('Failed to create job: no data returned');
      }
      
      setJobs([data[0], ...jobs]);
      setOpenDialog(false);
      toast.success('Job created successfully!');

      await sendTelegramMessage(data[0]);
    } catch (error) {
      setError(error.message);
      toast.error(`Error creating job: ${error.message}`);
    }
  };

  const handleUpdate = async (id, jobData) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned from update');
      }
      
      setJobs(jobs.map(job => job.id === id ? data[0] : job));
      setOpenDialog(false);
      toast.success('Job updated successfully!');
    } catch (error) {
      setError(error.message);
      toast.error(`Error updating job: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setJobs(jobs.filter(job => job.id !== id));
      toast.success('Job deleted successfully!');
    } catch (error) {
      setError(error.message);
      toast.error(`Error deleting job: ${error.message}`);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'role', headerName: 'Role', width: 200 },
    { field: 'company', headerName: 'Company', width: 200 },
    { field: 'company_url', headerName: 'Company URL', width: 200 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => {
            setSelectedJob(params.row);
            setOpenDialog(true);
          }}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];

  return (
    <Box
      minHeight="100vh"
      bgcolor="background.default"
      py={4}
    >
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
          duration: 3000,
        }}
      />
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h3" gutterBottom>
            Job Portal Admin
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSelectedJob(null);
              setOpenDialog(true);
            }}
          >
            Create New Job
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={jobs}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            loading={loading}
          />
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>{selectedJob ? 'Edit Job' : 'Create New Job'}</DialogTitle>
          <DialogContent>
            <JobForm
              job={selectedJob}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onCancel={() => setOpenDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminPanel; 