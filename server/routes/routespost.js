const express = require('express');
const { upload, processImages } = require('../middleware/multer-config');
const { createPost, getPosts, getPostById, deletePostById, updatePostById } = require('../controller/PostController');
const router = express.Router();

router.post('/post', upload.array('images', 10), processImages, createPost)
router.get('/post', getPosts)
router.get('/post/:id', getPostById)
router.put('/post/:id', updatePostById)
router.delete("/post/:id", deletePostById)

module.exports= router