import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import options1 from '../Topics';
import options2 from '../Companies';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { FormControl, Container, Grid, TextField, Button, MenuItem, InputLabel, Select, Typography } from '@mui/material';

const Upload = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType]= useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState({
    company: '',
    topic: '',
    title: '',
    question: '',
    image: '',
  });

  const uploadQuestion = useCallback((postData) => {
    const token = localStorage.getItem('token');

    if (!token) {
      enqueueSnackbar('Please log in to upload a question.', { variant: 'warning' });
      return;
    }

    axios
      .post('https://techtesthub.onrender.com/api/v1/user/addQuestion/', postData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setLoading(false);
        const { message } = response.data;
        enqueueSnackbar(message, { variant: 'success' });
        setSelectedCompany('');
        setSelectedTopic('');
        setTitle('');
        setQuestion('');
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        const message = error.response?.data?.message || 'An error occurred';
        enqueueSnackbar(message, { variant: 'error' });
        console.log(error);
      });
  }, [enqueueSnackbar, navigate]);
  

  useEffect(() => {
    if (loading) {
      var postData;
        if (image) {
          postData = {
            "Company": selectedCompany,
            "Topic": selectedTopic,
            "Title": title,
            "Question": question,
            "Image": imageURL
          };
        } 
        else {
          postData = {
            "Company":selectedCompany,
            "Topic": selectedTopic,
            "Title": title,
            "Question": question,
          };
        }
        //console.log(postData);
      uploadQuestion(postData);
      setLoading(false);
    }
  }, [loading, selectedCompany, selectedTopic, title, question, image, imageURL, uploadQuestion]);

  const postPicture = async (pic) => {
    return new Promise((resolve, reject) => {
      if (pic && (pic.type === 'image/jpeg' || pic.type === 'image/png' || pic.type === 'image/jpg')) {
        const data = new FormData();
        data.append("file", pic);
        data.append("upload_preset", "techtesthub");
        data.append("cloud_name", "dz6tmignk");
    
        axios.post("https://api.cloudinary.com/v1_1/dz6tmignk/image/upload", data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            // console.log('cloudinary response', res);
            setImageURL(res.data.url.toString());
            // console.log(imageURL);
            resolve(); 
          })
          .catch((error) => {
            console.error("Error uploading image to Cloudinary", error.response.data);
            setErrorType(1);
            reject(error); 
          });
      } else {
        console.error("Invalid image format");
        setErrorType(2);
        reject(new Error("Invalid image format")); 
      }
    });
  };
  
  const handleUpload = async () => {
    const errors = {};
  
    if (!selectedCompany) {
      errors.company = '*Company is required';
    }
  
    if (!selectedTopic) {
      errors.topic = '*Topic is required';
    }
  
    if (!title.trim()) {
      errors.title = '*Title is required';
    }

    if(image){
      try {
        await postPicture(image); // Wait for the image to be uploaded
      } catch (error) {
        if(errorType === 1){
          errors.image = "Error in uploading image to Cloudinary";
        }
        else{
          errors.image = "Invalid image format. Image must be in jpg or jpeg or png format.";
        }
      }
    }
    else{
      if (!question.trim()) {
        errors.question = '*Question is required';
      }
    }
  
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      enqueueSnackbar('Please fill in all required fields', { variant: 'error' });
      return;
    }
    setLoading(true); 
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  return (
    <Container
      id="upload"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography component="h2" variant="h4" color="text.primary">
        Upload Question
      </Typography>
      <Grid 
        container 
        spacing={3} 
        alignItems="center"
        justifyContent="center" 
      >
          <Grid item xs={12}>
            <FormControl fullWidth variant='filled' size='small'>
              <InputLabel>Topic</InputLabel>
              <Select
                value={selectedTopic}
                onChange={handleTopicChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150, // Adjust the maximum height as needed
                    },
                  },
                }}
              >
                {options1.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {errorMessages.topic && <Typography variant="caption" color="error">{errorMessages.topic}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant='filled' size='small'>
              <InputLabel>Company</InputLabel>
              <Select
                value={selectedCompany}
                onChange={handleCompanyChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150, // Adjust the maximum height as needed
                    },
                  },
                }}
              >
                {options2.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {errorMessages.company && <Typography variant="caption" color="error">{errorMessages.company}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth >
              <TextField
                autoFocus
                label="Title"
                variant='filled'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                multiline
                maxRows={2}
                size='small'
              />
              {errorMessages.title && <Typography variant="caption" color="error">{errorMessages.title}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth >
              <TextField
                autoFocus
                label="Question"
                variant='filled'
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                fullWidth
                multiline
                size='small'
                maxRows={8} // Set a maximum number of rows
                sx={{ overflowY: 'auto' }} // Make the text scrollable
              />
              {errorMessages.question && <Typography variant="caption" color="error">{errorMessages.question}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <input 
                type="file" 
                id="image" 
                accept="image/*" 
                onChange={(e) => setImage(e.target.files[0])}
              />
              {errorMessages.image && <Typography variant="caption" color="error">{errorMessages.image}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
            >
              Upload Question
            </Button>
          </Grid>
      </Grid>
    </Container>
  );
};

export default Upload;


