import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

interface CreateNoteBody {
  content: string;
}

interface UpdateNoteBody {
  content: string;
}

// POST /customers/:id/notes - Create a note for a customer
export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: customerId } = req.params;
    const { content }: CreateNoteBody = req.body;
    const createdByUserId = req.userId!;

    // Validate required field
    if (!content || content.trim().length === 0) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    // Check if customer exists and is not deleted
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer || customer.isDeleted) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const note = await prisma.note.create({
      data: {
        customerId,
        createdByUserId,
        content: content.trim(),
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Internal server error while creating note' });
  }
};

// GET /customers/:id/notes - Get all notes for a customer (most recent first)
export const getCustomerNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: customerId } = req.params;

    // Check if customer exists and is not deleted
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer || customer.isDeleted) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const notes = await prisma.note.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc', // Most recent first
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      customerId,
      customerName: customer.name,
      notes,
      total: notes.length,
    });
  } catch (error) {
    console.error('Get customer notes error:', error);
    res.status(500).json({ error: 'Internal server error while fetching notes' });
  }
};

// PUT /notes/:noteId - Update a note (only by creator)
export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { noteId } = req.params;
    const { content }: UpdateNoteBody = req.body;
    const userId = req.userId!;

    // Validate content
    if (!content || content.trim().length === 0) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    // Check if note exists
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    // Check if user is the creator of the note
    if (existingNote.createdByUserId !== userId) {
      res.status(403).json({ error: 'You can only edit your own notes' });
      return;
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        content: content.trim(),
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      message: 'Note updated successfully',
      note,
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Internal server error while updating note' });
  }
};
