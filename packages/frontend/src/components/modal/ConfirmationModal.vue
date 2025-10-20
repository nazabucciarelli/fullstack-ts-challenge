<template>
  <BaseModal :title="title" @close="emit('close')">
    <template #body>
      <p>Do you really want to perform this action?</p>
      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="emit('close')">Close</button>
        <button type="button" class="btn-primary" @click="emit('confirm')">Confirm</button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue';

const emit = defineEmits(['close', 'confirm']);
</script>

<style scoped>
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
