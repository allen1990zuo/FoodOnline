var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Get User model
 */
function getUserModel() {
	
	return new Schema({
		name: { type: String, index : true },   // username - a display name - no need to be unique
		shopname:{type:String}, //define the shopname if the type is 2
		password: String, // encrypted password 
		user_id: { type: String, index : true},  // uuid
		type: 	{ type: Number, min: 0, max: 2 },  //   1- consumer user;  2- provider user (note: provider user becomes a consumer user by default)
		email: String,
		tel: String,
		cart:[{
            item_id: { type: String, index : true},  // item id use utilities/utils.js gentandom need to be unique
            name: { type: String, index : true},   // item - a display name - no need to be unique
            unitPrice:{ type:Number, required:true},//description the price of item
            image:{type:String},
            owner_name:{type:String},
            owner_tel:{type:String}
        }],
        location: {
	        type: [Number],
	        index: '2dsphere'
	}, // define the lng and lat
		
	});
}

module.exports = {
		getUserModel : getUserModel
};

