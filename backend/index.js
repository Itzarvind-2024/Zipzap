// /backend/src/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes.js');

// dotenv.config();

const app = express();
// const PORT = process.env.PORT || 8800;
// const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(bodyParser.json());

// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/ZipZap', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// app.post('/api/place-order', async (req, res) => {
//   try {
//     console.log("order is placed");
//   } catch (error) {
//     console.error('Error fetching assigned orders for delivery executive:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.use('/api', orderRoutes);

app.listen(8800, () => {
  console.log(`Server is running on port 8800`);
});
