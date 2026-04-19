<template>
  <div class="contact-form">
    <h1>{{ mode === 'edit' ? '编辑联系人' : '新增联系人' }}</h1>
    <div class="form" v-if="!loading">
      <div class="form-item">
        <label class="form-label">姓名 <span class="required">*</span></label>
        <input
          type="text"
          name="name"
          placeholder="请输入姓名"
          v-model="formData.name"
          @blur="validateField('name')"
          @input="clearError('name')"
          :class="{ 'input-error': errors.name }"
        >
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>
      <div class="form-item">
        <label class="form-label">电话 <span class="required">*</span></label>
        <input
          type="text"
          name="phone"
          placeholder="请输入手机号"
          v-model="formData.phone"
          @blur="validateField('phone')"
          @input="clearError('phone')"
          :class="{ 'input-error': errors.phone }"
        >
        <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
      </div>
      <div class="form-item">
        <label class="form-label">邮箱</label>
        <input
          type="text"
          name="email"
          placeholder="请输入邮箱（选填）"
          v-model="formData.email"
          @blur="validateField('email')"
          @input="clearError('email')"
          :class="{ 'input-error': errors.email }"
        >
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>
      <div class="form-item">
        <button
          class="submit-btn"
          @click="handleSubmit"
          :disabled="submitting"
        >
          {{ submitting ? '提交中...' : (mode === 'edit' ? '更新' : '保存') }}
        </button>
        <router-link :to="{ name: 'Contacts' }" class="cancel-link">取消</router-link>
      </div>
    </div>
    <div v-else class="loading-container">
      <span class="loading-text">加载中...</span>
    </div>
  </div>
</template>

<script>
import ContactsService from '@/services/ContactsService'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

export default {
  name: 'ContactForm',
  props: {
    mode: {
      type: String,
      default: 'add',
      validator: function (value) {
        return ['add', 'edit'].indexOf(value) !== -1
      }
    },
    contactId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      submitting: false,
      formData: {
        name: '',
        phone: '',
        email: ''
      },
      errors: {
        name: '',
        phone: '',
        email: ''
      }
    }
  },
  mounted () {
    if (this.mode === 'edit' && this.contactId) {
      this.loadContact()
    }
  },
  methods: {
    async loadContact () {
      this.loading = true
      try {
        const response = await ContactsService.getContact(this.contactId)
        if (response.data && response.data.success && response.data.data) {
          const contact = response.data.data
          this.formData.name = contact.name || ''
          this.formData.phone = contact.phone || ''
          this.formData.email = contact.email || ''
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || '加载联系人失败'
        showErrorToast(errorMessage)
        this.$router.push({ name: 'Contacts' })
      } finally {
        this.loading = false
      }
    },
    validateField (field) {
      const value = this.formData[field]
      this.errors[field] = ''

      switch (field) {
        case 'name':
          if (!value || !value.trim()) {
            this.errors.name = '姓名为必填项'
          } else if (value.length > 20) {
            this.errors.name = '姓名不能超过20个字符'
          }
          break
        case 'phone':
          if (!value || !value.trim()) {
            this.errors.phone = '电话为必填项'
          } else if (!/^1[3-9]\d{9}$/.test(value)) {
            this.errors.phone = '请输入正确的国内手机号格式'
          }
          break
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            this.errors.email = '请输入正确的邮箱格式'
          }
          break
      }
      return !this.errors[field]
    },
    validateForm () {
      let isValid = true
      const fields = ['name', 'phone', 'email']
      fields.forEach(field => {
        const fieldValid = this.validateField(field)
        if (!fieldValid) {
          isValid = false
        }
      })
      return isValid
    },
    clearError (field) {
      if (this.errors[field]) {
        this.errors[field] = ''
      }
    },
    async handleSubmit () {
      if (!this.validateForm()) {
        return
      }

      this.submitting = true
      try {
        const submitData = {
          name: this.formData.name.trim(),
          phone: this.formData.phone.trim(),
          email: this.formData.email ? this.formData.email.trim() : ''
        }

        let response
        if (this.mode === 'edit') {
          response = await ContactsService.updateContact(this.contactId, submitData)
        } else {
          response = await ContactsService.addContact(submitData)
        }

        if (response.data && response.data.success) {
          showSuccessToast(this.mode === 'edit' ? '联系人更新成功' : '联系人创建成功')
          this.$router.push({ name: 'Contacts' })
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || '操作失败'
        showErrorToast(errorMessage)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.contact-form {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
}

.form {
  text-align: left;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.required {
  color: #ff4d4f;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  border-color: #4d7ef7;
}

.input-error {
  border-color: #ff4d4f;
}

.error-message {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #ff4d4f;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #4d7ef7;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  margin-bottom: 10px;
}

.submit-btn:hover:not(:disabled) {
  background: #3a6de6;
}

.submit-btn:disabled {
  background: #a0c0ff;
  cursor: not-allowed;
}

.cancel-link {
  display: block;
  text-align: center;
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.cancel-link:hover {
  color: #4d7ef7;
}

.loading-container {
  text-align: center;
  padding: 40px;
}

.loading-text {
  color: #666;
  font-size: 14px;
}
</style>
