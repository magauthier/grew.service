const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Plant = new Schema({
    plant_name: {type: String},
    plant_category: {type: String},
    plant_grew: {type: String}
});

module.exports = mongoose.model('Plant', Plant);