const express = require("express");
const app = express();
const http = require("http").createServer(app);
const subsrt = require("subsrt");
const fileUpload = require("express-fileupload");
const io = require("socket.io")(http);
const fs = require("fs");

app.use(fileUpload());

app.use(express.static("client"));

app.post("/upload", (req, res) => {
  console.log(req);
});

app.post("/convert", (req, res) => {
  console.log(req);
});

app.post("/detect", (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const name = Object.keys(req.files)[0];
  let file = req.files[name];
  const path = __dirname + "/files/" + name;
  console.log(file);
  if (file instanceof Array) {
    file = file[file.length - 1];
  }

  file.mv(path, function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    fs.readFile(path, "utf8", (err, contents) => {
      const result = subsrt.detect(contents);
      console.log(result);
      if (!result || Object.keys(result).length == 0) {
        return res.json("This file does not meet the format");
      }
      if (result) res.json({ format: result });
    });

    fs.unlink(path, err => {
      if (err) {
        console.log(err);
      }
    });
  });
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
