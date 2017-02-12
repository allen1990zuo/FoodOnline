var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
* Get item model
*/
function getItemModel() {
    
    return new Schema({
        owner_name:{ type: String, index : true, required:true},  // user id - could be an email address- need to be unique,
        id: { type: String, index : true, unique: true },  // item id use utilities/utils.js gentandom need to be unique
        name: { type: String, index : true},   // item - a display name - no need to be unique
        description: { type: String}, // description of the item
        image:{type:String}, // store the address of the image, real string   
        unitPrice:{type:Number},//description the price of item
        owner_tel:{type:String}// owner telphone
    });
}

module.exports = {
        getItemModel : getItemModel
};