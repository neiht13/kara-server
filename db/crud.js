const express = require("express");
const axios = require("axios");
const models = express.Router();
const dbo = require("../db/conn");


// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
const dbName = "employees";
let modelList = [
    "records",
    "users",
    "nhatky",
    "karaoke"
]

modelList.forEach((model) => {
    models.route(`/${model}`).get(function (req, res) {
        console.log("model",model);
        // let db_connect = dbo.getDb();
        // db_connect
        //     .collection(model)
        //     .find({})
        //     .toArray(function (err, result) {
        //         if (err) throw err;
        //         res.json(result);
        //     });
        var data = JSON.stringify({
            "collection": "employees",
            "database": "karaoke",
            "dataSource": "Cluster0",
            "projection": {}
        });

        var config = {
            method: 'post',
            url: 'https://data.mongodb-api.com/app/data-sgxvu/endpoint/data/v1/action/find',
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "http://localhost:3000",
                'api-key': '3T0AJq674kua5xCKYoZeWEAqbCdlgidtfqWxwJ0O5G0lzW1bD55xzwaXtllwSK2z',
            },
            crossdomain: true,
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    });
    models.route(`/${model}/:id`).get(function (req, res) {
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
    models.route(`/${model}/add`).post(function (req, response) {
        let db_connect = dbo.getDb(dbName);
        console.log(req.body)
        db_connect.collection(model).insertOne(req.body, function (err, res) {
            if (err) throw err;
            response.json(res);
        });
    });

// This section will help you update a record by id.
    models.route(`/${model}/update/:id`).post(function (req, response) {
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
    models.route(`/${model}/:id`).delete((req, response) => {
        let db_connect = dbo.getDb(dbName);
        let myquery = { _id: ObjectId( req.params.id )};
        db_connect.collection(model).deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            response.json(obj);
        });
    });

})



module.exports = models;
