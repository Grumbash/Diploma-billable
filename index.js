const express = require("express");
const app = express();
const http = require("http").createServer(app);
const subsrt = require("subsrt");
const io = require("socket.io")(http);

app.use(express.static("client"));

app.post("/upload", (req, res) => {
  console.log(req);
});

app.post("/convert", (req, res) => {
  console.log(req);
});

app.post("/detect", (req, res) => {
  console.log(req);
});

app.post("/parse", (req, res) => {
  console.log(req);
});

app.post("/resync", (req, res) => {
  console.log(req);
});

app.post("/time", (req, res) => {
  console.log(req);
});

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
