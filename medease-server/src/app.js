const express = require('express');
const corsMiddleware = require('./middleware/cors');
const connectDB = require('./config/db');
const connectCloudinary = require('./config/cloudinary');
const traceIdMiddleware = require('./middleware/traceId');
const { requestLoggerMiddleware, bodyLoggerMiddleware } = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes/index');
const docsRoutes = require('./routes/index');

const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(traceIdMiddleware);
app.use(requestLoggerMiddleware);
app.use(bodyLoggerMiddleware);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to MedEase API',
    status: 'API is running successfully',
    author: 'Kumar Aryan',
  });
});

app.use(docsRoutes);
app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

app.use(errorHandler);

module.exports = app;
module.exports.connectDB = connectDB;
module.exports.connectCloudinary = connectCloudinary;
