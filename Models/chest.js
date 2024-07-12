const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    bodyPart: { type: String, required: true },
    equipment: { type: String, required: true },
    gifUrl: { type: String, required: true },
    id: { type: String, required: true ,unique: true},
    name: { type: String, required: true },
    target: { type: String, required: true },
    secondaryMuscles: [{ type: String }],
    instructions: [{ type: String }]
});

const Chest = mongoose.model('Chest', exerciseSchema);

module.exports = Chest;
