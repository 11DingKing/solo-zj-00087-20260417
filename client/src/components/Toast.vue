<template>
  <transition name="fade">
    <div v-if="visible" class="toast" :class="type">
      <span class="toast-message">{{ message }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info',
      validator: function (value) {
        return ['success', 'error', 'warning', 'info'].indexOf(value) !== -1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-message {
  color: #fff;
}

.toast.success {
  background: #52c41a;
}

.toast.error {
  background: #ff4d4f;
}

.toast.warning {
  background: #faad14;
}

.toast.info {
  background: #4d7ef7;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
