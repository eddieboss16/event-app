import { Prisma, Event } from "@prisma/client";
import { prisma } from "../config/database";


export interface CreateEventData {
    title: string;
    description: string;
    category: string;
    venue: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    price: number;
    totalTickets: number;
    imageUrl?: string;
  }
  
  export interface UpdateEventData extends Partial<CreateEventData> {
    isSoldOut?: boolean;
    isActive?: boolean;
  }
  
  class EventsService {
    async createEvent(data: CreateEventData): Promise<Event> {
      return await prisma.event.create({
        data: {
          ...data,
          soldTickets: 0,
          isSoldOut: false,
          isActive: true,
        },
      });
    }
  
    async getEvents(filters?: {
      category?: string;
      search?: string;
      isActive?: boolean;
      limit?: number;
      offset?: number;
    }): Promise<Event[]> {
      const where: Prisma.EventWhereInput = {};
  
      if (filters?.category) {
        where.category = filters.category;
      }
  
      if (filters?.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
  
      if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
      }
  
      return await prisma.event.findMany({
        where,
        orderBy: { date: 'asc' },
        take: filters?.limit,
        skip: filters?.offset,
      });
    }
  
    async getEventById(id: string): Promise<Event | null> {
      return await prisma.event.findUnique({
        where: { id },
        include: {
          feedback: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
    }
  
    async updateEvent(id: string, data: UpdateEventData): Promise<Event> {
      return await prisma.event.update({
        where: { id },
        data,
      });
    }
  
    async deleteEvent(id: string): Promise<void> {
      await prisma.event.delete({
        where: { id },
      });
    }
  
    async checkAvailability(eventId: string, requestedQuantity: number): Promise<{
      available: boolean;
      remainingTickets: number;
    }> {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { totalTickets: true, soldTickets: true, isSoldOut: true },
      });
  
      if (!event) {
        throw new Error('Event not found');
      }
  
      if (event.isSoldOut) {
        return { available: false, remainingTickets: 0 };
      }
  
      const remainingTickets = event.totalTickets - event.soldTickets;
      const available = remainingTickets >= requestedQuantity;
  
      return { available, remainingTickets };
    }
  
    async reserveTickets(eventId: string, quantity: number): Promise<void> {
      await prisma.$transaction(async (prisma) => {
        const event = await prisma.event.findUnique({
          where: { id: eventId },
          select: { totalTickets: true, soldTickets: true, isSoldOut: true },
        });
  
        if (!event) {
          throw new Error('Event not found');
        }
  
        if (event.isSoldOut) {
          throw new Error('Event is sold out');
        }
  
        const newSoldTickets = event.soldTickets + quantity;
        
        if (newSoldTickets > event.totalTickets) {
          throw new Error('Not enough tickets available');
        }
  
        const isSoldOut = newSoldTickets >= event.totalTickets;
  
        await prisma.event.update({
          where: { id: eventId },
          data: {
            soldTickets: newSoldTickets,
            isSoldOut,
          },
        });
      });
    }
  
    async getEventStats(eventId: string) {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          payments: {
            where: { status: 'COMPLETED' },
            select: { amount: true, ticketQuantity: true },
          },
          feedback: {
            select: { rating: true },
          },
        },
      });
  
      if (!event) {
        throw new Error('Event not found');
      }
  
      const totalRevenue = event.payments.reduce((sum, payment) => sum + payment.amount, 0);
      const totalTicketsSold = event.payments.reduce((sum, payment) => sum + payment.ticketQuantity, 0);
      const averageRating = event.feedback.length > 0 
        ? event.feedback.reduce((sum, f) => sum + f.rating, 0) / event.feedback.length
        : 0;
  
      return {
        totalRevenue,
        totalTicketsSold,
        remainingTickets: event.totalTickets - totalTicketsSold,
        averageRating: Math.round(averageRating * 10) / 10,
        feedbackCount: event.feedback.length,
      };
    }
  }
  
  export const eventsService = new EventsService();