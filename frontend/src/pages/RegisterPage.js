import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Button, TextField, Typography, Container, Paper, Link } from '@mui/material';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Validation Schema using Yup
const validationSchema = yup.object({
  name: yup
    .string('Enter your full name')
    .required('Full name is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password1: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  password2: yup
    .string('Confirm your password')
    .oneOf([yup.ref('password1'), null], 'Passwords must match')
    .required('Password confirmation is required'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password1: '',
      password2: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await createUserWithEmailAndPassword(auth, values.email, values.password1);
        navigate('/dashboard'); // Adjust the route as per your app's routing
      } catch (error) {
        console.error(error.message);
      }
    },
  });

  return (
    <StyledContainer>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>Register</Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>Please enter your details below</Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
          />
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
          />
          <TextField
            fullWidth
            id="password1"
            name="password1"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password1}
            onChange={formik.handleChange}
            error={formik.touched.password1 && Boolean(formik.errors.password1)}
            helperText={formik.touched.password1 && formik.errors.password1}
            margin="normal"
          />
          <TextField
            fullWidth
            id="password2"
            name="password2"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password2}
            onChange={formik.handleChange}
            error={formik.touched.password2 && Boolean(formik.errors.password2)}
            helperText={formik.touched.password2 && formik.errors.password2}
            margin="normal"
          />
          <Button onClick={() => setShowPassword(!showPassword)} sx={{ marginBottom: 1 }}>
            {showPassword ? 'Hide Passwords' : 'Show Passwords'}
          </Button>
          <Button color="primary" variant="contained" fullWidth type="submit" sx={{ marginBottom: 2 }}>
            Register
          </Button>
          <Link href="/" variant="body2">{"Already have an account? Login"}</Link>
        </form>
      </Paper>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default RegisterPage;
