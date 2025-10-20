<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <h2>{{ isEditing ? 'Edit Order' : 'Create New Order' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="customer_name">Customer Name</label>
          <input type="text" id="customer_name" v-model="form.customer_name" required />
        </div>
        <div class="form-group">
          <label for="item">Item</label>
          <input type="text" id="item" v-model="form.item" required />
        </div>
        <div class="form-group">
          <label for="quantity">Quantity</label>
          <input type="number" id="quantity" v-model.number="form.quantity" min="1" required />
        </div>
        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" v-model="form.status" required>
            <option v-for="status in orderStatusOptions" :key="status" :value="status">
              {{ status.charAt(0).toUpperCase() + status.slice(1) }}
            </option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" @click="emit('close')" class="btn-secondary">Cancel</button>
          <button type="submit" class="btn-primary">Save Order</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { IOrder, OrderStatus, CreateOrderDto, UpdateOrderDto } from '@challenge/shared';

interface Props {
  order: IOrder | null;
}
const props = defineProps<Props>();

const emit = defineEmits(['close', 'save']);

const form = ref<CreateOrderDto | UpdateOrderDto>({
  customer_name: '',
  item: '',
  quantity: 1,
  status: OrderStatus.Pending,
});

const orderStatusOptions = computed(() => Object.values(OrderStatus));
const isEditing = computed(() => !!props.order);

watch(() => props.order, (newOrder) => {
  if (newOrder) {
    form.value = {
      customer_name: newOrder.customer_name,
      item: newOrder.item,
      quantity: newOrder.quantity,
      status: newOrder.status,
    };
  } else {
    // Reset form for new order
    form.value = {
      customer_name: '',
      item: '',
      quantity: 1,
      status: OrderStatus.Pending,
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('save', { ...form.value });
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}
.form-group {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  box-sizing: border-box;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}
.btn-primary, .btn-secondary {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}
.btn-primary { background-color: var(--primary-color); color: white; }
.btn-secondary { background-color: #ccc; color: #333; }
</style>
