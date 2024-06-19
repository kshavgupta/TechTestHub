import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { alpha, Box, Typography, Container, Card, CardHeader, CardContent, CircularProgress, 
  TextField, Button, CardMedia, Grid, CssBaseline,
  Divider, IconButton } 
from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import { GlobalStateContext } from './Context';
import NavbarAlt from './NavbarAlt';
import Links from './Links';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Question = () => {
  const [questionInfo, setQuestionInfo] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { Title } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { _id } = location.state || {};
  // const { userLoggedIn, currentUsername } = useContext(GlobalStateContext);
  const { enqueueSnackbar } = useSnackbar();
  const [preview, setPreview] = useState(false);

  const handlePreview = () => {
    setPreview(!preview);
  };

  const fetchComments = useCallback(() => {
    axios
      .get(`http://localhost:5555/api/v1/question/getComments/${_id}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.comments)) {
          setComments(response.data.comments);
        } else {
          console.error('Invalid data structure received from the API for comments.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [_id]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/api/v1/question/getQuestion/${_id}`)
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

    fetchComments();

  }, [_id, fetchComments]);

  const handleAddComment = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      enqueueSnackbar('Please log in to add a comment.', { variant: 'warning' });
      navigate('/login');
      return;
    }

    if (newComment.trim() === '') {
      enqueueSnackbar('Comment cannot be empty.', { variant: 'warning' });
      return;
    }
  
    axios
      .post(`http://localhost:5555/api/v1/comment/addComment/${_id}`, {
        text: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        enqueueSnackbar('Comment added successfully.', { variant: 'success' });
        setNewComment('');
        fetchComments();
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
        enqueueSnackbar('Failed to add comment. Please try again later.', { variant: 'error' });
      });
  };
  
  const handleLikeComment = (commentId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      enqueueSnackbar('Please log in to like a comment.', { variant: 'warning' });
      navigate('/login');
      return;
    }

    axios
      .patch(`http://localhost:5555/api/v1/comment/likeComment/${commentId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        enqueueSnackbar('You have liked the comment', { variant: 'success' });
        fetchComments();
      })
      .catch((error) => {
        enqueueSnackbar('You have already liked the comment', { variant: 'error' });
        console.log(error);
      });
  };
  
  return (
    <Box
      id="welcome"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <CssBaseline />

      {/* Navbar */}
      <NavbarAlt />

      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          //alignItems: 'center',
          pt: { xs: 10, sm: 15 },
          pb: { xs: 8, sm: 12 },
        }}
      >

        {/* Question */}

        <Box width="100%">
            <Typography textAlign="center" component="h2" variant="h4" color="text.primary">
              {Title}
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : questionInfo.length === 0 ? (
              <Box sx={{ marginTop: 2 }}>
                <Typography textAlign="center" variant="body1" color="text.primary">
                  Unable to fetch question.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ marginTop: 2 }}>
                {questionInfo.map((question, index) => (
                  <div key={index} className="my-4">
                    <Card>
                      {question.Question && (
                          <CardContent>
                            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                              {question.Question}
                            </Typography>
                          </CardContent>
                      )}
                      {question.Image && (
                          <CardMedia 
                            component="img" 
                            alt="Uploaded"  
                            image={question.Image}
                            sx={{
                              width: '100%', 
                              maxHeight: '50vh', 
                              objectFit: 'contain', 
                            }} 
                          />
                      )}
                    </Card>
                  </div>
                ))}
              </Box>
            )}
        </Box>

        {/* Comment Box */}
        
        <Box mt={4} width='100%'>
          {preview ? (
            <Card>
              <CardContent>
                <Markdown remarkPlugins={[remarkGfm]}>
                  {newComment}
                </Markdown>
              </CardContent>
            </Card>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Share your thoughts here. To include code, surround it with 3 backticks ``` (Markdown is supported)"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
              }}
            />
          )}
          <Box mt={2} textAlign="right">
            <Button variant="outlined" color="primary" sx={{ mr: 2 }} onClick={handlePreview}>
              {preview ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="contained" color="primary"  onClick={handleAddComment}>
              Post
            </Button>
          </Box>
        </Box>
        
        <Box mt={3} textAlign="left">
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Comments: {comments.length}
          </Typography>
        </Box>

        {/* Fetch Comments */}
        <Grid container spacing={3} mt={2}>
          {comments.map((comment, index) => (
            <Grid item xs={12} key={index} sx={{ display: 'flex' }}>
              <Card variant='outlined'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flexGrow: 1,
                  p: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    pr: 2,
                  }}
                >
                  <CardHeader
                    // avatar={testimonial.avatar}
                    title={comment.username}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">
                    {comment.text}
                  </Typography>
                </CardContent>

                {/* working here */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    Likes: {comment.likes}
                  </Typography>
                  <IconButton
                    onClick={() => handleLikeComment(comment._id)}
                    sx={{ ml: 1 }}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                </Box>

              </Card>
            </Grid>
          ))}
        </Grid>
        <Box mt={10}>
          <Divider />
          <Links />
        </Box>

      </Container>
      
    </Box>
  );
};

export default Question;
