import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
 // console.log("MONGODB_URI:", process.env.MONGODB_URI);
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
