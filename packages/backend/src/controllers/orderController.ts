import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/Order';
import { CreateOrderDto, OrderStatus, UpdateOrderDto } from '@challenge/shared';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer_name, item, quantity, status } = req.body as CreateOrderDto;
    if (!customer_name || !item || !quantity || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newOrder = new Order({
      id: uuidv4(),
      customer_name,
      item,
      quantity,
      status,
      created_at: new Date(),
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.page_size as string) || 10;
    const status = req.query.status as OrderStatus;

    const query: any = { deleted_at: null };
    if (status && Object.values(OrderStatus).includes(status)) {
      query.status = status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ created_at: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      data: orders,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      totalItems: total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({ id: req.params.id, deleted_at: null });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const updates = req.body as UpdateOrderDto;
    const updatedOrder = await Order.findOneAndUpdate(
      { id: req.params.id, deletedAt: null },
      updates,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const deletedOrder = await Order.findOneAndUpdate(
      { id: req.params.id },
      { deleted_at: new Date() }
    );
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};
