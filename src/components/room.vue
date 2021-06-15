<template>
  <div class="room">
    <header class="header_tools">
      <nav class="navbar_tools">
        <router-link :to="{ name: 'welcome' }" class="link_to_welcome"
          >Back</router-link
        >
        <div class="color">
          <span>color</span>
          <label class="color_color"></label>
        </div>
      </nav>
    </header>
    <div class="userlist">
      <p class="userlist_label">Users:</p>
      <vUsers
        class="userlist_users"
        v-for="user in USERS"
        :key="user.id"
        v-bind:users="user"
      >
      </vUsers>
    </div>

    <div class="draw">
      <div class="cursor">
        <div class="cursor_color"></div>
      </div>
      <canvas id="canvas" ref="canva"> </canvas>
    </div>
  </div>
</template>


<script>
import vUsers from "../components/vUsers.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "room",

  components: {
    vUsers,
  },

  data() {
    return {
      cavnas: "canvas",
      cursor: "cursor",
      ctx: "ctx",
      draw: false,
      prevX: 0,
      prevY: 0,
      color: 1,
      colors: [
        "#d4f713",
        "#13f7ab",
        "#13f3f7",
        "#13c5f7",
        "#138cf7",
        "#1353f7",
        "#2d13f7",
        "#7513f7",
        "#a713f7",
        "#d413f7",
        "#f713e0",
        "#f71397",
        "#f7135b",
        "#f71313",
        "#f76213",
        "#f79413",
        "#f7e013",
      ],
      points: [],
    };
  },

  props: {},

  sockets: {
    Setup_user_list(data) {
      console.log("socket-emit");
      console.log(data);
      this.USERS_FROM_SERVER(data);
      this.SetupColor(data);
    },

    push_history_to_user(data) {
      this.drawHistory(data);
    },
  },

  activated() {
    setTimeout(() => {
      this.$socket.emit("get_users");
      this.$socket.emit("get_history");
    }, 1);
    console.log("hell");
  },

  mounted() {
    this.canvas = this.$refs.canva;
    this.cursor = document.querySelector(".cursor");
    this.canvas.setAttribute("width", document.body.clientWidth - 200);
    this.canvas.setAttribute("height", document.body.clientHeight - 80);
    this.ctx = this.canvas.getContext("2d");
    console.log(this.canvas);
    console.log(this.ctx);

    this.canvas.addEventListener("mousedown", this.mousedown);
    this.canvas.addEventListener("mousemove", this.mousemove);
    window.addEventListener("mouseup", this.mouseup);

    this.drawBgDots();
  },

  computed: {
    ...mapGetters(["NICKNAME", "USERS"]),
  },

  methods: {
    ...mapActions(["USERS_FROM_SERVER"]),

    SetupColor(data) {
      data.forEach((name, index) => {
        if (name.username == this.NICKNAME) {
          while (index >= this.colors.length) {
            index -= this.colors.length;
          }
          this.color = this.colors[index];
          console.log(this.color);
        }
      });
    },

    mousemove(event) {
      var rect = this.canvas.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;

      if (this.draw) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevX, this.prevY);
        this.ctx.lineTo(x, y);
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
        console.log("move %s %s", x, y);
        this.prevX = x;
        this.prevY = y;
        this.$socket.emit("send_history", {
          x: x,
          y: y,
          status: "middle",
          color: this.color,
        });
        this.points.push({
          x: x,
          y: y,
          status: "middle",
          color: this.color,
        });
      }
    },

    mousedown(event) {
      var rect = this.canvas.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      console.log(x + "   " + y);
      this.draw = true;
      this.prevX = x;
      this.prevY = y;
      this.$socket.emit("send_history", {
        x: x,
        y: y,
        status: "start",
        color: this.color,
      });
      this.points.push({
        x: x,
        y: y,
        status: "start",
        color: this.color,
      });
    },

    mouseup(event) {
      this.draw = false;
      var rect = this.canvas.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      this.$socket.emit("send_history", {
        x: x,
        y: y,
        status: "end",
        color: this.color,
      });
      this.points.push({
        x: x,
        y: y,
        status: "end",
        color: this.color,
      });
    },

    drawBgDots() {
      var gridSize = 60;
      this.ctx.fillStyle = "rgba(0, 0, 0, .2)";

      for (var i = 0.5; i * gridSize < this.canvas.width; i++) {
        for (var j = 0.5; j * gridSize < this.canvas.height; j++) {
          if (i > 0 && j > 0) {
            this.ctx.beginPath();
            this.ctx.rect(i * gridSize, j * gridSize, 2, 2);
            this.ctx.fill();
            this.ctx.closePath();
          }
        }
      }
    },

    drawHistory(data) {
      var PrevvX = data[0].x;
      var PrevvY = data[0].y;
      data.forEach((element, index) => {
        if (element.status == "start") {
          this.ctx.beginPath();
        }

        this.ctx.lineWidth = 1;
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = element.color;
        this.ctx.moveTo(PrevvX, PrevvY);
        this.ctx.lineTo(element.x, element.y);
        this.ctx.stroke();
        PrevvX = element.x;
        PrevvY = element.y;
        if (element.status == "end") {
          this.ctx.closePath();
          PrevvX = data[index + 1].x ? data[index + 1].x : PrevvX;
          PrevvY = data[index + 1].y ? data[index + 1].y : PrevvY;
        }
      });
    },
  },
};
</script>

<style lang="css">
.room {
  background: rgb(201, 201, 201);
  height: 100vh;
}

h1 {
  margin: 0;
  padding: 0;
}

.link_to_welcome {
  text-decoration: none;
  background: black;
  color: white;
  padding: 10px;
  border-radius: 20px;
}

.header_tools {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

.navbar_tools {
  font-family: "Roboto", sans-serif;
  background: rgb(54, 54, 54);
  height: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 0px 0px 40px 40px;
}

.color {
  color: white;
  background: black;
  padding: 5px;
  border-radius: 20px;
}

.color_color {
  content: "";
  margin-left: 5px;
  top: 23px;
  position: absolute;
  height: 20px;
  width: 20px;
  background: blue;
  border-radius: 50%;
  border: 2px black solid;
}

.userlist {
  position: absolute;
  left: 0;
  top: 30%;
  background: blueviolet;
  padding: 20px;
  border-radius: 0px 10px 10px 0px;
  z-index: 4000;
}

.userlist > p.userlist_label {
  border-bottom: rgb(99, 31, 162) 1px solid;
  background: rgb(195, 12, 201);
  border-radius: 20px;
  padding: 10px;
}

.userlist_users {
  background: rgba(255, 255, 255, 0.476);
  padding: 2px 5px;
  border-radius: 20px;
  margin: 10px 0px;
  text-align: center;
}

.draw {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10px;
}

#canvas {
  cursor: crosshair;
  background: white;
  z-index: 2300;
}

.cursor {
  content: "";
  position: relative;
  display: none;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: black 2px solid;
  z-index: 2400;
  align-items: center;
  justify-content: center;
}

.cursor_color {
  height: 17px;
  width: 17px;
  background: blue;
  border-radius: 50%;
}
</style>