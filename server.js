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
let modelList = [
  "records",
  "users",
  "nhatky",
  "karaoke"
]

modelList.forEach((model) => {
  app.get(`/${model}`,function (req, res) {
    let db_connect = dbo.getDb(dbName);
    db_connect
        .collection(model)
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;
          res.json(result);
        });
  });
  app.get(`/${model}/:id` , function (req, res) {
    let db_connect = dbo.getDb(dbName);
    let myquery = { _id: ObjectId( req.params.id )};
    db_connect
        .collection(model)
        .findOne(myquery, function (err, result) {
          if (err) throw err;
          res.json(result);
        });
  });

// This section will help you create a new record.
  app.get(`/${model}/add`).post(function (req, response) {
    let db_connect = dbo.getDb(dbName);
    console.log(req.body)
    db_connect.collection(model).insertOne(req.body, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
  });

// This section will help you update a record by id.
  app.get(`/${model}/update/:id`).post(function (req, response) {
    let db_connect = dbo.getDb(dbName);
    let myquery = { _id: ObjectId( req.params.id )};
    console.log(req.body)
    console.log(req.params.id)
    let newvalues = {
      $set: req.body,
    };
    db_connect
        .collection(model)
        .updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
          response.json(res);
        });
  });

// This section will help you delete a record
  app.get(`/${model}/:id`).delete((req, response) => {
    let db_connect = dbo.getDb(dbName);
    let myquery = { _id: ObjectId( req.params.id )};
    db_connect.collection(model).deleteOne(myquery, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      response.json(obj);
    });
  });

})