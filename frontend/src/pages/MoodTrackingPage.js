import React, { useState } from 'react';
import { Typography, Slider, Box, Button, TextField, MenuItem, FormControl, Select, InputLabel, Paper, Container } from '@mui/material';

const emotions = ['Happy', 'Sad', 'Anxious', 'Excited', 'Angry'];
const intensityLevels = [1, 2, 3, 4, 5];

const MoodTrackingPage = () => {
  const [moodValue, setMoodValue] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState({});
  const [gratitudeLog, setGratitudeLog] = useState('');
  const [reflection, setReflection] = useState('');

  const handleEmotionChange = (emotion, intensity) => {
    setSelectedEmotions({ ...selectedEmotions, [emotion]: intensity });
  };

  function determinePredominantMood(moodValue, selectedEmotions) {
    const normalizedMoodValue = Math.round(moodValue / 2);
    const allEmotions = { Overall: normalizedMoodValue, ...selectedEmotions };
    const predominantMood = Object.entries(allEmotions).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    return predominantMood;
  }

  const handleSubmit = () => {
    const moodData = {
      moodValue,
      selectedEmotions,
      gratitudeLog,
      reflection
    };

    const predominantMood = determinePredominantMood(moodValue, selectedEmotions);
    console.log("Mood Data:", moodData);
    console.log("Predominant Mood:", predominantMood);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Mood Tracking</Typography>
      <Paper elevation={3} sx={{ padding: 4, margin: 2 }}>
        <Typography variant="h6">How are you feeling today?</Typography>
        <Slider value={moodValue} onChange={(e, newValue) => setMoodValue(newValue)} step={1} marks min={1} max={10} valueLabelDisplay="auto" />
        
        <Box sx={{ my: 2 }}>
          {emotions.map((emotion) => (
            <Box key={emotion} sx={{ my: 1 }}>
              <Button variant="outlined" onClick={() => handleEmotionChange(emotion, 1)} sx={{ marginRight: 1 }}>{emotion}</Button>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Intensity</InputLabel>
                <Select
                  value={selectedEmotions[emotion] || ''}
                  label="Intensity"
                  onChange={(e) => handleEmotionChange(emotion, parseInt(e.target.value))}
                >
                  {intensityLevels.map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ))}
        </Box>

        <TextField fullWidth label="What are you grateful for today?" multiline rows={2} value={gratitudeLog} onChange={(e) => setGratitudeLog(e.target.value)} />
        
        <TextField fullWidth label="Reflections" multiline rows={4} sx={{ my: 2 }} value={reflection} onChange={(e) => setReflection(e.target.value)} />
        
        <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
      </Paper>
    </Container>
  );
};

export default MoodTrackingPage;
