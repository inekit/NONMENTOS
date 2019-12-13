<template>
  <div id="dialog">
    <div v-for="(message,i) in $root.messages" v-bind:key="i">
      <message :text="message.message" :date="message.date" :otpr="message.user_id"></message>
    </div>
  </div>
</template>

<script>
import Input from './message.vue'
import Store from './store'
import axios from 'axios'
export default {
  name: 'app',
  data() {
    return {
      mes: [],
      Store,
    }
  },
}
</script>
