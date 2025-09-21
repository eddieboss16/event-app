import { prisma } from '../config/database';

class CartService {
  async getCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                date: true,
                startTime: true,
                venue: true,
                price: true,
                imageUrl: true,
                totalTickets: true,
                soldTickets: true,
                isSoldOut: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      // Create cart if it doesn't exist
      return await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              event: {
                select: {
                  id: true,
                  title: true,
                  date: true,
                  startTime: true,
                  venue: true,
                  price: true,
                  imageUrl: true,
                  totalTickets: true,
                  soldTickets: true,
                  isSoldOut: true,
                  isActive: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addToCart(userId: string, eventId: string, quantity: number = 1) {
    const cart = await this.getCart(userId);

    // Check if event exists and is active
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || !event.isActive) {
      throw new Error('Event not found or inactive');
    }

    if (event.isSoldOut) {
      throw new Error('Event is sold out');
    }

    // Check availability
    const remainingTickets = event.totalTickets - event.soldTickets;
    if (quantity > remainingTickets) {
      throw new Error(`Only ${remainingTickets} tickets available`);
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_eventId: {
          cartId: cart.id,
          eventId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > remainingTickets) {
        throw new Error(`Cannot add more tickets. Only ${remainingTickets} available`);
      }

      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          event: {
            select: {
              title: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      });
    }

    // Add new item to cart
    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        eventId,
        quantity,
      },
      include: {
        event: {
          select: {
            title: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async updateCartItem(userId: string, cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      return await this.removeFromCart(userId, cartItemId);
    }

    const cart = await this.getCart(userId);
    
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      include: {
        event: true,
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Check availability
    const remainingTickets = cartItem.event.totalTickets - cartItem.event.soldTickets;
    if (quantity > remainingTickets) {
      throw new Error(`Only ${remainingTickets} tickets available`);
    }

    return await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        event: {
          select: {
            title: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const cart = await this.getCart(userId);

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  async getCartSummary(userId: string) {
    const cart = await this.getCart(userId);

    const summary = cart.items.reduce(
      (acc, item) => {
        const itemTotal = item.event.price * item.quantity;
        acc.subtotal += itemTotal;
        acc.totalItems += item.quantity;
        return acc;
      },
      { subtotal: 0, totalItems: 0 }
    );

    const tax = summary.subtotal * 0.08; // 8% tax
    const total = summary.subtotal + tax;

    return {
      ...summary,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }
}

export const cartService = new CartService();