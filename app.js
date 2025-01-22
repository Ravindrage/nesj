const express = require('express');
const bodyParser = require('body-parser');
const { User } = require('./models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT ;
const authRoutes = require('./authRoutes'); // Import the routes


app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});



const tryPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve(server));
    server.on('error', reject);
  });
};

const findOpenPort = async () => {
  for (let port = 3008; port <= 3050; port++) {
    try {
      await tryPort(port);
      console.log(`Server running on http://localhost:${port}`);
      break;
    } catch (error) {
      console.log(`Port ${port} is in use, trying next...`);
    }
  }
};

findOpenPort();



// Middleware and routes would be set up here

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


const authenticateToken = require('./middleware/auth'); // Import the middleware


// Example of a protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});


const { sequelize } = require('./models'); // Ensure sequelize is properly imported

sequelize.sync()
  .then(() => {
    console.log('Database synced!');
  })
  .catch((error) => {
    console.error('Error syncing the database:', error);
  });



