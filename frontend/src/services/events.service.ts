import { apiService } from './api';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  isSoldOut: boolean;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  category: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  totalTickets: number;
  imageUrl?: string;
}

class EventsService {
  async getEvents(filters?: {
    category?: string;
    search?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await apiService.get<{ events: Event[] }>(`/events?${params}`);
    return response.data?.events || [];
  }

  async getEventById(id: string) {
    const response = await apiService.get<{ event: Event }>(`/events/${id}`);
    return response.data?.event;
  }

  async createEvent(eventData: CreateEventData) {
    const response = await apiService.post<{ event: Event }>('/events', eventData);
    return response.data?.event;
  }

  async updateEvent(id: string, eventData: Partial<CreateEventData>) {
    const response = await apiService.put<{ event: Event }>(`/events/${id}`, eventData);
    return response.data?.event;
  }

  async deleteEvent(id: string) {
    await apiService.delete(`/events/${id}`);
  }

  async checkAvailability(eventId: string, quantity: number = 1) {
    const response = await apiService.get<{ available: boolean; remainingTickets: number }>(
      `/events/${eventId}/availability?quantity=${quantity}`
    );
    return response.data!;
  }
}

export const eventsService = new EventsService();