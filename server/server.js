const express = require('express');
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const cors = require("cors")
const postRoute = require("./routes/routespost.js")
const PORT = process.env.PORT || 3200
require("dotenv").config()

app.use(express.json())
app.use(cors())
app.use("/api", postRoute)
app.use('/images', express.static(path.join(__dirname, 'images')))


mongoose.connect('mongodb://127.0.0.1:27017/my_post', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à la base de données réussie'))
  .catch((err) => console.log('Erreur de connexion à la base de données', err));


  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  });

app.listen(PORT, () => {
    console.log(`server demarer sur http://localhost:${PORT}`)
})