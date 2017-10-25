const Vue = require('vue/dist/vue.common')
const Vuex = require('vuex')
Vue.use(Vuex)

const state = require('./state')
const mutations = require('./mutations')
const actions = require('./actions')
const getters = require('./getters')

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})

module.exports = store
