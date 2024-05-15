import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Button, Modal, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { firestore } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [journals, setJournals] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedJournalIndex, setSelectedJournalIndex] = useState(0);

  useEffect(() => {
    const fetchJournals = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(firestore, "journals"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const journalEntries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJournals(journalEntries);
      }
    };

    fetchJournals();
  }, []);

  const handleOpenJournal = (index) => {
    setSelectedJournalIndex(index);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleNavigateJournals = (direction) => {
    const newIndex = selectedJournalIndex + direction;
    if (newIndex >= 0 && newIndex < journals.length) {
      setSelectedJournalIndex(newIndex);
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>Welcome to Reflect</Typography>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Button variant="contained" color="primary" onClick={() => navigate('/mood-tracking')}>
          Mood Tracking
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/journaling')}>
          Journaling
        </Button>
      </Box>

      <Paper elevation={3} sx={{ marginTop: 4, padding: 2 }}>
        <Typography variant="h6">Recent Journal Entries</Typography>
        {journals.map((journal, index) => (
          <Typography key={journal.id} onClick={() => handleOpenJournal(index)}>
            {journal.title}
          </Typography>
        ))}
      </Paper>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="journal-view"
        aria-describedby="journal-view-details"
      >
        <Box sx={modalStyle}>
          <IconButton onClick={() => handleNavigateJournals(-1)}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography id="journal-view" variant="h6">{journals[selectedJournalIndex]?.title}</Typography>
          <Typography id="journal-view-details" sx={{ mt: 2 }}>
            {journals[selectedJournalIndex]?.content}
          </Typography>
          <IconButton onClick={() => handleNavigateJournals(1)}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Modal>
    </StyledContainer>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const StyledContainer = styled(Container)`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default DashboardPage;
