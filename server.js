const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const port = process.env.PORT || 5005;
app.use(cors())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
const jwt = require('jsonwebtoken');

app.use(require("./db/crud"));
// get driver connection
const dbo = require("./db/conn");
// app.post("/login", function (req, res) {
//   var token = jwt.sign(req.body, "thienxuan");
//  res.json({token});
// })
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);

  });
  console.log(`Server is running on port: ${port}`);
});
