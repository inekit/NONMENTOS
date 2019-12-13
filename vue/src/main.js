import Vue from 'vue'
import App from './App.vue'
import Example from './Example.vue'
import message from './message.vue'
import dialog from './dialog.vue'
import loginform from './loginform.vue'
import VueSuperagent from 'vue-superagent'
import axios from 'axios'
Vue.component('app-example', Example)
Vue.component('message', message)
Vue.use(VueSuperagent)

import Store from './store'

Vue.directive('click-outside', {
  bind(el, binding) {
    el.addEventListener('click', e => e.stopPropagation())
    document.body.addEventListener('click', binding.value)
  },
  unbind(el, binding) {
    document.body.removeEventListener('click', binding.value)
  },
})

new Vue({
  el: '#all',
  data() {
    return {
      showall: true,
      Store,
    }
  },
})

new Vue({
  el: '#dialogBlock',
  data: Store,
  render: h => h(dialog),
})

new Vue({
  el: '#app',
  data: Store,
  render: h => h(App),
})

new Vue({
  el: '#addform',
  data() {
    return {
      message: '',
      Store,
    }
  },
  methods: {
    addMess(value) {
      const myApi = axios.create({
        withCredentials: true,
      })
      if (value) {
        myApi.post('http://localhost:3000/add/', {
          dialog: this.Store.activedialog,
          message: value,
        })
      }
    },
  },
})

new Vue({
  el: '#loginform',
  render: h => h(loginform),
})
