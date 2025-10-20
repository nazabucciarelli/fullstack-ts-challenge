import axios from 'axios';
import { IOrder, CreateOrderDto, UpdateOrderDto, OrderStatus } from '@challenge/shared';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface PaginatedOrdersResponse {
  data: IOrder[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export default {
  async getOrders(page: number, pageSize: number, status?: OrderStatus): Promise<PaginatedOrdersResponse> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (status) {
      params.append('status', status);
    }
    const response = await apiClient.get<PaginatedOrdersResponse>(`/orders?${params.toString()}`);
    return response.data;
  },
  async getOrder(id: string): Promise<IOrder> {
    const response = await apiClient.get<IOrder>(`/orders/${id}`);
    return response.data;
  },
  async createOrder(data: CreateOrderDto): Promise<IOrder> {
    const response = await apiClient.post<IOrder>('/orders', data);
    return response.data;
  },
  async updateOrder(id: string, data: UpdateOrderDto): Promise<IOrder> {
    const response = await apiClient.put<IOrder>(`/orders/${id}`, data);
    return response.data;
  },
  async deleteOrder(id: string): Promise<void> {
    await apiClient.delete(`/orders/${id}`);
  },
};
