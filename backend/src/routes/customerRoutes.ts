import { Router } from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  assignCustomer,
} from '../controllers/customerController';
import { authMiddleware, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// All customer routes require authentication
router.use(authMiddleware);

// POST /customers - Create a new customer
router.post('/', createCustomer);

// GET /customers - Get all customers (with pagination)
router.get('/', getCustomers);

// GET /customers/:id - Get a single customer by ID
router.get('/:id', getCustomerById);

// PUT /customers/:id - Update a customer
router.put('/:id', updateCustomer);

// DELETE /customers/:id - Delete a customer (soft delete)
router.delete('/:id', deleteCustomer);

// PUT /customers/:id/assign - Assign customer to a user (Admin only)
router.put('/:id/assign', requireAdmin, assignCustomer);

export default router;
