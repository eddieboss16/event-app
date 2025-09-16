import { Request, Response} from 'express';
import { prisma } from "../config/database";
import { AuthRequest } from "../middleware/auth.middleware";

export const submitFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { eventId, rating, comment } = req.body;
        const userId = req.user!.userId;

        // Check if user has already submitted feedback for this event
        const existingFeedback = await prisma.feedback.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId,
                },
            },
        });

        if (existingFeedback) {
            res.status(400).json({
                success: false,
                message: 'You have already submitted for this event',
            });
            return;
        }

        //Check if user has purchased tickets for this event
        const hasTicket = await prisma.payment.findFirst({
            where: {
                userId,
                eventId,
                status: 'COMPLETED',
            },
        });

        if (!hasTicket) {
            res.status(403).json({
                success: false,
                message: 'You can only provide feedback for events you have attended',
            });
            return;
        }

        const feedback = await prisma.feedback.create({
            data: {
                userId,
                eventId,
                rating,
                comment,
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                event: {
                    select: {
                        title: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: { feedback },
        });
    } catch (error: any) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback',
        });
    }
};

export const getEventFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const feedback = await prisma.feedback.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const feedbackStats = await prisma.feedback.aggregate({
      where: { eventId },
      _avg: { rating: true },
      _count: { id: true },
    });

    res.json({
      success: true,
      data: {
        feedback,
        stats: {
          averageRating: feedbackStats._avg.rating || 0,
          totalFeedback: feedbackStats._count.id,
        },
      },
    });
  } catch (error: any) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
    });
  }
};

export const getUserFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { limit = 10, offset = 0 } = req.query;

    const feedback = await prisma.feedback.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            title: true,
            date: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json({
      success: true,
      data: { feedback },
    });
  } catch (error: any) {
    console.error('Get user feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user feedback',
    });
  }
};