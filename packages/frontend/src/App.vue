<template>
  <div class="container">
    <header>
      <h1>Order Management System</h1>
      <div class="actions">
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Statuses</option>
          <option v-for="status in orderStatusOptions" :key="status" :value="status">
            {{ status.charAt(0).toUpperCase() + status.slice(1) }}
          </option>
        </select>
        <button @click="handleAddNew" class="btn-primary">Add New Order</button>
      </div>
    </header>

    <main>
      <div v-if="isLoading" class="loading">Loading orders...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <OrderList
        v-else-if="orders.length > 0"
        :orders="orders"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @edit="handleEdit"
        @delete="handleDelete"
        @prev-page="goToPage(currentPage - 1)"
        @next-page="goToPage(currentPage + 1)"
      />
      <div v-else class="no-orders">No orders found.</div>
    </main>

    <OrderFormModal
      v-if="showModal"
      :order="currentOrder"
      @close="showModal = false"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { IOrder, OrderStatus, CreateOrderDto, UpdateOrderDto } from '@challenge/shared';
import apiClient from './services/apiClient';

// Components
import OrderList from './components/OrderList.vue';
import OrderFormModal from './components/OrderFormModal.vue';

// Reactive state
const orders = ref<IOrder[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const showModal = ref(false);
const isEditing = ref(false);
const currentOrder = ref<IOrder | null>(null);

// Pagination and filtering state
const currentPage = ref(1);
const totalPages = ref(1);
const filterStatus = ref<OrderStatus | ''>('');

const orderStatusOptions = computed(() => Object.values(OrderStatus));

const fetchOrders = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    console.log(currentPage.value)
    const response = await apiClient.getOrders(currentPage.value, 10, filterStatus.value || undefined);
    orders.value = response.data;
    totalPages.value = response.totalPages;
  } catch (err) {
    error.value = 'Failed to fetch orders. Please try again later.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const handleAddNew = () => {
  isEditing.value = false;
  currentOrder.value = null;
  showModal.value = true;
};

const handleEdit = (order: IOrder) => {
  isEditing.value = true;
  currentOrder.value = { ...order };
  showModal.value = true;
};

const handleDelete = async (orderId: string) => {
  if (confirm('Are you sure you want to delete this order?')) {
    try {
      await apiClient.deleteOrder(orderId);
      fetchOrders(); // Refresh the list
    } catch (err) {
      alert('Failed to delete order.');
      console.error(err);
    }
  }
};

const handleSave = async (orderData: CreateOrderDto | UpdateOrderDto) => {
  try {
    if (isEditing.value && currentOrder.value) {
      await apiClient.updateOrder(currentOrder.value.id, orderData as UpdateOrderDto);
    } else {
      await apiClient.createOrder(orderData as CreateOrderDto);
    }
    showModal.value = false;
    fetchOrders(); // Refresh list
  } catch (err) {
    alert('Failed to save order.');
    console.error(err);
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Fetch orders on component mount and when filters/page change
onMounted(fetchOrders);
watch([currentPage, filterStatus], () => {
    fetchOrders();
});
</script>

<style>
/* Basic styles for layout and components */
:root {
  --primary-color: #4a90e2;
  --danger-color: #d0021b;
  --background-color: #f4f5f7;
  --text-color: #333;
  --border-color: #ccc;
  --card-bg: #fff;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  background-color: var(--background-color);
  color: var(--text-color);
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
h1 {
  color: var(--primary-color);
}
.actions {
  display: flex;
  gap: 1rem;
}
.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}
.filter-select {
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid var(--border-color);
}
.loading, .error, .no-orders {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #777;
}
.error {
  color: var(--danger-color);
}
</style>
