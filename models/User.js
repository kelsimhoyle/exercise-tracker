const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const UserSchema  = new Schema({
    username: String,
    count: {
        type: Number,
        default: 0
    },
    log: [{
        type: mongoose.Types.ObjectId,
        ref: "Exercise"
    }]
});

const User = model("User", UserSchema);

module.exports = User;