import Api from '@/services/Api'

export default {
  fetchContacts (params) {
    return Api().get('contacts', { params })
  },

  getContact (id) {
    return Api().get('contacts/' + id)
  },

  addContact (params) {
    return Api().post('contacts', params)
  },

  updateContact (id, params) {
    return Api().put('contacts/' + id, params)
  },

  deleteContact (id) {
    return Api().delete('contacts/' + id)
  }
}
