import { apiService } from './api';
import { Event } from './events.service';

export interface CartItem {
  id: string;
  cartId: string;
  eventId: string;
  quantity: number;
  event: Event;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  subtotal: number;
  totalItems: number;
  tax: number;
  total: number;
}

class CartService {
  async getCart() {
    const response = await apiService.get<{ cart: Cart; summary: CartSummary }>('/cart');
    return response.data!;
  }

  async addToCart(eventId: string, quantity: number = 1) {
    const response = await apiService.post<{ cartItem: CartItem }>('/cart/add', {
      eventId,
      quantity,
    });
    return response.data?.cartItem;
  }

  async updateCartItem(cartItemId: string, quantity: number) {
    const response = await apiService.put<{ cartItem: CartItem }>(`/cart/update/${cartItemId}`, {
      quantity,
    });
    return response.data?.cartItem;
  }

  async removeFromCart(cartItemId: string) {
    await apiService.delete(`/cart/remove/${cartItemId}`);
  }

  async clearCart() {
    await apiService.delete('/cart/clear');
  }
}

export const cartService = new CartService();