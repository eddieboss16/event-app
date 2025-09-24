import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { cartService } from "../services/cart.services";

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const cart = await cartService.getCart(userId);
    const summary = await cartService.getCartSummary(userId);

    res.json({
      success: true,
      data: { cart, summary },
    });
  } catch (error: any) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
    });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId, quantity = 1 } = req.body;
    const userId = req.user!.userId;

    const cartItem = await cartService.addToCart(userId, eventId, quantity);

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: { cartItem },
    });
  } catch (error: any) {
    console.error('Add to cart error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add item to cart',
    });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user!.userId;

    const cartItem = await cartService.updateCartItem(userId, id, quantity);

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: { cartItem },
    });
  } catch (error: any) {
    console.error('Update cart item error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update cart item',
    });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    await cartService.removeFromCart(userId, id);

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
    });
  } catch (error: any) {
    console.error('Remove from cart error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to remove item from cart',
    });
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    await cartService.clearCart(userId);

    res.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error: any) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
    });
  }
};