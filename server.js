var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var Twitter = require("twitter");
//var ObjectID = mondgodb.ObjectID;


var app = express();
app.use(bodyParser.json());

var twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
    if(err) {
        console.log(err);
        proccess.exit(1);
    }
    
    // Save database object from the callback for reuse.
    db = client.db();
    console.log("Database connection ready");

    // Initialize app
    var server = app.listen(process.env.PORT , '0.0.0.0', function(){
        var port = server.address().port;
        console.log("App now running on port", port);
    });


});

//Error function
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

app.get("/api/tweets", function(req, res) {
    twitterClient.stream('statuses/filter', {track: 'nba'}, function(stream) {
        stream.on('data', function(event) {
            res.status(200).json(event);
        });

        stream.on('error', function(error) {
            handleError(res, error.message, "failed to get tweets");
        })
    })
});



