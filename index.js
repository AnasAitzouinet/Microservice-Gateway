const express = require('express');
const app = express();
const port = 3000;
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config()

const authorizeApiKey = (req, res, next) => {
    const apiKey = req.header('Authorization');
  
    // Check if API key exists and is valid (e.g., check against authorized keys)
    if (!apiKey || apiKey !== 'YOUR_API_KEY') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    // Authorized, proceed to next middleware
    next();
  };

// app.use(authorizeApiKey)
app.get('/',(req, res) => {
    res.send('This is the main route!')
})
app.use('/auth', createProxyMiddleware({ target: 'https://known-country-production.up.railway.app', changeOrigin: true }));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    });