const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const secretKey = 'your-secret-key';

app.use(cors());
app.use(bodyParser.json());

const users = []; // This should be replaced with your actual database

// Signup Route
app.post('/register', async (req, res) => {
  const { email, username, password, fname, lname, phone_number } = req.body;

  // Hash the password before saving to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ email, username, password: hashedPassword, fname, lname, phone_number });
  res.json({ message: 'Account created successfully' });
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Compare the password with the hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Create a JWT token
  const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

  res.json({ message: 'Login successful', token });
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token is required');

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');
    req.user = decoded;
    next();
  });
};

// Protected route
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}! This is a protected route.` });
});

app.listen(3001, () => console.log('Server running on port 3001'));
