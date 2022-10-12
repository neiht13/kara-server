const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5005;
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(require("./db/crud"));
// get driver connection
const dbo = require("./db/conn");
app.get("/vercel", (req, res) => {
  res.send("Express on Vercel");
});
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);

  });
  console.log(`Server is running on port: ${port}`);
});

const ObjectId = require("mongodb").ObjectId;
const dbName = "employees";

app.get(`/karaoke`, (req, res) => {
    let db_connect = dbo.getDb(dbName);
    db_connect
        .collection("karaoke")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;
          res.json(result);
        });
  });
  app.get(`/karaoke/:id` , function (req, res) {
    let db_connect = dbo.getDb(dbName);
    let myquery = { _id: ObjectId( req.params.id )};
    db_connect
        .collection("karaoke")
        .findOne(myquery, function (err, result) {
          if (err) throw err;
          res.json(result);
        });
  });

// This section will help you create a new record.
  app.post(`/karaoke/add` , function (req, response) {
    let db_connect = dbo.getDb(dbName);
    console.log(req.body)
    db_connect.collection("karaoke").insertOne(req.body, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
  });

// This section will help you update a record by id.
  app.post(`/karaoke/update/:id` , function (req, response) {
    let db_connect = dbo.getDb(dbName);
    let myquery = { _id: ObjectId( req.params.id )};
    console.log(req.body)
    console.log(req.params.id)
    let newvalues = {
      $set: req.body,
    };
    db_connect
        .collection("karaoke")
        .updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
          response.json(res);
        });
  });

// This section will help you delete a record
  app.delete(`/karaoke/:id` , (req, response) => {
    let db_connect = dbo.getDb(dbName);
    let myquery = { _id: ObjectId( req.params.id )};
    db_connect.collection("karaoke").deleteOne(myquery, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      response.json(obj);
    });
  });

