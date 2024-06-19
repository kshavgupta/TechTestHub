import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Avatar, Box, Card, CardContent, CardHeader, CircularProgress, Container, CssBaseline, 
  Grid, IconButton, Stack, Typography 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { alpha } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import Links from './Links';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [userQuestions, setUserQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  // const { currentUsername } = useContext(GlobalStateContext);

  useEffect(() => {
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      enqueueSnackbar('Please log in to upload a question.', { variant: 'warning' });
      setLoading(false);
      navigate('/login');
    }

    axios
      .get(`http://localhost:5555/api/v1/user/viewProfile/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setUserInfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      });

    axios
      .get(`http://localhost:5555/api/v1/user/getQuestions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.questions)) {
          setUserQuestions(response.data.questions);
        } else {
          console.error('Invalid data structure received from the API.');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [enqueueSnackbar, navigate]);

  const handleBackClick = () => {
    navigate("/");
  }

  const handleQuestionClick = (question) => {
    navigate(`/Question/${question.Title}`, { state: { _id: question._id } });
  };

  return (
    <Box
      id="question-page"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 5%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <CssBaseline />
      <Grid item xs={12}>
        <IconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
      </Grid>
      <Container
        sx={{
          pt: { xs: 2, sm: 4},
          pb: { xs: 8, sm: 16 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 6, sm: 6 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
            }}
          >
            User&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'clamp(3rem, 10vw, 4rem)',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              }}
            >
              Profile
            </Typography>
          </Typography>
        </Stack>

        <Grid container spacing={{xs: 6, sm: 2}} >
          <Grid item xs={12} sm={4}>
            <Box
              sx={(theme) => ({
                backgroundSize: 'cover',
                borderRadius: '10px',
                outline: '1px solid',
                outlineColor:
                  theme.palette.mode === 'light'
                    ? alpha('#BFCCD9', 0.5)
                    : alpha('#9CCCFC', 0.1),
                boxShadow:
                  theme.palette.mode === 'light'
                    ? `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`
                    : `0 0 24px 12px ${alpha('#033363', 0.2)}`,
              })}
            >

              <Grid container spacing={2} sx={{ padding: '30px' }}>
                <Grid item xs={12} container direction="column" justifyContent="center" alignItems="center">
                  <Avatar alt="Profile" src="/logo192.png" sx={{ width: {xs: 200, sm: 130, md: 200}, height: "100%", border: '2px solid' }} />
                </Grid>
                <Grid item xs={12}>
                <Typography component="h2" variant="h4" align="center" color="text.primary">{userInfo.Username}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Name: {userInfo.Name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Email: {userInfo.Email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Questions Uploaded: {userInfo.Questions}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Reputation: {userInfo.Reputation}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={8}>
            <Box justifyContent="center" alignItems="center" sx={(theme) => ({
                backgroundSize: 'cover',
                borderRadius: '10px',
                height: '100%',
                outline: '1px solid',
                outlineColor:
                  theme.palette.mode === 'light'
                    ? alpha('#BFCCD9', 0.5)
                    : alpha('#9CCCFC', 0.1),
                boxShadow:
                  theme.palette.mode === 'light'
                    ? `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`
                    : `0 0 24px 12px ${alpha('#033363', 0.2)}`,
              })}>
              {loading ? (
                <CircularProgress />
              ) : userQuestions.length === 0 ? (
                <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ pl: '50px', pr: '25px', pt:'25px', pb: '50px'}}>
                  <Typography component="h2" variant="h4" color="text.primary" >
                    No Questions Available.
                  </Typography>
                </Grid>
              ) : (
                <Grid container spacing={2} sx={{ pt: '25px', pr: '25px', pl: '25px', pb:'50px'}} >
                  <Grid item xs={12} container direction="column" justifyContent="center" alignItems="center">
                    <Typography component="h2" variant="h4" color="text.primary">
                      Uploaded Questions
                    </Typography>
                  </Grid>
                  
                  {userQuestions.map((question, index) => (
                    <Grid item xs={12} key={index}>
                      <Card variant='outlined'
                        onClick={() => handleQuestionClick(question)}
                        sx={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          flexGrow: 1,
                          p: 1, 
                        }}
                      >
                        <CardHeader title={question.Title} />
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">
                            Company: { question.Company }
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Topic: { question.Topic }
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Grid>
        </Grid>
        <Links />
      </Container>
    </Box>
  );
};

export default UserProfile;




