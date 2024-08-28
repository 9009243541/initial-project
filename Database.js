const mongoose = require("mongoose");

const DB_URL =
  "mongodb+srv://samyak786jain:rcALdz2hda8fL0OH@database-server.kykq2ld.mongodb.net/first-project";

mongoose
  .connect(DB_URL)
  .then((dbres) => {
    console.log(" DataBase connected");
  })
  .catch((error) => {
    console.log("error", error);
  });
