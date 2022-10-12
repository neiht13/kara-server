const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({path: "./config.env"});
const port = process.env.PORT || 5005;
// app.use(cors());
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
const {MongoClient} = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var _db;
client.connect(function (err, db) {
    // Verify we got a good "db" object
    if (db) {
        _db = db.db("employees");
        console.log("Successfully connected to MongoDB.");
    }
    return callback(err);
});
const getDb = () => {
    return _db;
}


app.get("/karaoke", (req, res) => {
    let db_connect = getDb();
    db_connect
        .collection("karaoke")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});


