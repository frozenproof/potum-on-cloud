const { spawn } = require('child_process');
const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const rateLimit = require('express-rate-limit');

// Rate limiter: each IP can only make a request every 2 seconds
const limiter = rateLimit({
  windowMs: 2000, // 2 seconds
  max: 29, // Limit each IP to 1 request per windowMs
  message: 'Too many requests, please wait a moment.',
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
    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send('Proxy server error');
    }
  }
});

// Proxy server listens on port 4000
app.listen(4000, () => {
  console.log('Proxy server running on http://localhost:4000');
});

// Clean up on exit
process.on('exit', () => {
  childProcess.kill();
});
