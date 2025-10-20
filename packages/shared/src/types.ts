export enum OrderStatus {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export interface IOrder {
  id: string;
  customer_name: string;
  item: string;
  quantity: number;
  status: OrderStatus;
  created_at: Date;
  deleted_at: Date;
}

export type CreateOrderDto = Pick<IOrder, 'customer_name' | 'item' | 'quantity' | 'status'>;

export type UpdateOrderDto = Partial<CreateOrderDto>;
