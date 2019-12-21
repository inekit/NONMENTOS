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

var scrollHeight = Math.max(
  document.body.scrollHeight,
  document.documentElement.scrollHeight,
  document.body.offsetHeight,
  document.documentElement.offsetHeight,
  document.body.clientHeight,
  document.documentElement.clientHeight
)

var socket = io.connect(':3000')
socket.on('Server 2 Client Message', function(messageFromServer) {
  Store.messages.push({ message: messageFromServer, otpr: Store.user_id })
  console.log('server said: ' + messageFromServer)
  window.scrollTo(pageXOffset, scrollHeight * 10)
})

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
        socket.emit('todialog', this.Store.activedialog)
        javascript: socket.emit('Client 2 Server Message', this.message)
        myApi.post('http://localhost:5000/add/', {
          dialog: this.Store.activedialog,
          message: value,
        })
      }
    },
  },
  mounted() {},
})

new Vue({
  el: '#loginform',
  render: h => h(loginform),
})
