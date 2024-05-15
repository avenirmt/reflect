import React, { useState, useEffect } from 'react';
import { Typography, Slider, Box, Button, TextField, MenuItem, FormControl, Select, InputLabel, Paper, Container } from '@mui/material';
import { database } from '../firebase/firebase';
import { ref, push, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const emotions = ['Happy', 'Sad', 'Anxious', 'Excited', 'Angry'];
const intensityLevels = [1, 2, 3, 4, 5];

const MoodTrackingPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const [moodValue, setMoodValue] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState({});
  const [gratitudeLog, setGratitudeLog] = useState('');
  const [reflection, setReflection] = useState('');
  const [suggestedExercise, setSuggestedExercise] = useState('');

  const handleEmotionChange = (emotion, intensity) => {
    setSelectedEmotions({ ...selectedEmotions, [emotion]: intensity });
  };

  function determinePredominantMood() {
    const normalizedMoodValue = Math.round(moodValue / 2);
    const allEmotions = { Overall: normalizedMoodValue, ...selectedEmotions };
    return Object.entries(allEmotions).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  const fetchExercises = (mood) => {
    console.log("Fetching exercises for mood:", mood);
    const moodRef = ref(database, `moodExcercise/${mood}`);
    get(moodRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Retrieved data for mood:", data);
        
        // Generate a random key from 1 to 4
        const exerciseKey = Math.floor(Math.random() * 4) + 1;
        const randomExercise = data[exerciseKey];
        
        if (randomExercise) {
          console.log("Exercise found:", randomExercise);
          setSuggestedExercise(randomExercise);
        } else {
          console.log("No valid exercise found under the key:", exerciseKey);
          setSuggestedExercise('No valid exercise found');
        }
      } else {
        console.log("No exercises found for this mood:", mood);
        setSuggestedExercise('No exercises found for this mood');
      }
    }).catch(error => {
      console.error('Failed to fetch exercises:', error);
      setSuggestedExercise('Failed to load exercises');
    });
  };

  const handleSubmit = () => {
    if (!currentUser) {
      console.error("No user is logged in!");
      return;
    }
    
    const moodData = {
      userId: currentUser.uid,
      moodValue,
      selectedEmotions,
      gratitudeLog,
      reflection,
      timestamp: new Date().toISOString()
    };

    const predominantMood = determinePredominantMood();
    console.log("Mood Data:", moodData);
    console.log("Predominant Mood:", predominantMood);

    push(ref(database, 'moodData'), {
      ...moodData,
      predominantMood
    }).then(() => {
      console.log('Mood data sent to Firebase successfully');
      fetchExercises(predominantMood);
    }).catch(error => {
      console.error('Error sending mood data to Firebase:', error);
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button onClick={() => navigate('/dashboard')} variant="outlined" sx={{ alignSelf: 'flex-start', mb: 2 }}>Back to Dashboard</Button>
      <Typography variant="h4" gutterBottom>Mood Tracking</Typography>
      <Paper elevation={3} sx={{ padding: 4, margin: 2, width: '100%' }}>
        <Typography variant="h6">How are you feeling today?</Typography>
        <Slider value={moodValue} onChange={(e, newValue) => setMoodValue(newValue)} step={1} marks min={1} max={10} valueLabelDisplay="auto" />

        <Box sx={{ my: 2 }}>
          {emotions.map((emotion) => (
            <Box key={emotion} sx={{ my: 1, display: 'flex', alignItems: 'center' }}>
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
      </Paper>
      
      <Paper elevation={3} sx={{ p: 2, mt: 2, width: '100%', bgcolor: '#f1f1f1' }}>
        <Typography variant="h6">Suggested Exercise</Typography>
        <Typography>{suggestedExercise}</Typography>
      </Paper>

      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>Submit</Button>
    </Container>
  );
};

export default MoodTrackingPage;
