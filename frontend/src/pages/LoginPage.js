import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Box, Button, TextField, Typography, Container, Paper, Link } from "@mui/material";
import styled from "styled-components";
import { useFormik } from 'formik';
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        navigate("/dashboard");
      } catch (error) {
        setLoginError(error.message);
      }
    },
  });

  return (
    <StyledContainer>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>Login</Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>Please enter your login details below</Typography>
        
        <form onSubmit={formik.handleSubmit}>
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
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
          />
          {loginError && <Typography color="error">{loginError}</Typography>}
          <Button color="primary" variant="contained" fullWidth type="submit" sx={{ marginTop: 3 }}>
            Login
          </Button>
          <Box marginTop={2}>
            <Link href="/register" variant="body2">{"Don't have an account? Register"}</Link>
          </Box>
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

export default LoginPage;
