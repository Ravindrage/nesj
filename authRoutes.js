const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('./validators');
const nodemailer = require('nodemailer'); // For sending emails

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


// Forget Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const token = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour

    // Update user with the token and expiration
    user.resetPasswordToken = token;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      debug: true // Enable debug output
    });

       console.log(transporter.host);
    transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP Connection Error:', error);
      } else {
        console.log('SMTP Connection Successful:', success);
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this email because you (or someone else) have requested to reset your password.\n\n
      Please click on the following link, or paste it into your browser to complete the process within one hour of receiving it:\n\n
      http://localhost:3008/auth/reset-password/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred', details: err.message });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Sequelize.Op.gt]: Date.now() } // Ensure token is not expired
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user with the new password and clear the reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password successfully reset.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred', details: err.message });
  }
});


router.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = router;
