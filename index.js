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

const {fps} = req.body

if (Object.keys(req.files).length == 0) {
  return res.status(400).send("No files were uploaded.");
}

console.log(req.files);

const name = Object.keys(req.files)[0];

let file = req.files[name];
const path = __dirname + "/files/" + name;

if (file instanceof Array) {
  file = file[file.length - 1];
}

file.mv(path, function(err) {
  if (err) {
    console.log(err);
    return res.status(500).send(err);
  }
  fs.readFile(path, "utf8", (err, contents) => {
    let result;
    const captions = subsrt.parse(contents, { fps });
    resynced = subsrt.resync(content, { ratio: 30 / 25, frame: true });

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

app.post("/convertToFormat", (req, res)=>{
  
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
