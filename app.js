var express = require("express");
var app = express();
var path = require("path");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var port = process.env.port||3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/gameEntries",{
    useNewURLParser:true
}).then(function(){
    console.log("Connected to MongoDB Database");
}).catch(function(err){
    console.log(err);
});

require("./models/Game");
var Game = mongoose.model("game");

//example routes
app.get("/", function(req, res){
    res.send("Hello World");
})

app.get("/lezduit", function(req, res){
    res.send("Lezduit was here");
})

app.post("/saveGame", function(req,res){
    console.log(req.body);

    new Game(req.body).save().then(function(){
        //res.send(req.body);
        res.redirect("index.html");
    });
})

app.get("/getGames", function(req,res){
    Game.find({}).then(function(game){
        console.log({game});
        res.json({game});
    })
})

app.use(express.static(__dirname+"/pages"));
app.listen(3000, function(){
    console.log(`Running on port ${port}`)
})
