const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const exp = require('constants');

app.use(express.json());
app.use(cors());

// Connect to MongoDB database using mongoose package.
mongoose.connect('mongodb+srv://arnaldolgonzalez96:jNfxhOUIu6tR0815@cluster0.ltsktky.mongodb.net/e-commerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// API routes.
app.get('/', (req, res) => { // Home route.
  res.send('Hello World!');
});

// Image upload route using multer package.
const storage = multer.diskStorage({
  destination: './uploads/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Upload image middleware.
const upload = multer({
  storage: storage
});

// Upload image endpoint.
app.use('/images', express.static(path.join(__dirname, 'uploads/images'))); // Serve images from the uploads folder.

// Upload image route. The image will be uploaded to the uploads folder and the image URL will be sent back to the client.
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ // Send the image URL back to the client.
    success: 1,
    profile_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// Start the server.
app.listen(port, (err) => {
  if (err) {
    console.log('Error: ', err);
  } else {
    console.log(`Server running on port ${port}`);
  }
});