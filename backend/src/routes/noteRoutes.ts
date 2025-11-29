import { Router } from 'express';
import {
  createNote,
  getCustomerNotes,
  updateNote,
} from '../controllers/noteController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All note routes require authentication
router.use(authMiddleware);

// POST /customers/:id/notes - Create a note for a customer
router.post('/customers/:id/notes', createNote);

// GET /customers/:id/notes - Get all notes for a customer
router.get('/customers/:id/notes', getCustomerNotes);

// PUT /notes/:noteId - Update a note (only by creator)
router.put('/notes/:noteId', updateNote);

export default router;
