import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vueio from 'vue-socket.io'
import socketioclient from 'socket.io-client'
import conva from 'vue-konva'

const SocketIntanse = socketioclient('http://192.168.0.107:3000');




Vue.config.productionTip = false

Vue.use(new vueio({
  connection: SocketIntanse
}));

Vue.use(conva);




new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')

