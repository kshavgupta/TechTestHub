import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardHeader, CircularProgress, Grid, Typography } from '@mui/material';

const ShowQuestionsbyCompany = ({ company }) => {
  const [questionInfo, setQuestionInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const Company = company;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/api/v1/question/getQuestionsbyCompany/${Company}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setQuestionInfo(response.data.data);
        } else {
          console.error('Invalid data structure received from the API.');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [Company]);

  const handleclick = (question) => {
    navigate(`/Question/${question.Title}`, { state: { _id: question._id } });
  };

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : questionInfo.length === 0 ? (
        <Typography component="h2" variant="h4" color="text.primary">
          No Question Available
        </Typography>
      ) : (
        <Grid container spacing={2}>
          <Typography component="h2" variant="h4" color="text.primary">
            Questions
          </Typography>
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

