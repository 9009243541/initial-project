const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("./Database");
const router = require("./api/route");
app.use(bodyParser.json());
app.use("/", router);
// app.get("/", (req, res) => {
//   res.send("yes");
// });
module.exports = app;
