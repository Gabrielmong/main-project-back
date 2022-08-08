// server/index.js
const express = require("express");
const app = express();
const handlers = require("./server/libs/handlers.js");
const fileupload = require("express-fileupload")
const cors = require("cors");
const multer = require("multer");
const helpers = require("./server/libs/helpers.js");
const config = require("./server/libs/config.js");
const bodyParser = require('body-parser');
const port = process.env.PORT || config.httpPort;


const publicDir = require('path').join(__dirname + "/public");
app.use("/public", express.static(publicDir));
app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
app.post("/uploadImg", (req, res) => {
  const newpath = __dirname + "/public/";
  const file = req.files.file;
  const filename = file.name;
  file.mv(newpath + filename, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.send("File uploaded!");
  });
});
 
app.get("/ping", (req, res) => {
  res.send("Success!");
});

app.all("/crud", (req, res) => {
  handlers.crud(req, res);
});

app.all("/userCrud", (req, res) => {
  handlers.userCrud(req, res);
});

app.all("/crudReviews", (req, res) => {
  handlers.crudReviews(req, res);
});

app.all("/loneReview", (req, res) => {
  handlers.loneReview(req, res);
});

app.listen(port, () => {
  console.log(
    `    Server is listening on port ${port}. \n    Press CTRL + C to stop the server. \n    Check connection at: http://localhost:${port}/ping \n\n`
  );
});
