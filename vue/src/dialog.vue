<template>
  <div id="dialogBlock">
    <div>
      <div v-for="(dialog,i) in dial" v-bind:key="i">
        <div v-for="(user,ii) in dialog" v-bind:key="ii" @click="opendialog(dialog.name)">
          <p>{{user}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Store from './store'
export default {
  data() {
    return {
      dial: [],
    }
  },
  methods: {
    async opendialog(value) {
      this.$root.activedialog = value
      const myApi = axios.create({
        withCredentials: true,
      })
      const response = await myApi.post('http://localhost:5000/messages/', {
        dialog: this.$root.activedialog,
      })
      this.$root.messages = response.data
      $root.socket.emit('todialog', this.Store.activedialog)
    },
  },
  async mounted() {
    const myApi = axios.create({
      withCredentials: true,
    })
    const response = await myApi.get('http://localhost:5000/dialogs/')
    let data = response.data

    let ids = {}
    let users = {}

    this.dial = data.reduce((res, reg) => {
      if (!res.ids) res.ids = []
      if (!ids[reg.id]) {
        let id = { name: reg.id, users: [] }
        res.ids.push(id)
        ids[reg.id] = id
      }
      if (!users[reg.user]) {
        let user_id = reg.nick
        ids[reg.id].users.push(user_id)
        users[reg.user_id] = user_id
      }
      return res
    }, {})
    this.dial = this.dial.ids
  },
}
</script>
  