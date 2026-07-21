const express = require('express');
const cookieParser = require('cookie-parser');
const { connectToDatabase, client } = require('./config/dbConfig.js');
const cors = require('cors');
const livestatsRoutes = require('./routes/livestatsRoutes.js');
const authRoutes = require('./routes/auth.js');
const usersRoutes = require('./routes/users.js');
const multer = require('multer');
const path = require('path');
const app = express();
const fs = require('fs');
const socketIo = require('socket.io');
const { MongoClient } = require('mongodb');
const { attachIO } = require('./utils/attachIO.js');
const stockRoutes = require('./routes/stock.js');

// --- CONFIGURATION CORS PROPRE ---
const allowedOrigins = [
  'https://harrag09.github.io',
  'http://localhost:3002',
  'https://statistics.makseb.fr',
  'http://statistics.makseb.fr',
  'http://localhost:3001',
  'https://statistics.sc3makseb.universe.wf',
  'http://statistics.sc3makseb.universe.wf',
  'http://localhost:3000',
  'http://192.168.1.2:3001',
  'http://192.168.21.79:3001',
  'http://192.168.1.45:3001'
];

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (comme Postman ou les applications mobiles)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'La politique CORS neutorise pas l\'accès depuis cette origine : ' + origin;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Connect to the database
connectToDatabase();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
  res.send('File uploaded successfully !');
});

app.get('/images', (req, res) => {
  const uploadDirectory = 'uploads/';
  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read directory' });
    }
    const imageFiles = files.filter(file => {
      const extname = path.extname(file).toLowerCase();
      return extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.gif';
    });
    res.json({ images: imageFiles });
  });
});

const PORT = process.env.PORT || 8002;

// Routes
app.use('/', livestatsRoutes);
app.use('/', authRoutes);
app.use('/api', usersRoutes);
app.use('/', stockRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;