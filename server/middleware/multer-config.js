const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
});

const imageFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new Error('Only image files are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5000000, // 5MB
  },
});

module.exports = {
  upload,
  processImages: async (req, res, next) => {
    if (!req.files) {
      return res.status(400).json({ error: 'No image files were provided' });
    }

    try {
      await Promise.all(
        req.files.map(async (file) => {
          const inputPath = path.join('images', file.filename);
          // const outputPath = path.join('images', 'copie-' + file.filename);

          await sharp(inputPath)
            .resize(800, 800, {
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            })
          //   .toFile(outputPath);

          // file.filename = 'copie-' + file.filename;
        })
      );
      next();
    } catch (error) {
      console.error('Error processing images:', error.message);
      res.status(500).json({ error: 'Error processing images' });
    }
  },
};
