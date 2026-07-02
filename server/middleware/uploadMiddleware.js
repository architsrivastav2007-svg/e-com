import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new Error('Only image files are allowed'));
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

export default upload;