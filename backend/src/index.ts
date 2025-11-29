import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';
import { authMiddleware, AuthRequest } from './middleware/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Simple CRM Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use('/auth', authRoutes);

// Customer routes (protected)
app.use('/customers', customerRoutes);

// Protected route example
app.get('/protected', authMiddleware, (req: AuthRequest, res: Response) => {
  res.status(200).json({
    message: 'This is a protected route',
    user: {
      userId: req.userId,
      email: req.userEmail,
      role: req.userRole,
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
