const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('./validators');
//const User = require('./models/User');
//const { User } = require('./models'); // Correct import of the User model

const { sequelize } = require('./models');
const User = sequelize.models.User;  // Access User model from sequelize instance

console.log(sequelize.models);  // This will show all loaded models
console.log(sequelize.models.User);  // This will show the specific User model



const router = express.Router();

// Route not found handler


// Registration route
router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = req.body;
  console.log(User);  // Check if the `create` method is available
  console.log("Hello");  // Check if the `create` method is available

  try {
    const hashedPassword = await bcrypt.hash(password, 12); // Use salt rounds of 12 for better security
    const newUser = await User.create({ email, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);  // Log the error for debugging purposes
    res.status(500).json({ error: 'Something went wrongq', details: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid email or password' });

    const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';  // Use environment variable for JWT secret
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);  // Log the error for debugging purposes
    res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
});

router.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = router;
