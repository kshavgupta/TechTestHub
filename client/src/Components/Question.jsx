import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { alpha, Box, Typography, Container, Card, CardHeader, CardContent, CircularProgress, 
  TextField, Button, CardMedia, Grid, CssBaseline, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions, Divider, IconButton } 
from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
// import { GlobalStateContext } from './Context';
import NavbarAlt from './NavbarAlt';
import Links from './Links';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Question = ({mode, toggleColorMode}) => {
  const [questionInfo, setQuestionInfo] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { Title } = useParams();
  // const navigate = useNavigate();
  const location = useLocation();
  const { _id } = location.state || {};
  // const { userLoggedIn, currentUsername } = useContext(GlobalStateContext);
  const { enqueueSnackbar } = useSnackbar();
  const [preview, setPreview] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState({});

  const handleClickOpen = (comment) => {
    setSelectedComment(comment);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedComment(null);
  };

  const handleConfirmDelete = () => {
    handleDelete(selectedComment); 
    handleClose();
  };

  const handlePreview = () => {
    setPreview(!preview);
  };

  const fetchComments = useCallback(() => {
    axios
      .get(`https://techtesthub.onrender.com/api/v1/question/getComments/${_id}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.comments)) {
          setComments(response.data.comments);
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'An error occurred';
        enqueueSnackbar(message, { variant: 'error' });
        console.log(error);
      });
  }, [_id, enqueueSnackbar]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://techtesthub.onrender.com/api/v1/question/getQuestion/${_id}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setQuestionInfo(response.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'An error occurred';
        enqueueSnackbar(message, { variant: 'error' });
        console.log(error);
      });

    fetchComments();

  }, [_id, fetchComments, enqueueSnackbar]);

  const handleAddComment = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      enqueueSnackbar('Please log in to add a comment.', { variant: 'warning' });
      return;
    }

    if (newComment.trim() === '') {
      enqueueSnackbar('Comment cannot be empty.', { variant: 'warning' });
      return;
    }
  
    axios
      .post(`https://techtesthub.onrender.com/api/v1/comment/addComment/${_id}`, {
        text: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const { message } = response.data;
        enqueueSnackbar(message, { variant: 'success' });
        setNewComment('');
        fetchComments();
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'An error occurred';
        enqueueSnackbar(message, { variant: 'error' });
        console.log(error);
      });
  };

  const handleLikeComment = (commentId) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      enqueueSnackbar('Please log in to upvote a comment.', { variant: 'warning' });
      return;
    }
  
    axios
      .patch(`https://techtesthub.onrender.com/api/v1/comment/likeComment/${commentId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const { message } = response.data;
        enqueueSnackbar(message, { variant: 'success' });
        fetchComments();
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'An error occurred';
        enqueueSnackbar(message, { variant: 'error' });
        console.log(error);
      });
  };
  
  const handleDislikeComment = (commentId) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      enqueueSnackbar('Please log in to downvote a comment.', { variant: 'warning' });
      return;
    }
  
    axios
      .patch(`https://techtesthub.onrender.com/api/v1/comment/dislikeComment/${commentId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const { message } = response.data;
        enqueueSnackbar(message, { variant: 'success' });
        fetchComments();
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'An error occurred';
        enqueueSnackbar(message, { variant: 'error' });
        console.log(error);
      });
  };

  const handleDelete = (comment) => {
    const token = localStorage.getItem('token');
    if (!token) {
      enqueueSnackbar('Please log in to delete the comment.', { variant: 'warning' });
      return;
    }

    axios.delete(`https://techtesthub.onrender.com/api/v1/comment/deleteComment/${comment._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
      fetchComments();
    })
    .catch((error) => {
      const message = error.response?.data?.message || 'An error occurred';
      enqueueSnackbar(message, { variant: 'error' });
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
      <NavbarAlt mode={ mode } toggleColorMode={ toggleColorMode }/>

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
              placeholder="Share your thoughts here."
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
                  <CardHeader 
                    title={comment.username} 
                    action={
                      <IconButton
                        sx={{ mr: 1.83}}
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClickOpen(comment)
                        }}  
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                <CardContent>
                  <Typography variant="h6" color="text.secondary">
                    {comment.text}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 2,
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      Upvotes: {comment.likes}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                      onClick={() => handleLikeComment(comment._id)}
                      sx={{ color: 'green' }}
                    >
                      <ArrowDropUpIcon sx={{ fontSize: 40 }}/>
                    </IconButton>
                    <IconButton
                      onClick={() => handleDislikeComment(comment._id)}
                      sx={{ color: 'red' }}
                    >
                      {/* <ThumbDownIcon /> */}
                      <ArrowDropDownIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              backgroundSize: 'cover',
              borderRadius: '10px',
              outline: '1px solid',
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you really want to delete this comment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <Box mt={10}>
          <Divider />
          <Links />
        </Box>

      </Container>
      
    </Box>
  );
};

export default Question;
