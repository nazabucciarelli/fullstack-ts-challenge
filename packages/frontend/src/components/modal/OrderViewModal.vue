<template>
  <BaseModal :title="title" @close="emit('close')">
    <template #body>
      <div>
        <h3>Order ID</h3>
        <p>{{ props.order.id }}</p>
      </div>
      <div>
        <h3>Customer Name</h3>
        <p>{{ props.order.customer_name }}</p>
      </div>
      <div>
        <h3>Item</h3>
        <p>{{ props.order.item }}</p>
      </div>
      <div>
        <h3>Quantity</h3>
        <p>{{ props.order.quantity }}</p>
      </div>
      <div>
        <h3>Status</h3>
        <p>{{ props.order.status }}</p>
      </div>
      <div>
        <h3>Creation Date</h3>
        <p>{{ formatDate(props.order.created_at) }}</p>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-primary" @click="emit('close')">Close</button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import { IOrder, OrderStatus, CreateOrderDto, UpdateOrderDto } from '@challenge/shared';

interface Props {
  order: IOrder | null;
}
const props = defineProps<Props>();
const emit = defineEmits(['close']);

const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped>
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  background-color: var(--primary-color);
  color: white;
}
</style>
