<template>
  <GlobalLoader>
    <CircleSpinner id="spinner" />
  </GlobalLoader>
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
      <OrderList
        v-if="orders.length > 0"
        :orders="orders"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @edit="handleEdit"
        @delete="handleDelete"
        @view="handleView"
        @prev-page="goToPage(currentPage - 1)"
        @next-page="goToPage(currentPage + 1)"
      />
      <div v-else class="no-orders">No orders found.</div>
    </main>

    <component
      v-if="showModal"
      :is="activeComponent"
      :order="currentOrder"
      :title="modalTitle"
      @confirm="handleConfirm"
      @save="handleSave"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useGlobalLoader } from 'vue-global-loader';
import { useToast } from 'vue-toastification';
import { ref, onMounted, watch, computed } from 'vue';
import { IOrder, OrderStatus, CreateOrderDto, UpdateOrderDto } from '@challenge/shared';
import apiClient from './services/apiClient';
import GlobalLoader from 'vue-global-loader/GlobalLoader.vue';
import CircleSpinner from 'vue-global-loader/CircleSpinner.vue';
import OrderList from './components/OrderList.vue';
import OrderFormModal from './components/modal/OrderFormModal.vue';
import OrderViewModal from './components/modal/OrderViewModal.vue';
import ConfirmationModal from './components/modal/ConfirmationModal.vue';

// Reactive state
const orders = ref<IOrder[]>([]);
const showModal = ref(false);
const currentOrder = ref<IOrder | null>(null);
const mode = ref<'create' | 'edit' | 'view' | null>(null);
const handleConfirm = ref(() => {});

// Pagination and filtering state
const currentPage = ref(1);
const totalPages = ref(1);
const filterStatus = ref<OrderStatus | ''>('');

const orderStatusOptions = computed(() => Object.values(OrderStatus));
const modalTitle = computed(() => {
  if (mode.value === 'create') return 'Create Order';
  if (mode.value === 'edit') return 'Edit Order';
  if (mode.value === 'view') return 'View Order';
  if (mode.value === 'confirm') return 'Confirm action';
  return '';
});
const activeComponent = computed(() => {
  switch (mode.value) {
    case 'view':
      return OrderViewModal;
    case 'confirm':
      return ConfirmationModal;
    case 'edit':
    case 'create':
      return OrderFormModal;
    default:
      return null;
  }
});

const { displayLoader, destroyLoader } = useGlobalLoader();
const toast = useToast();

const fetchOrders = async () => {
  displayLoader();
  try {
    const response = await apiClient.getOrders(
      currentPage.value,
      10,
      filterStatus.value || undefined
    );
    orders.value = response.data;
    totalPages.value = response.totalPages;
  } catch (err) {
    console.error(err);
    toast.error('Something went wrong while fetching orders.');
  } finally {
    destroyLoader();
  }
};

const handleAddNew = () => {
  mode.value = 'create';
  currentOrder.value = null;
  showModal.value = true;
};

const handleEdit = (order: IOrder) => {
  mode.value = 'edit';
  currentOrder.value = { ...order };
  showModal.value = true;
};

const handleView = (order: IOrder) => {
  mode.value = 'view';
  currentOrder.value = { ...order };
  showModal.value = true;
};

const handleDelete = async (orderId: string) => {
  mode.value = 'confirm';
  showModal.value = true;
  handleConfirm.value = async () => {
    try {
      displayLoader();
      await apiClient.deleteOrder(orderId);
      fetchOrders();
      toast.success('Order succesfully deleted!');
    } catch (err) {
      toast.error('Something went wrong while deleting order.');
      console.error(err);
    } finally {
      showModal.value = false;
      destroyLoader();
    }
  };
};

const handleSave = async (orderData: CreateOrderDto | UpdateOrderDto) => {
  try {
    displayLoader();
    if ((mode.value = 'edit' && currentOrder.value)) {
      await apiClient.updateOrder(currentOrder.value.id, orderData as UpdateOrderDto);
    } else {
      await apiClient.createOrder(orderData as CreateOrderDto);
    }
    showModal.value = false;
    fetchOrders();
    toast.success('Order succesfully saved!');
  } catch (err) {
    toast.error('Something went wrong while saving order.');
    console.error(err);
  } finally {
    destroyLoader();
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
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
#spinner {
  width: 60px;
  opacity: 0.5;
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
.no-orders {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #777;
}
</style>
