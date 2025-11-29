import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// POST /auth/register - Register a new user
router.post('/register', register);

// POST /auth/login - Login user
router.post('/login', login);

export default router;
