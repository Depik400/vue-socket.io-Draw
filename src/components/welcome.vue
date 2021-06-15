<template>
  <div class="welcome">
    <div class="welcome_wrapper">
      <p class="welcome_p fade-up">Socket.io Draw</p>
      <p class="welcome_draw fade-up">Type username and draw</p>
      <div class="div-username-input fade-up">
        <input
          class="username_input typing"
          type="text"
          id="username_id"
          v-model="username"
          placeholder="username"
        />
        <label for="olol" class="line"></label>
      </div>
      <router-link :to="{ name: 'drawable' }"
        ><input type="button" class="button-submit fade-up" value="Start"
      /></router-link>
    </div>
    <div class="error_window">
      <span>UserName incorrect</span>
      <input type="button" @click="error" value="OK:)" />
    </div>
  </div>
</template>


<script>
import { mapActions } from "vuex";

export default {
  name: "welcome",
  data() {
    return {
      username: "",
    };
  },
  props: {},
  mounted() {
    let inp = document.getElementById("username_id");
    var line = document.querySelector(".line");
    inp.addEventListener("animationend", () => {
      inp.classList.toggle("typing");
    });

    inp.addEventListener("focusin", () => {
      line.classList.add("show");
      line.classList.remove("hide");
    });

    inp.addEventListener("focusout", () => {
      line.classList.remove("show");
      line.classList.add("hide");
    });
  },

  sockets: {
    Setup_user_list(data) {
      console.log(data);
      this.USERS_FROM_SERVER(data);
    },
  },

  methods: {
    ...mapActions(["USER_NICKNAME", "USERS_FROM_SERVER"]),

    submit: function () {
      if (!this.username || this.username.length < 3) {
        console.log("wrong");
        return false;
      }
      this.send_username();
      return true;
    },

    error: function () {
      var element = document.querySelector(".error_window");
      element.classList.remove("active");
    },

    send_username: function () {
      this.$socket.emit("add_username", { username: this.username });
      this.USER_NICKNAME(this.username);
    },
  },

  beforeRouteLeave(to, from, next) {
    console.log("here");
    if (this.submit()) {
      next();
    } else {
      var element = document.querySelector(".error_window");
      element.classList.add("active");
    }
  },

  watch: {
    username: function (val) {
      if (val) {
        let inp = document.getElementById("username_id");
        inp.classList.toggle("typing");
        console.log("typing");
      } else console.log("not typing");
    },
  },
};
</script>

<style lang="css">
.welcome {
  height: 100vh;
  width: 100%;
  display: flex;
  background: linear-gradient(45deg, #0086ff, #d342ff, #c300ff);
}

.to-welcome {
  padding-top: 0;
  margin: 0;
}

.welcome_wrapper {
  display: inline-flex;
  flex-direction: column;
  margin: auto;
}

.welcome_wrapper p {
  background-color: #8f01ba;
  box-shadow: 0px 0px 12px 5px #8f01ba;
  --webkit-box-shadow: 0px 0px 12px 5px #8f01ba;
  margin: 10px 0px;
  text-align: center;
  padding: 10px;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: white;
  border-radius: 30px;
}

p.welcome_p {
  font-size: 24px;
  padding: 10px;
}

.welcome_wrapper input {
  outline: none;
  font-family: "Roboto" sans-serif;
  font-size: 20px;
  border-radius: 30px;
  border: none;
}

.username_input {
  margin-top: 10px;
  padding: 10px 5px;
  text-align: center;
}

.error_window {
  display: none;
}

.error_window.active {
  font-style: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  position: absolute;
  align-items: center;
  background: rgba(128, 128, 128, 0.428);
  backdrop-filter: blur(7px);
  border-radius: 40px;
  z-index: 100px;
  top: 40%;
  width: 250px;
  left: calc(50% - 250px / 2 - 20px);
  padding: 20px;
  animation: fade-up forwards 0.5s;
}

.error_window.active > span {
  margin-bottom: 10px;
  color: white;
  font-size: 20px;
}

.error_window.active > input {
  border-radius: 30px;
  border: none;
  color: white;
  background: #8f01ba;
  box-shadow: 0px 0px 5px 2px #8f01ba;
  --webkit-box-shadow: 0px 0px 5px 2px #8f01ba;
  padding: 10px 20px;
}

.line {
  content: "";
  position: absolute;
  top: 46px;
  left: 45px;
  max-height: 1px;
  height: 100%;
  max-width: 165px;
  width: 0;
  background: #c300ff;
  z-index: 90;
}

.line.show {
  animation: showline forwards 0.3s ease-in;
}

.line.hide {
  animation: hideline forwards 0.5s ease-in-out;
}

.welcome_wrapper input[type="button"] {
  color: white;
  margin-top: 30px;
  margin-left: 25%;
  border: none;
  background: #8f01baa7;
  box-shadow: 0px 0px 10px 3px #8f01ba;
  --webkit-box-shadow: 0px 0px 10px 3px #8f01ba;
  width: 50%;
  padding: 10px;
  align-self: center;
  transition: all 0.5s ease-in-out;
}

.welcome_wrapper input[type="button"]:hover {
  box-shadow: 0px 0px 0px 0px #8f01ba;
  --webkit-box-shadow: 0px 0px 0px 0px #8f01ba;
}

.welcome_p.fade-up {
  animation-delay: 0.2s;
}

.welcome_draw.fade-up {
  animation-delay: 0.5s;
}

.div-username-input.fade-up {
  animation-delay: 0.75s;
}

.button-submit.fade-up {
  animation-delay: 1s;
}

.fade-up {
  opacity: 0;
  animation: fade-up 1s forwards cubic-bezier(0.2, 2, 0.4, 1);
}

.typing {
  animation: typing forwards 0.3s ease-in;
}

@keyframes fade-up {
  from {
    transform: translateY(80px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
}

@keyframes typing {
  0% {
    color: white;
  }
  30% {
    color: #8f01ba;
  }
}

@keyframes showline {
  0% {
    width: 0;
  }

  100% {
    width: 100%;
  }
}

@keyframes hideline {
  0% {
    width: 100%;
  }

  100% {
    width: 0;
  }
}
</style>