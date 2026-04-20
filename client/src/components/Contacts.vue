<template>
  <div class="contacts">
    <h1>联系人管理</h1>

    <ConfirmDialog
      :visible="confirmDialogVisible"
      title="确认删除"
      :message="`确定要删除联系人「${contactToDelete && contactToDelete.name ? contactToDelete.name : ''}」吗？`"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />

    <div class="search-section">
      <input
        type="text"
        class="search-input"
        placeholder="请输入姓名或电话搜索..."
        v-model="searchKeyword"
        @input="handleSearchInput"
        :disabled="loading"
      >
      <router-link :to="{ name: 'NewContact' }" class="add-btn" :disabled="loading">
        {{ loading ? '加载中...' : '添加联系人' }}
      </router-link>
    </div>

    <div v-if="loading" class="loading-container">
      <span class="loading-text">加载中...</span>
    </div>

    <div v-else-if="contacts.length > 0" class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>电话</th>
            <th>邮箱</th>
            <th width="180" align="center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-bind:key="contact._id" v-for="contact in contacts">
            <td>{{ contact.name }}</td>
            <td>{{ contact.phone }}</td>
            <td>{{ contact.email || '-' }}</td>
            <td align="center" class="action-col">
              <router-link
                v-bind:to="{ name: 'EditContact', params: { id: contact._id } }"
                class="action-link"
              >编辑</router-link>
              <span class="action-divider">|</span>
              <a
                href="#"
                class="action-link delete-link"
                @click.prevent="handleDeleteClick(contact)"
              >删除</a>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="totalPages > 1" class="pagination">
        <button
          class="page-btn"
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
        >上一页</button>
        <span class="page-info">
          第 {{ currentPage }} 页 / 共 {{ totalPages }} 页（共 {{ total }} 条）
        </span>
        <button
          class="page-btn"
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >下一页</button>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>暂无联系人数据</p>
      <router-link v-bind:to="{ name: 'NewContact' }" class="add-contact-link">添加联系人</router-link>
    </div>
  </div>
</template>

<script>
import ContactsService from '@/services/ContactsService'
import ConfirmDialog from '@/components/ConfirmDialog'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

export default {
  name: 'contacts',
  components: {
    ConfirmDialog
  },
  data () {
    return {
      contacts: [],
      loading: false,
      searchKeyword: '',
      currentPage: 1,
      total: 0,
      totalPages: 1,
      pageSize: 10,
      searchTimer: null,
      confirmDialogVisible: false,
      contactToDelete: null
    }
  },
  mounted () {
    this.fetchContacts()
  },
  methods: {
    async fetchContacts () {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize
        }
        if (this.searchKeyword && this.searchKeyword.trim()) {
          params.search = this.searchKeyword.trim()
        }

        const response = await ContactsService.fetchContacts(params)
        if (response.data && response.data.success && response.data.data) {
          const data = response.data.data
          this.contacts = data.contacts || []
          this.total = data.total || 0
          this.totalPages = data.totalPages || 1
          this.currentPage = data.page || 1
        }
      } catch (error) {
        const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || '获取联系人列表失败'
        showErrorToast(errorMessage)
        this.contacts = []
        this.total = 0
        this.totalPages = 1
      } finally {
        this.loading = false
      }
    },
    handleSearchInput () {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      this.searchTimer = setTimeout(() => {
        this.currentPage = 1
        this.fetchContacts()
      }, 300)
    },
    handlePageChange (page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) {
        return
      }
      this.currentPage = page
      this.fetchContacts()
    },
    handleDeleteClick (contact) {
      this.contactToDelete = contact
      this.confirmDialogVisible = true
    },
    handleCancelDelete () {
      this.confirmDialogVisible = false
      this.contactToDelete = null
    },
    async handleConfirmDelete () {
      if (!this.contactToDelete) {
        return
      }

      this.confirmDialogVisible = false
      this.loading = true

      try {
        const response = await ContactsService.deleteContact(this.contactToDelete._id)
        if (response.data && response.data.success) {
          showSuccessToast('联系人删除成功')
          await this.fetchContacts()
        }
      } catch (error) {
        const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || '删除联系人失败'
        showErrorToast(errorMessage)
      } finally {
        this.loading = false
        this.contactToDelete = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.contacts {
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
  text-align: left;
}

.search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.search-input {
  flex: 1;
  max-width: 400px;
  padding: 10px 15px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #4d7ef7;
}

.search-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.add-btn {
  padding: 10px 24px;
  background: #4d7ef7;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
  white-space: nowrap;
}

.add-btn:hover:not(:disabled) {
  background: #3a6de6;
}

.add-btn:disabled {
  background: #a0c0ff;
  cursor: not-allowed;
}

.loading-container {
  text-align: center;
  padding: 60px;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

.table-wrap {
  width: 100%;
  text-align: left;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table th, table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}

table thead {
  background: #4d7ef7;
  color: #fff;
}

table thead th {
  font-weight: 500;
  font-size: 14px;
}

table tbody tr:hover {
  background: #f9fafb;
}

table tbody td {
  font-size: 14px;
  color: #333;
}

.action-col {
  text-align: center;
}

.action-link {
  color: #4d7ef7;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.action-link:hover {
  text-decoration: underline;
}

.delete-link {
  color: #ff4d4f;
}

.action-divider {
  color: #d9d9d9;
  margin: 0 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  padding: 10px 0;
}

.page-btn {
  padding: 8px 20px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #4d7ef7;
  color: #4d7ef7;
}

.page-btn:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 60px;
}

.empty-state p {
  margin: 0 0 20px 0;
  color: #999;
  font-size: 14px;
}

.add-contact-link {
  display: inline-block;
  padding: 10px 40px;
  background: #4d7ef7;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.add-contact-link:hover {
  background: #3a6de6;
}
</style>
