import React from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>Welcome to Reflect</Typography>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        {/* Mood Tracking Button */}
        <Button variant="contained" color="primary" onClick={() => navigate('/mood-tracking')}>
          Mood Tracking
        </Button>

        {/* Journaling Button */}
        <Button variant="contained" color="secondary" onClick={() => navigate('/journaling')}>
          Journaling
        </Button>

        {/* Additional buttons for other features can be added here */}
      </Box>

      {/* Placeholder for mood tracking and journaling components */}
      {/* These should be replaced with actual implementations */}
      <Paper elevation={3} sx={{ marginTop: 4, padding: 2 }}>
        <Typography variant="h6">Mood Tracking Overview</Typography>
        {/* Mood tracking visualization or summary can go here */}
      </Paper>

      <Paper elevation={3} sx={{ marginTop: 4, padding: 2 }}>
        <Typography variant="h6">Recent Journal Entries</Typography>
        {/* Journal entries listing or summary can go here */}
      </Paper>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default DashboardPage;
