<template>
  <div id="loginform" v-click-outside="close">
    <div class="header">
      <h3>NONMENTOS</h3>
      <span id="status">Не в сети</span>
      <a href="#" class="blubtn" @click="show=!show"></a>
    </div>
    <transition id="closing">
      <div id="closing" class="loginmenu" v-if="show">
        <div id="formContent">
          <div v-if="!islogged">
            <h2
              v-bind:class="class1"
              @click="reg=false,class1= 'active',class2= 'inactive underlineHover'"
            >Sign In</h2>
            <h2
              v-bind:class="class2"
              @click="reg=true,class2= 'active',class1= 'inactive underlineHover'"
            >Sign Up</h2>

            <form>
              <input type="text" id="login" placeholder="login" v-model="login" />
              <input type="text" id="password" placeholder="password" v-model="password" />
              <input v-if="reg" type="text" id="password" placeholder="nick" v-model="nick" />
              <label v-if="isempty">Все поля должны быть заполнены</label>
              <label v-if="iscorrect">Неверный логин или пароль</label>
              <input v-if="reg" type="submit" value="Зарегестритроваться" @click="callRegister()" />
              <input v-else type="submit" value="Войти" @click="callAuth" />
            </form>
          </div>
          <div v-else>
            <form>
              <h1>{{user}}</h1>
              <input type="submit" value="Выйти" @click="logOut" />
            </form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Input from './message.vue'
import Store from './store'
import axios from 'axios'
export default {
  data() {
    return {
      show: false,
      login: '',
      password: '',
      nick: '',
      reg: false,
      isempty: '',
      islogged: '',
      iscorrect: '',
      user: '',
      class1: 'active',
      class2: 'inactive underlineHover',

      Store,
    }
  },
  methods: {
    async logOut() {
      const myApi = axios.create({
        withCredentials: true,
      })
      myApi.get('http://localhost:3000/logout/')
      window.location.reload()
    },
    close() {
      this.show = false
    },
    async callAuth() {
      if (this.iscorrect) this.iscorrect = false
      if (this.login && this.password) {
        this.isempty = false

        const myApi = axios.create({
          withCredentials: true,
        })
        await myApi.post('http://localhost:3000/login/', {
          email: this.login,
          password: this.password,
        })
        const response = await myApi.get('http://localhost:3000/id/')

        if (response.data.id) {
          this.$root.id = response.data.id
          this.islogged = true
          this.show = false

          this.user = response.data.id
          window.location.reload()
        } else this.iscorrect = true
      } else this.isempty = true
    },
    async callRegister() {
      if (this.login && this.password && this.nick) {
        this.isempty = false
        const myApi = axios.create({
          withCredentials: true,
        })
        await myApi.post('http://localhost:3000/register/', {
          email: this.login,
          password: this.password,
          nick: this.nick,
        })
      } else this.isempty = true
    },
  },
  async mounted() {
    const myApi = axios.create({
      withCredentials: true,
    })
    const response = await myApi.get('http://localhost:3000/id/')

    if (response.data.id) {
      this.$root.id = response.data.id
      this.islogged = true
      this.show = false
      this.user = this.$root.id
    } else {
      this.islogged = false
      this.show = true
    }
  },
}
</script>