import React, { useState } from 'react';
import { Container, TextField, Typography, Paper, Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Dayjs from 'dayjs';

const JournalPage = () => {
  const [entryDate, setEntryDate] = useState(Dayjs());
  const [journalEntry, setJournalEntry] = useState('');

  const handleSaveEntry = () => {
    const entryData = {
      date: entryDate,
      content: journalEntry,
    };
    console.log(entryData);
    setJournalEntry('');
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Journal</Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Entry Date"
            value={entryDate}
            onChange={(newValue) => setEntryDate(newValue)}
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
      </Paper>
    </Container>
  );
};

export default JournalPage;
