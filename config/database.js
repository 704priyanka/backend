const mongoose = require("mongoose");
//////////////////////////////////////////
//CONNECTING TO ONLINE DATABASE
//=======================================
const connect = () =>
  mongoose
    .connect(
      "mongodb+srv://kartikey-admin:kartikey@blog.dbo4a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("DATABASE CONNECTED..."))
    .catch((err) => console.log(err));
//=======================================
//////////////////////////////////////////
module.exports = connect;
