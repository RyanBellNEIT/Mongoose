var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Schema = new Schema({
    game:{
        type:String,
        required:true
    }
});

mongoose.model("game", Schema);