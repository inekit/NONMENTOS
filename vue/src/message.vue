<template>
  <div v-if="!ismy">
    <div class="messagemy">
      <p>{{text}}</p>
    </div>
  </div>
  <div v-else>
    <div class="messagerecieved">
      <p>{{text}}</p>
    </div>
  </div>
</template>

<script>
import Store from './store'
export default {
  props: ['text', 'otpr'],
  data() {
    return {
      ismy: false,
    }
  },
  async mounted() {
    if (this.otpr == this.$root.id) this.ismy = true
  },
}
</script>
