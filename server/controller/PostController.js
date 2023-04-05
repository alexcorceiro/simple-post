const Post = require("../models/PostSchema")
const fs = require("fs")
const path = require("path")

exports.createPost = async (req, res) => {
    const { title, description } = req.body;
    const images = req.files.map((file) => {
      const newName = `${Date.now()}-${file.originalname}`;
      fs.renameSync(file.path, `images/${newName}`);
      return `/images/${newName}`;
    });
  
    try {
      const newPost = new Post({ title, description, images });
      const post = await newPost.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error creating post', error });
    }
  };
  
  exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  
  }

  exports.getPostById = async (req, res) => {
    try{
     const post = await Post.findById(req.params.id)
     if(!post){
        res.status(404).json({ error : "post introuvable"})
     } else {
        res.status(200).json(post)
     }
    }catch(err){
        res.status(500).json({ error: err.message})
    }
  }

  exports.updatePostById = async (req, res) => {
    try{
        const updatePost = await Post.findByIdAndUpdate(
            req.params.id, req.body, { new:  true}
        );

        if(!updatePost){
            res.status(404).json({ error: "post introuvable"})
        } else {
            res.status(200).json(updatePost)
        }
    }catch(err){
        res.status(500).json({ error : err.message})
    }
  }


  exports.deletePostById = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Delete images
      for (const image of post.images) {
        const imagePath = path.join(__dirname, '..', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        } else {
          console.log('File not found:', imagePath);
        }
      }
  
      // Delete post
      await Post.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Error deleting post' });
    }
  }