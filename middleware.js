const fs = require("fs");
const subsrt = require("subsrt");

module.exports = (req, res, fileHandler, params, isFormat = false) => {
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
      let result;
      if (!params === null) {
        result = subsrt[fileHandler](contents);
      } else {
        if (isFormat) {
          const formated = subsrt.parse(contents);
          const format = subsrt.detect(contents);
          const json = JSON.stringify(subsrt[fileHandler](formated, params));
          result = subsrt.convert(json, format);
        } else {
          result = subsrt[fileHandler](contents, params);
        }
      }

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
};
