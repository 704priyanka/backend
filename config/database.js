const mongoose = require("mongoose");
//////////////////////////////////////////
//CONNECTING TO ONLINE DATABASE
//=======================================
const connect = () =>
  mongoose
    .connect("mongodb://localhost/project", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DATABASE CONNECTED..."))
    .catch((err) => console.log(err));
//=======================================
//////////////////////////////////////////
module.exports = connect;
