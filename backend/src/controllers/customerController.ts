import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

const VALID_STATUSES = ['Lead', 'Prospect', 'Active', 'Inactive'];

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CreateCustomerBody {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
  assignedToUserId?: string;
}

interface UpdateCustomerBody {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  assignedToUserId?: string;
}

// POST /customers - Create a new customer
export const createCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, company, status = 'Lead', assignedToUserId }: CreateCustomerBody = req.body;

    // Validate required fields
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Validate status
    if (status && !VALID_STATUSES.includes(status)) {
      res.status(400).json({
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
      return;
    }

    // Check if email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      res.status(409).json({ error: 'Customer with this email already exists' });
      return;
    }

    // Validate assignedToUserId if provided
    if (assignedToUserId) {
      const user = await prisma.user.findUnique({
        where: { id: assignedToUserId },
      });

      if (!user) {
        res.status(400).json({ error: 'Invalid assignedToUserId' });
        return;
      }
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        company,
        status,
        assignedToUserId,
      },
      include: {
        assignedToUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Customer created successfully',
      customer,
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error while creating customer' });
  }
};

// GET /customers - Get all customers with pagination (role-based filtering)
export const getCustomers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const userRole = req.userRole!;
    const userId = req.userId!;

    // Build where clause based on role
    const whereClause: any = {
      isDeleted: false,
    };

    // Standard users only see customers assigned to them
    if (userRole === 'USER') {
      whereClause.assignedToUserId = userId;
    }
    // Admins see all customers (no additional filter needed)

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          assignedToUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.customer.count({
        where: whereClause,
      }),
    ]);

    res.status(200).json({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error while fetching customers' });
  }
};

// GET /customers/:id - Get a single customer by ID
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        assignedToUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!customer || customer.isDeleted) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.status(200).json({ customer });
  } catch (error) {
    console.error('Get customer by ID error:', error);
    res.status(500).json({ error: 'Internal server error while fetching customer' });
  }
};

// PUT /customers/:id - Update a customer
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, status, assignedToUserId }: UpdateCustomerBody = req.body;

    // Check if customer exists and is not deleted
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer || existingCustomer.isDeleted) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    // Validate email format if provided
    if (email && !EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Check if email is being changed and if new email already exists
    if (email && email !== existingCustomer.email) {
      const emailExists = await prisma.customer.findUnique({
        where: { email },
      });

      if (emailExists) {
        res.status(409).json({ error: 'Customer with this email already exists' });
        return;
      }
    }

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      res.status(400).json({
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
      return;
    }

    // Validate assignedToUserId if provided
    if (assignedToUserId !== undefined) {
      if (assignedToUserId !== null) {
        const user = await prisma.user.findUnique({
          where: { id: assignedToUserId },
        });

        if (!user) {
          res.status(400).json({ error: 'Invalid assignedToUserId' });
          return;
        }
      }
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(company !== undefined && { company }),
        ...(status && { status }),
        ...(assignedToUserId !== undefined && { assignedToUserId }),
      },
      include: {
        assignedToUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      message: 'Customer updated successfully',
      customer,
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error while updating customer' });
  }
};

// DELETE /customers/:id - Soft delete a customer
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer || customer.isDeleted) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    // Soft delete
    await prisma.customer.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({
      message: 'Customer deleted successfully',
      customerId: id,
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error while deleting customer' });
  }
};

// PUT /customers/:id/assign - Assign customer to a user (Admin only)
export const assignCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { assignedToUserId } = req.body;

    // Validate assignedToUserId
    if (assignedToUserId !== null && assignedToUserId !== undefined) {
      if (typeof assignedToUserId !== 'string') {
        res.status(400).json({ error: 'assignedToUserId must be a string or null' });
        return;
      }

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: assignedToUserId },
      });

      if (!user) {
        res.status(400).json({ error: 'Invalid assignedToUserId: user not found' });
        return;
      }
    }

    // Check if customer exists and is not deleted
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer || existingCustomer.isDeleted) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    // Update assignment
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        assignedToUserId: assignedToUserId === null ? null : assignedToUserId,
      },
      include: {
        assignedToUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      message: 'Customer assigned successfully',
      customer,
    });
  } catch (error) {
    console.error('Assign customer error:', error);
    res.status(500).json({ error: 'Internal server error while assigning customer' });
  }
};
