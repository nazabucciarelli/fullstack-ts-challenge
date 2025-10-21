import { Schema, model, Document } from 'mongoose';
import { IOrder, OrderStatus } from '@challenge/shared';

const OrderSchema = new Schema<IOrder & Document>({
  id: { type: String, required: true, unique: true },
  customer_name: { type: String, required: true },
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: Object.values(OrderStatus), required: true },
  created_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

export default model<IOrder & Document>('Order', OrderSchema);
