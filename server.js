const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({path: "./config.env"});
const port = process.env.PORT || 5000;
// app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(require("./db/crud"));
// get driver connection
const dbo = require("./db/conn");
app.get("/vercel", (req, res) => {
    res.send("Express on Vercel");
});
// app.listen(port, () => {
//     // perform a database connection when server starts
//     dbo.connectToServer(function (err) {
//         if (err) console.error(err);
//
//     });
//     console.log(`Server is running on port: ${port}`);
// });

const ObjectId = require("mongodb").ObjectId;
const dbName = "employees";
const {MongoClient} = require("mongodb");
const Db = "mongodb+srv://neiht13:hj6scsg4@cluster0.tmy5xk2.mongodb.net?retryWrites=true&w=majority";
const client = new MongoClient(Db);


app.get("/karaoke", async (req, res) => {
    await client
        .db('employees')
        .collection('karaoke')
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});


