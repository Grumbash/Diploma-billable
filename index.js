const express = require("express");
const app = express();
const http = require("http").createServer(app);
const fileUpload = require("express-fileupload");
const { Document, Packer, Paragraph } = require("docx");
const middleware = require("./middleware.js");
const fs = require("fs");
const pathO = require("path");
const subsrt = require("subsrt");
const flatten = require("lodash/flatten");

const doc = new Document();

app.use(fileUpload());

app.use(express.static("client"));

app.post("/detect", (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const name = Object.keys(req.files)[0];
  let file = req.files[name];

  const path = __dirname + "/client/" + name;

  if (file instanceof Array) {
    file = file[file.length - 1];
  }

  file.mv(path, function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    fs.readFile(path, "utf8", (err, contents) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      const detectedFile = subsrt.detect(contents);

      if (!detectedFile || Object.keys(detectedFile).length === 0) {
        return res.json("This file does not meet the format");
      }
      if (detectedFile)
        res.json({
          format: detectedFile
        });
    });

    fs.unlink(path, err => {
      if (err) {
        console.log(err);
      }
    });
  });
});

app.post("/parse", (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const name = Object.keys(req.files)[0];
  let file = req.files[name];

  const path = __dirname + "/client/" + name;

  if (file instanceof Array) {
    file = file[file.length - 1];
  }

  file.mv(path, function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    fs.readFile(path, "utf8", (err, contents) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      const formated = subsrt.parse(contents);
      const result = JSON.stringify(formated);

      if (!result || Object.keys(result).length == 0) {
        return res.json("This file does not meet the format");
      }
      if (result) {
        fs.writeFile("./client/Document.json", result, err => {
          if (err) throw err;
          res.send("Document.json");
        });
      }
    });

    fs.unlink(path, err => {
      if (err) {
        console.log(err);
      }
    });
  });
});

app.post("/convert", (req, res) => {
  middleware(req, res, "convert", { format: req.body.formatType });
});

app.post("/time", (req, res) => {
  middleware(req, res, "resync", { offset: req.body.offset }, true);
});

app.post("/resync", (req, res) => {
  const fps = req.body || 25;

  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }

  console.log(req.files);

  const name = Object.keys(req.files)[0];

  let file = req.files[name];
  const path = __dirname + "/client" + name;
  if (file instanceof Array) {
    file = file[file.length - 1];
  }

  file.mv(path, function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    fs.readFile(path, "utf8", (err, contents) => {
      if (err) {
        throw err;
      }
      let result;
      const format = subsrt.detect(contents);
      const captions = subsrt.parse(contents, { fps });
      result = subsrt.build(captions, { format });

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

app.post("/convertToFormat", (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const name = Object.keys(req.files)[0];

  let file = req.files[name];
  const path = __dirname + "/client" + name;

  if (file instanceof Array) {
    file = file[file.length - 1];
  }

  file.mv(path, function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    fs.readFile(path, "utf8", (err, contents) => {
      if (err) {
        throw new Error("Cannot read the file " + path);
      }
      const parts = contents
        .split(/\r?\n\s+\r?\n/g)
        .map(elem => elem.split("\r\n"))
        .map(arr => {
          arr.shift();
          const timeline = arr.shift();
          const text = arr.join(" ");
          return {
            timeline,
            text
          };
        });

      const table = doc.createTable({
        rows: parts.length + 1,
        columns: 3
      });

      table.getCell(0, 0).addParagraph(new Paragraph("Timeline"));
      table.getCell(0, 1).addParagraph(new Paragraph("Character"));
      table.getCell(0, 2).addParagraph(new Paragraph("Text"));

      parts.forEach((elem, idx) => {
        table.getCell(idx + 1, 0).addParagraph(new Paragraph(elem.timeline));
        table.getCell(idx + 1, 2).addParagraph(new Paragraph(elem.text));
      });

      const packer = new Packer();

      packer.toBuffer(doc).then(buffer => {
        fs.writeFile("./client/Document.docx", buffer, err => {
          if (err) throw err;
          res.send("Document.docx");
        });
      });
    });

    fs.unlink(path, err => {
      if (err) {
        console.log(err);
      }
    });
  });
});

app.post("/deleteFile", (req, res) => {
  const path = pathO.resolve(__dirname, "/client", req.body.fileName);
  fs.unlink(path, err => {
    if (err) {
      console.log(err);
    }
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
