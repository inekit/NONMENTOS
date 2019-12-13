<template>
  <div id="app">
    <app-example></app-example>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {}
  },
  async mounted() {
    const myApi = axios.create({
      withCredentials: true,
    })
    const response = await myApi.get('http://localhost:3000/id/')
    this.$root.id = response.data.id
    //if (!this.$root.id)
  },
}
</script>

