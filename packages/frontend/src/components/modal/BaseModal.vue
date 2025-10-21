<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <header v-if="props.title" class="modal-header">
        <h2>{{ props.title }}</h2>
      </header>

      <section class="modal-body">
        <slot name="body" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
}
const props = defineProps<Props>();
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}
.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  padding: 1.5rem;
}
.modal-header {
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
}
.modal-footer {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
