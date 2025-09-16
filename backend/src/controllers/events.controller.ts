import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { CreateEventData, eventsService, UpdateEventData } from "../services/events.services";


export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const eventData: CreateEventData = req.body;
      
      // Convert date strings to Date objects
      eventData.date = new Date(eventData.date);
      eventData.startTime = new Date(eventData.startTime);
      eventData.endTime = new Date(eventData.endTime);
  
      const event = await eventsService.createEvent(eventData);
  
      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: { event },
      });
    } catch (error: any) {
      console.error('Create event error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create event',
      });
    }
  };
  
  export const getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        category,
        search,
        isActive,
        limit = 10,
        offset = 0,
      } = req.query;
  
      const events = await eventsService.getEvents({
        category: category as string,
        search: search as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
  
      res.json({
        success: true,
        data: { events },
      });
    } catch (error: any) {
      console.error('Get events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch events',
      });
    }
  };
  
  export const getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const event = await eventsService.getEventById(id);
  
      if (!event) {
        res.status(404).json({
          success: false,
          message: 'Event not found',
        });
        return;
      }
  
      res.json({
        success: true,
        data: { event },
      });
    } catch (error: any) {
      console.error('Get event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch event',
      });
    }
  };
  
  export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData: UpdateEventData = req.body;
  
      // Convert date strings to Date objects if provided
      if (updateData.date) {
        updateData.date = new Date(updateData.date);
      }
      if (updateData.startTime) {
        updateData.startTime = new Date(updateData.startTime);
      }
      if (updateData.endTime) {
        updateData.endTime = new Date(updateData.endTime);
      }
  
      const event = await eventsService.updateEvent(id, updateData);
  
      res.json({
        success: true,
        message: 'Event updated successfully',
        data: { event },
      });
    } catch (error: any) {
      console.error('Update event error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update event',
      });
    }
  };
  
  export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await eventsService.deleteEvent(id);
  
      res.json({
        success: true,
        message: 'Event deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete event',
      });
    }
  };
  
  export const checkEventAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      const { eventId } = req.params;
      const { quantity } = req.query;
  
      const result = await eventsService.checkAvailability(
        eventId,
        parseInt(quantity as string) || 1
      );
  
      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Check availability error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to check availability',
      });
    }
  };
  
  export const getEventStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const stats = await eventsService.getEventStats(id);
  
      res.json({
        success: true,
        data: { stats },
      });
    } catch (error: any) {
      console.error('Get event stats error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get event statistics',
      });
    }
  };