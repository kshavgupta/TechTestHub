import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardHeader, CircularProgress, Grid, Typography } from '@mui/material';

const ShowQuestionsbyCompany = ({ company }) => {
  const [questionInfo, setQuestionInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const Company = company;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get(`https://techtesthub.onrender.com/api/v1/question/getQuestionsbyCompany/${Company}`)
      .then((response) => {
        if(isMounted){
          if (response.data && Array.isArray(response.data.questions)) {
            setQuestionInfo(response.data.questions);
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        if(isMounted){
          const message = error.response?.data?.message || 'An error occurred';
          enqueueSnackbar(message, { variant: 'error' });
          // console.log(error);
          setLoading(false);
        }
      });
      return () => {
        isMounted = false;
      };
  }, [Company, enqueueSnackbar]);

  const handleclick = (question) => {
    navigate(`/Question/${question.Title}`, { state: { _id: question._id } });
  };

  return (
    <Box>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <CircularProgress />
        </Box>
      ) : questionInfo.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Typography component="h2" variant="h4" color="text.primary">
            No Question Available
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <Typography component="h2" variant="h4" color="text.primary">
              Questions
            </Typography>
          </Box>
          {questionInfo.map((question, index) => (
            <Grid item xs={12} key={index}>
              <Card variant='outlined'
                onClick={() => handleclick(question)}
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flexGrow: 1,
                  p: 1, 
                }}
              >
                <CardHeader
                  title={question.Title}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Company: { company }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Topic: {question.Topic}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ShowQuestionsbyCompany;

