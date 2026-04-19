import { EventBus } from './eventBus'

export function showToast (message, type = 'error', duration = 3000) {
  EventBus.$emit('showToast', { message, type, duration })
}

export function showSuccessToast (message, duration = 3000) {
  showToast(message, 'success', duration)
}

export function showErrorToast (message, duration = 3000) {
  showToast(message, 'error', duration)
}

export function showWarningToast (message, duration = 3000) {
  showToast(message, 'warning', duration)
}

export function showInfoToast (message, duration = 3000) {
  showToast(message, 'info', duration)
}
