const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const multer = require('multer');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();
app.use(cors());

app.use(express.json());


app.use('/uploads', express.static('uploads'));


app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/student', studentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
