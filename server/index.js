const express = require("express");
const cors = require("cors");
const chalk = require("chalk");
const { connect } = require("http2");

var connections = new Map([["Users", new Map()]]);
var History = [];

const app = express();

app.use(cors());

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

function GetUsers() {
  var massiv = [];
  connections.get("Users").forEach((value, key) => {
    var temp = {
      id: key,
      username: value,
    };
    massiv.push(temp);
  });
  console.log(massiv);
  return massiv;
}

io.on("connection", (socket) => {
  console.log("New connection   " + socket.id);
  socket.join("room");
  socket.on("add_username", (data) => {
    console.log(data.username);
    connections.get("Users").set(socket.id, data.username);
  });

  socket.on("get_users", () => {
    io.to("room").emit("Setup_user_list", GetUsers());
  });

  socket.on("send_history", (data) => {
    //console.log(data);
    History.push(data);
    io.to("room").emit("push_history_to_user", History);
    if (History.length > 1000) {
      var BreakException = {};
      var eraseIndex = 0;
      try {
        History.forEach((value, i) => {
          if (i > 500 && value.status == "end") {
            eraseIndex = i;
            throw BreakException;
          }
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }
      History.splice(0, eraseIndex);
      console.log(chalk.red("Erased =" + eraseIndex));
    }
  });

  socket.on("get_history", () => {
    socket.emit("push_history_to_user", History);
  });

  socket.on("disconnect", () => {
    var user = connections?.get("Users")?.get(socket.id);
    connections?.get("Users")?.delete(socket.id);
    io.to("room").emit("Setup_user_list", GetUsers());
    console.log(
      "Disconnected: " +
        chalk.red(socket.id) +
        "   " +
        chalk.blue(user ? user : "Haven't nickname")
    );
    if (connections.get("Users").size == 0) {
      history = [];
      console.log("History Clear");
    }
  });
});

server.listen(3000, () => {
  console.log("server start on http://localhost:3000");
});
