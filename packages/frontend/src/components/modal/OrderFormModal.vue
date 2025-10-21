<template>
  <BaseModal :title="props.title">
    <template #body>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Customer Name</label>
          <input v-model="form.customer_name" required />
        </div>

        <div class="form-group">
          <label>Item</label>
          <input v-model="form.item" required />
        </div>

        <div class="form-group">
          <label>Quantity</label>
          <input type="number" v-model.number="form.quantity" min="1" required />
        </div>

        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option v-for="status in orderStatusOptions" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="emit('close')">Cancel</button>
          <button type="submit" class="btn-primary">Save order</button>
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import { IOrder, OrderStatus, CreateOrderDto, UpdateOrderDto } from '@challenge/shared';

interface Props {
  order: IOrder | null;
  title: string;
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

watch(
  () => props.order,
  (newOrder) => {
    form.value = newOrder
      ? { ...newOrder }
      : { customer_name: '', item: '', quantity: 1, status: OrderStatus.Pending };
  },
  { immediate: true }
);

function handleSubmit() {
  emit('save', { ...form.value });
}
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
input,
select {
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
.btn-primary,
.btn-secondary {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}
.btn-primary {
  background-color: var(--primary-color);
  color: white;
}
.btn-secondary {
  background-color: #ccc;
  color: #333;
}
</style>
