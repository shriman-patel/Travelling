
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passpostLocalMangoose =  require("passport-local-mongoose");
const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
});
userSchema.plugin(passpostLocalMangoose);
module.exports= mongoose.model(`User`,userSchema);