import React, { useState, useEffect } from 'react';
import { Container, TextField, Typography, Paper, Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Dayjs from 'dayjs';
import { firestore } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const JournalPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);
  
  const [entryDate, setEntryDate] = useState(Dayjs());
  const [title, setTitle] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [suggestedActivity, setSuggestedActivity] = useState('');

  const fetchMoodAnalysis = async (text) => {
    try {
      const response = await fetch('http://localhost:5000/analyze_mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to analyze mood:", error);
      return null;
    }
  };
  

  const handleSaveEntry = async () => {
    if (!currentUser) {
      console.error("No user is logged in!");
      return;
    }

    try {
      const moodData = await fetchMoodAnalysis(journalEntry);
      if (moodData) {
        const docRef = await addDoc(collection(firestore, "journals"), {
          userId: currentUser.uid,
          title,
          content: journalEntry,
          date: entryDate.toISOString(),
          mood: moodData.mood,
          suggestedActivity: moodData.suggestedActivity
        });
        console.log("Document written with ID: ", docRef.id);
        setSuggestedActivity(`Mood: ${moodData.mood}, Suggested activity: ${moodData.suggestedActivity}`);
      }
    } catch (error) {
      console.error("Error adding document or fetching mood analysis: ", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button onClick={() => navigate('/dashboard')} variant="outlined" sx={{ alignSelf: 'flex-start', mb: 2 }}>Back to Dashboard</Button>
      <Typography variant="h4" gutterBottom>Journal</Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 2, width: '100%' }}>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Entry Date"
            value={entryDate}
            onChange={setEntryDate}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
        <TextField
          label="What's on your mind?"
          multiline
          rows={8}
          fullWidth
          variant="outlined"
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSaveEntry} sx={{ mt: 2 }}>
          Save Entry
        </Button>
        {suggestedActivity && (
          <Typography sx={{ mt: 2 }}>{suggestedActivity}</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default JournalPage;
