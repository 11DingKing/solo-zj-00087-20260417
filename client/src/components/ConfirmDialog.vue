<template>
  <div class="confirm-dialog" v-if="visible">
    <div class="dialog-overlay" @click="handleCancel"></div>
    <div class="dialog-content">
      <div class="dialog-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="dialog-body">
        <p>{{ message }}</p>
      </div>
      <div class="dialog-footer">
        <button class="btn btn-cancel" @click="handleCancel">取消</button>
        <button class="btn btn-confirm" @click="handleConfirm">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '确认'
    },
    message: {
      type: String,
      default: '确定要执行此操作吗？'
    }
  },
  methods: {
    handleCancel () {
      this.$emit('cancel')
    },
    handleConfirm () {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  position: relative;
  background: #fff;
  border-radius: 4px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.dialog-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.dialog-body {
  padding: 20px;
}

.dialog-body p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.dialog-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e8e8e8;
}

.btn-confirm {
  background: #4d7ef7;
  color: #fff;
}

.btn-confirm:hover {
  background: #3a6de6;
}
</style>
