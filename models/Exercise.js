const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const ExerciseSchema = new Schema({
    description: String,
    duration: Number,
    date: {
        type: Date,
        default: Date.now().toString()
    }

})

const Exercise = model("Exercise", ExerciseSchema);

module.exports = Exercise;