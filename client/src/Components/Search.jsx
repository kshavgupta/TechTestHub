import React, { useState } from 'react';
import ShowQuestionsbyTopic from './ShowQuestionsbyTopic';
import ShowQuestionsbyCompany from './ShowQuestionsbyCompany';
import options1 from "../Topics"
import options2 from "../Companies"
import Modal from './Modal';
import { Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';

export default function Search({ mode }) {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchState, setSearchState] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleCompanySubmit = () => {
    setModalOpen(true);
    if (selectedCompany !== '') {
      setSearchState(1);
    }
  }

  const handleTopicSubmit = () => {
    setModalOpen(true);
    if (selectedTopic !== '') {
      setSearchState(2);
    }
  };


  return (
    <Container
      id="search"
      sx={{
        pt: { xs: 2, sm: 6 },
        pb: { xs: 2, sm: 6 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      {/* <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
          gap: { xs: 3, sm: 6 },
        }}
      > */}
        <Typography component="h2" variant="h4" color="text.primary">
          Search Questions
        </Typography>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center" // Center horizontally
        >
          <Grid item sx={{ minWidth: 250, xs: 2 }}>
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
            </FormControl>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleTopicSubmit} style={{ textAlign: 'center' }} sx={{ flexShrink: 0 }}>
              Submit
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center" // Center horizontally
        >
          <Grid item sx={{ minWidth: 250, xs: 2 }}>
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
            </FormControl>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleCompanySubmit} style={{ textAlign: 'center' }} sx={{ flexShrink: 0 }}>
              Submit
            </Button>
          </Grid>
        </Grid>
      {/* </Box> */}

        <Modal open={isModalOpen} onClose={handleModalClose}>
          {searchState === 1 && selectedCompany && (
            <ShowQuestionsbyCompany company={selectedCompany}/>
          )}
          {searchState === 2 && selectedTopic && (
            <ShowQuestionsbyTopic topic={selectedTopic}/>
          )}
        </Modal>
      
    </Container>
  );
}