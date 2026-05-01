// dotenv
require('dotenv').config();
// models
require('./models');

// express
const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const app = express();

// en DEV
app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));

// body parser
app.use(express.json());

// routes
app.use('/api/upload', require('./routes/upload'));
app.use('/api/generate', require('./routes/generate'));
app.use('/api/projects', require('./routes/project'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/auth', require('./routes/auth'));

// health check
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  res.json({ status: 'ok', uptime });
});


// start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('📦 DB connected');

    await sequelize.sync();
    console.log('📦 DB synced');

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

start();