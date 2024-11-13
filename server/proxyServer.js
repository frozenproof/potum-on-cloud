const { spawn } = require('child_process');
const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const { Pool } = require('pg');

// Use Helmet for basic security headers
app.use(helmet());

// Set up PostgreSQL logging
// const pool = new Pool({
//   user: 'your_user',
//   host: 'localhost',
//   database: 'your_database',
//   password: 'your_password',
//   port: 5432,
// });

// Rate limiter: each IP can only make a request every 2 seconds
const limiter = rateLimit({
  windowMs: 900, // 2 seconds
  max: 2, // Limit each IP to 1 request per windowMs
  message: 'Too many requests, please wait a moment. Yeah fuck you and your free uses.',
});

app.use(limiter); // Apply rate limiting to all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start server.js as a child process
const childProcess = spawn('node', ['server/server.js'], { stdio: 'inherit' });
// The proxy server need this because the proxy server is now the one serving static files
app.use('/images', express.static(path.join(__dirname, '../images')));
// The reason why we can run the excels as normal are because the resource itself is found by the child server, which then got rendered into raw html then sent to the proxy server

// Proxy all requests to server.js running as a child process
app.use(async (req, res) => {
  try {
    const targetUrl = `http://localhost:5000${req.originalUrl}`; // Keep URL intact
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: req.headers,
      data: req.body,
    });
    // console.log(req.method, req.originalUrl, req.headers, req.body, targetUrl)
    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send('Proxy server error');
    }
  }
});

// Proxy server listens on port 6000
// Use port 4000 for the proxy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Proxy server running on ${PORT}`);
});

// Clean up on exit
process.on('exit', () => {
  childProcess.kill();
});
