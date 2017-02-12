var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
* Get order model
*/
function getOrderModel() {
    
    return new Schema({
      
        order_id: { type: String, index : true, unique: true },  // order id use uuid generate random need to be unique
        
        // description of item 
        item_info:[{
                owner_name: { type: String, index:true }, // item id - could be an email address 
                name: { type: String, index : true,required:true },   // item - a display name - no need to be unique
        		unitPrice:{type:Number,required:true},// price of single item 
        		status:{type:String}, //define the order status, process, unprocess
                owner_tel: { type: String, required:true }, 
                item_id:{type:String}
            
        }],
        
        consumer_name: { type: String, required: true }, // consumer id - could be an email address
        consumer_tel: { type: String, required:true },       
                       
       
        
 
    });
}

module.exports = {
		getOrderModel : getOrderModel
};