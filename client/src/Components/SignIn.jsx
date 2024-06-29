import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalStateContext } from './Context';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { TextField, Link, Button, Typography, Container, Box, InputAdornment, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { AccountCircle, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
      .post('https://techtesthub.onrender.com/api/v1/auth/login/', {
        Username,
        Password,
      })
      .then((response) => {
        const {token, message} = response.data;
        if (token) {
          localStorage.setItem('token', token);
          enqueueSnackbar(message, { variant: 'success' });
          navigate('/');
          setIsLoggedIn(true);
          setCurrentUsername(Username);
        } else {
          enqueueSnackbar(message, { variant: 'error' });
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'An error occurred';
        enqueueSnackbar(message, { variant: 'error' });
        console.log(error);
      });
  };

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

