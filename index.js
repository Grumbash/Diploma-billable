const express = require("express");
const app = express();
const http = require("http").createServer(app);
const fileUpload = require("express-fileupload");
const docx = require("docx");
const middleware = require("./middleware.js");

app.use(fileUpload());

app.use(express.static("client"));

app.post("/detect", (req, res) => {
  middleware(req, res, "detect", null);
});

app.post("/parse", (req, res) => {
  middleware(req, res, "parse", null);
});

app.post("/convert", (req, res) => {
  middleware(req, res, "convert", { format: req.body.formatType });
});

app.post("/time", (req, res) => {
  middleware(req, res, "resync", { offset: req.body.offset }, true);
});

app.post("/resync", (req, res) => {
  console.log(req);
});

app.post("/convertToFormat", (req, res)=>{
  
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
