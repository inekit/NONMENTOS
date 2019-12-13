<template>
  <div>
  <h3> {{msg}}</h3>
    <input type="text" :value="msg" @input="changemess">
    <p>{{mess}}</p> 
    <p>{{mess}}</p> 
  </div>
</template>

<script>
export default {
props:['msg'],
   data() {
        return {
        mess: ''
        }
   },
   methods:{
   changemess(event){
    this.mess=event.target.value;
    this.$emit('messRod',this.mess);
   }
   }
}
</script>