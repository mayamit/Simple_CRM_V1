import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All dashboard routes require authentication
router.use(authMiddleware);

// GET /dashboard/summary - Get dashboard summary statistics
router.get('/summary', getDashboardSummary);

export default router;
