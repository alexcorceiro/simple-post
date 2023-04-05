import React , { useState}from 'react'
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';


function FromPost() {
    const [post, setPost] = useState({ title: '', description: '', images: [] })
    const [previewImages, setPreviewImages] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('description', post.description);
        post.images.forEach((image) => formData.append('images', image));

        try{
            await axios.post("http://localhost:3200/api/post", formData)
            alert("post crée avec seccée")
        }catch(err){
            console.error(err)
        }
    }
    const handleChange = (e) => {
      const { name, value } = e.target;
      setPost({ ...post, [name]: value });
    };
  
    const handleImageChange = (e) => {
      const filesArray = Array.from(e.target.files);
      setPost({ ...post, images: [...post.images, ...filesArray] });
  
      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previewUrls]);
    };

    return (
      <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Créer un nouveau post
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Titre"
                name="title"
                value={post.title}
                onChange={handleChange}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={post.description}
                onChange={handleChange}
                required
              />
            </Box>
            <input
              type="file"
              name="images"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              id="image-upload"
              style={{ display: 'none' }}
            />
            <Box mb={2}>
              <label htmlFor="image-upload">
                <Button variant="contained" component="span">
                  Ajouter des images
                </Button>
              </label>
            </Box>
            <Box mb={2}>
              {previewImages.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="Aperçu"
                  style={{ maxHeight: 100, marginRight: 10 }}
                />
              ))}
            </Box>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Créer
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
      );
}

export default FromPost