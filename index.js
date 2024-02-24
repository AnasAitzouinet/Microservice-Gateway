const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config()
const cors = require('cors');

const authorizeApiKey = (req, res, next) => {
    // Define URLs that do not require API key authorization
    const excludedUrls = ['/auth/google', '/auth/google/redirect', '/auth/linkedin', '/auth/linkedin/redirect']; // Add URLs to exclude here

    // Check if the request URL is in the excluded list
    if (excludedUrls.includes(req.path)) {
        // Skip API key authorization for excluded URLs
        return next();
    }

    const apiKey = req.header('Authorization');

    // Check if API key exists and is valid (e.g., check against authorized keys)
    if (!apiKey || apiKey !== 'Bearer YOUR_API_KEY') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Authorized, proceed to next middleware
    next();
};
app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
);
app.use(authorizeApiKey)


app.get('/', (req, res) => {
    res.send('This is the main route!')
})

app.use('/auth', createProxyMiddleware({ target: 'http://localhost:8080', changeOrigin: true }));
app.use('/Chat', createProxyMiddleware({ target: 'http://localhost:7070', changeOrigin: true }));

app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening at http://localhost:${port}`)
});