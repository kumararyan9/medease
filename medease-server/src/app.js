import express from 'express';
import corsMiddleware from '@/middleware/cors.js';
import connectDB from '@/config/db.js';
import connectCloudinary from '@/config/cloudinary.js';
import traceIdMiddleware from '@/middleware/traceId.js';
import { requestLoggerMiddleware, bodyLoggerMiddleware } from '@/middleware/requestLogger.js';
import errorHandler from '@/middleware/errorHandler.js';
import routes from '@/routes/index.js';
import docsRoutes from '@/docs/docs.routes.js';

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

export { connectDB, connectCloudinary };
export default app;
