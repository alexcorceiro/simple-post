import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  CircularProgress,
  Button,
  CardActions,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import "./css/lispost.css"

const GetPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formValues, setFormValues] = useState({ title: '', description: '' });

  const handleOpen = (post) => {
    setCurrentPost(post);
    setFormValues({ title: post.title, description: post.description });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchPosts();
    
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3200/api/post');
      setPosts(response.data);
      console.log(response.data)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:3200/api/post/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleUpdate = async () => {
    if (!currentPost) return;

    try {
      const updatedPost = {
        ...currentPost,
        title: formValues.title,
        description: formValues.description,
        // images: ...
      };

      const response = await axios.put(`http://localhost:3200/api/post/${currentPost._id}`, updatedPost);

      if (response.data) {
        // Mettre à jour le tableau des posts avec le post modifié
        const updatedPosts = posts.map((post) => (post._id === currentPost._id ? response.data : post));
        setPosts(updatedPosts);

        // Fermez le modal
        setOpen(false);
      } else {
        console.error('Error updating post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <Container>
    <Typography variant="h4" component="h2" gutterBottom>
      Liste des posts
    </Typography>
    <Box display="flex" flexWrap="wrap" >
      {posts.map((post) => (
        <Card key={post._id} className='box-principal'>
          <CardContent>
            <Typography variant="h5" component="h2" >
              {post.title}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {post.description}
            </Typography>
          </CardContent>
          {post.images.map((image, index) => {
           // Ajouter cette ligne
            return (
           <CardMedia
            key={index}
            component="img"
            image={`http://localhost:3200${image}`}
            alt={`Image ${index + 1}`}
            className='box-image'
             />
             );
            })}
          <CardActions>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => deletePost(post._id)}
              >
                Supprimer
              </Button>
              <Button size="small" color="primary" onClick={() => handleOpen(post)}>
                  Update
                </Button>
            </CardActions>
        </Card>
      ))}
    </Box>

    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Post</DialogTitle>
        <DialogContent>
          {currentPost && (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="title"
                label="Title"
                type="text"
                value={formValues.title}
                onChange={handleChange}
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                name="description"
                label="Description"
                type="text"
                value={formValues.description}
                onChange={handleChange}
                fullWidth
                variant="standard"
              />
              {/* Vous pouvez également ajouter des champs pour les images ici */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
  </Container>
  );
};

export default GetPosts;
