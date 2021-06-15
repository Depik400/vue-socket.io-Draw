import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    nickname:'',
    users:[],
    history:[]
  },
  mutations: {
    SET_USERS_TO_STATE(state,userlist){
      state.users = userlist;
    },

    SET_NICKNAME(state,nick){
      state.nickname = nick;
    },
    SET_HISTORY(state,history){
      this.history = history;
    }
  },
  actions: {
    USERS_FROM_SERVER({commit},userlist){
      commit('SET_USERS_TO_STATE',userlist);
    },

    USER_NICKNAME({commit},nick){
      commit('SET_NICKNAME',nick)
    }
,
    HISTORY_FROM_SERVER({commit},h){
      commit('SET_HISTORY',h);
    }
  },
  getters: {
    USERS(state){
      return state.users;
    },
    NICKNAME(state){
      return state.nickname;
    }
    ,
    HISTORY(state){
      return state.history;
    }
  },
});

export default store;
