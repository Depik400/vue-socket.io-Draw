import Router from 'vue-router';
import Vue from "vue";

import vWelcome from "../components/welcome.vue";
import vRoom from "../components/room.vue";

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      name: "welcome",
      component: vWelcome
    },

    {
      path: "/room",
      name: "drawable",
      component: vRoom,
      props:false,
    },
  ],
});

export default router;
