<template>
  <div class="order-list-container">
    <table class="order-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Item</th>
          <th>Quantity</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td class="order-id">{{ order.id.substring(0, 8) }}</td>
          <td>{{ order.customer_name }}</td>
          <td>{{ order.item }}</td>
          <td>{{ order.quantity }}</td>
          <td><span :class="['status-badge', `status-${order.status}`]">{{ order.status }}</span></td>
          <td>{{ formatDate(order.created_at) }}</td>
          <td class="actions-cell">
            <button @click="emit('edit', order)" class="btn btn-edit">Edit</button>
            <button @click="emit('delete', order.id)" class="btn btn-delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="emit('prev-page')" :disabled="currentPage <= 1" class="btn">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="emit('next-page')" :disabled="currentPage >= totalPages" class="btn">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IOrder } from '@challenge/shared';

interface Props {
  orders: IOrder[];
  currentPage: number;
  totalPages: number;
}
defineProps<Props>();

const emit = defineEmits(['edit', 'delete', 'prev-page', 'next-page']);

const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped>
.order-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--card-bg);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}
th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}
th {
  background-color: var(--background-color);
}
.order-id {
  font-family: monospace;
}
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: white;
  text-transform: capitalize;
}
.status-pending { background-color: #f5a623; }
.status-completed { background-color: #7ed321; }
.status-cancelled { background-color: #9b9b9b; }

.actions-cell {
  display: flex;
  gap: 0.5rem;
}
.btn {
  border: 1px solid var(--border-color);
  background-color: transparent;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}
.btn-edit { color: var(--primary-color); border-color: var(--primary-color); }
.btn-delete { color: var(--danger-color); border-color: var(--danger-color); }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
