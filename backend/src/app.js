const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config/env');

// Routes
const authRoutes = require('./routes/auth.routes');
const citiesRoutes = require('./routes/cities.routes');
const weatherRoutes = require('./routes/weather.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/weather', weatherRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;