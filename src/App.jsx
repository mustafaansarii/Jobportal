import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import AllJobs from './pages/AllJobs';
import JobDetails from './pages/JobDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AllJobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
    </Routes>
  );
}

export default App;

