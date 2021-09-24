const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const UserSchema  = new Schema({
    username: String,
    count: Number,
    log: [{
        type: mongoose.Types.ObjectId,
        ref: "Exercise"
    }]
});

const User = model("User", UserSchema);

module.exports = User;