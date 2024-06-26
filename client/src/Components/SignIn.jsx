import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalStateContext } from './Context';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { TextField, Link, Button, Typography, Container, Box, InputAdornment, Checkbox, FormControlLabel, IconButton, Divider } from '@mui/material';
import { AccountCircle, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FcGoogle } from '@react-icons/all-files/fc/FcGoogle';
import getLPTheme from './getLPTheme';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="primary" href="/">
        TechTestHub
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const SignIn = () => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setIsLoggedIn, setCurrentUsername } = useContext(GlobalStateContext);
  const [showPassword, setShowPassword] = useState(false);
  const LPtheme = createTheme(getLPTheme('light'));

  const handleLogin = () => {
    axios
      .post('http://localhost:5555/api/v1/auth/login/', {
        Username,
        Password,
      })
      .then((response) => {
        const data = response.data;
        if (data.token) {
          localStorage.setItem('token', data.token);
          enqueueSnackbar('Login successful', { variant: 'success' });
          navigate('/');
          setIsLoggedIn(true);
          setCurrentUsername(Username);
        } else {
          alert('Login failed. Please check your credentials.');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
      });
  };

  // const handleGoogleLogin = () => {
  //   // window.location.href = 'http://localhost:5555/api/v1/auth/google';
  //   axios
  //     .get('http://localhost:5555/api/v1/auth/google')
  //     .then((response) => {
  //       const data = response.data;
  //       if (data.token) {
  //         localStorage.setItem('token', data.token);
  //         enqueueSnackbar('Login successful', { variant: 'success' });
  //         navigate('/');
  //         // setUserLoggedIn(true);
  //         // setCurrentUsername(Username);
  //       } else {
  //         alert('Login failed. Please check your credentials.');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error during login:', error);
  //       alert('An error occurred. Please try again later.');
  //     });
  // };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={LPtheme}>
      <Container component="main" maxWidth="xs">
        <Box 
          sx={{
            marginTop: 14,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h2" variant="h4" color="text.primary">
            Sign in to access your account
          </Typography>

          <Box component="form" noValidate sx={{ mt: 3, gap:2}}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              name="username"
              autoComplete="username"
              placeholder="Username *"
              autoFocus
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Password *"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary"/>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      color="primary"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2
              }}
            >
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                color="text.secondary"
                label="Remember me" 
              />
              <Typography variant="body1">
                <Link color="primary" href="/">
                  Forgot Password?
                </Link>
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
              sx={{ mt: 3 }}
            >
              Sign In
            </Button>
            {/* <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mx: 2 }}>
                or
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<FcGoogle />}
              onClick={handleGoogleLogin}
              sx={{ mt: 2 }}
            >
              Sign in with Google
            </Button> */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1" align="center" color="text.secondary" >
                <span style={{ marginRight: '10px' }}>Don't have an account yet?</span>
                <Link color="primary" href="/SignUp">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
        <Copyright sx={{ mt: 4, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;

