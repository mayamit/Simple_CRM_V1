import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

const VALID_STATUSES = ['Lead', 'Prospect', 'Active', 'Inactive'];

// GET /dashboard/summary - Get dashboard summary statistics
export const getDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
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

    // Get total customers count
    const totalCustomers = await prisma.customer.count({
      where: whereClause,
    });

    // Get customers by status
    const customersByStatusRaw = await prisma.customer.groupBy({
      by: ['status'],
      where: whereClause,
      _count: {
        status: true,
      },
    });

    // Convert to object/map format
    const customersByStatus: { [key: string]: number } = {};

    // Initialize all statuses to 0
    VALID_STATUSES.forEach(status => {
      customersByStatus[status] = 0;
    });

    // Fill in actual counts
    customersByStatusRaw.forEach(item => {
      customersByStatus[item.status] = item._count.status;
    });

    // Get activities (notes) created in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Build where clause for notes based on role
    const notesWhereClause: any = {
      createdAt: {
        gte: sevenDaysAgo,
      },
    };

    // Standard users only see notes for their assigned customers
    if (userRole === 'USER') {
      notesWhereClause.customer = {
        assignedToUserId: userId,
        isDeleted: false,
      };
    } else {
      // Admins see all notes for non-deleted customers
      notesWhereClause.customer = {
        isDeleted: false,
      };
    }

    const activitiesLast7Days = await prisma.note.count({
      where: notesWhereClause,
    });

    res.status(200).json({
      totalCustomers,
      customersByStatus,
      activitiesLast7Days,
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({ error: 'Internal server error while fetching dashboard summary' });
  }
};
