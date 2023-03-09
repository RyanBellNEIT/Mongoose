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
    res.send("gameList.html");
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
    Game.find({}).sort({"game":1}).then(function(game){
       // console.log({game});
        res.json({game});
    })
})

app.post("/deleteGame", function(req, res){
    console.log(`Game Deleted ${req.body.game}`);
    Game.findByIdAndDelete(req.body.game).exec();
    res.redirect('gameList.html');
})

app.post("/getID", function(req, res){
    console.log(req.body.game._id)
    res.redirect("/updatePage.html" + "?id=" + req.body.game)
})

app.post("/updateGame", function(req, res){
    console.log(req.body);
    Game.findByIdAndUpdate(req.body.id, { game: req.body.game}, function(err, docs){
        if(err){
            console.log(err)
        }
        else{
            console.log("Updated User : ", docs);
            res.redirect("gameList.html");
        }
    })
})

//Unity Route
app.post("/unity", function(req, res){
    console.log("Hello from Unity");

    var newData = {
        "level": req.body.level,
        "timeElapsed": req.body.timeElapsed,
        "name": req.body.name
    };
    console.log(newData)
});

app.get("/SendUnityData", function(req, res){
    console.log("Request Made");
    var dataToSend = {
        "level": 9000,
        "timeElapsed": 20100.32,
        "name": "George Saban"
    }
    res.send(dataToSend);
})

app.use(express.static(__dirname+"/pages"));
app.listen(3000, function(){
    console.log(`Running on port ${port}`)
})
