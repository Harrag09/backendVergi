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
const { updateStatus } = require('./controllers/livestatsController.js');
// const CronJob = require('cron').CronJob;
const socketIo = require('socket.io');
const { MongoClient } = require('mongodb');
const { attachIO } = require('./utils/attachIO.js');
const stockRoutes = require('./routes/stock.js');


// Enable CORS for the specific origin
app.use(cors({
  origin: [
    'https://harrag09.github.io',
      'https://harrag09.github.io',
      'https://harrag09.github.io/vallonnieres-wms/',
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

  ],
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  credentials: true,
}));



app.options('*', cors());


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



//CHANGE STATUS DE ALL USER CHAQUE 10 MIN
// const job = new CronJob('*/10 * * * *', updateStatus);
// job.start();
//CHANGE STATUS DE ALL USER CHAQUE 5 MIN
// const job = new CronJob('*/5 * * * *', updateStatus);





app.get('/images', (req, res) => {
  const uploadDirectory = 'uploads/';

  // Read the contents of the upload directory
  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read directory' });
    }

    // Filter out only the image files
    const imageFiles = files.filter(file => {
      const extname = path.extname(file).toLowerCase();
      return extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.gif';
    });

    // Send the array of image file names in the response
    res.json({ images: imageFiles });
  });
});



// const db = client.db('test');
// const collection = db.collection('store');
// const changeStream = collection.watch();
// changeStream.on('change', async (change) => {
//   const { documentKey ,updateDescription} = change;
//   const response = await collection.findOne({ _id:documentKey.companyId });
// console.log("Update : ",change);
// });



const PORT = 8002;

// Start the server



// Routes
app.use('/', livestatsRoutes);
// app.use('/', attachIO(io),authRoutes);
app.use('/', authRoutes);
app.use('/api', usersRoutes);
app.use('/', stockRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
 
});
// const io = socketIo(server, {
//   cors: {
//     origin: [
//       'https://harrag09.github.io',
//       'http://localhost:3002',
//       'https://statistics.makseb.fr',
//       'http://statistics.makseb.fr',
//       'http://localhost:3001',
//       'https://statistics.sc3makseb.universe.wf',
//       'http://statistics.sc3makseb.universe.wf',
//       'http://localhost:3000',
//       'http://192.168.1.2:3001',
//       'http://192.168.1.45:3001'
//     ],
//     methods: ['GET', 'POST'],
//     credentials: true
//   }
// });
// const db = client.db('statistiques');
// const collection = db.collection('TempsReels');
// const changeStream = collection.watch();
// changeStream.on('change', async (change) => {
  
//  const { documentKey} = change;
//  const response = await collection.findOne({ _id:documentKey._id });
//  if(response!=null){ 
  
//   const aa = response;
// console.log(`UpdateTempsReels${aa.IdCRM}`)
//  io.emit(`UpdateTempsReels${aa.IdCRM}`, {  _id: documentKey._id}); 
// //  io.emit(`UpdateTempsReelss`, {_id: documentKey._id, objectUpdate: response}); 
// }
// });







module.exports = app;