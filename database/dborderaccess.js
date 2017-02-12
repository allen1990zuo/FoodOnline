
/***************************************************************
 * Database access: All database calls are in here
 *  
 ***************************************************************/


var mongoose = require('mongoose');
var crypt = require('bcrypt-nodejs');
var uuid = require('node-uuid');
var schema = require('../model/Order').getOrderModel();
var Order = mongoose.model('Order', schema);
var log = require('../util/log.js').getLogger(__filename);
var config = require('../config/config.json');
var util = require('../util/util.js');

//enable db debugger
mongoose.set('debug', config.MONGOOSE_DEBUG);

/**
 * create a new Order in DB
 * @returns
 */

function createOrder(aOrder, callback) {
	
		isOrderInDB(aOrder.id, function(OrderExist) {
			
			//if (OrderExist == null) {
				var OrderID= uuid.v4(); // use uuid generated for the Order id
				console.log("random uuid used as an Order id: " + OrderID);
				var order = new Order(aOrder);
				order.order_id=OrderID;
				console.log(order);
				// insert a new Order to db
				order.save(function (err, OrderObj) {
					if (err) {
						console.error("Failed to create a Order: " + err);
						callback(true, OrderObj)
					}
					else {
						log.info('Order is inserted successfully.');
						callback(false, OrderObj)
					}
					
				});
			//}
			//else { // Order exists in teh DB already, send message back to caller.
			//	console.error("Failed to create a Order since the Order id exists in the system already.");
			//	callback(true, aOrder)
			//}
			
		});
	
}

/**
 * update Order info for a given Order id
 */
function updateOrder(id, updatedJson, callback) {
	
	var query = { order_id : id };
	log.debug("update query:" + JSON.stringify(query));
	console.log("update query:" + JSON.stringify(query));
	console.log("update json:" + JSON.stringify(updatedJson));
	Order.update(query, { $set: updatedJson }, function (err, docs) {
		if (!err) {
			log.debug("Update Order result: " + JSON.stringify(docs));
			callback(false, docs)
		}
		else {
			callback(true, docs)
		}
	});
};


/**
 * validate a Order existence in DB
 */
function isOrderInDB(id, callback) {
	var query = { id : id };
	log.debug("Check if Order " + id + " has already in the DB.");
	Order.findOne(query, function(err, Order) {
		
	    if (err) {
	    	console.log(err);
	    	callback(null)
	    }
	    else {
	    	if (Order != null) {
				log.info("Order " + id + " is found in DB.");
				callback(Order);
			}
	    	else {
	    		console.error("Order id doesn't exist in DB.");
	    		callback(null);
	    	}
	    }
	    
	});
}

/**
 * get all Orders from DB. 
 * can only see own info
 *
 */
function findAllOrders(callback) {

	var query = {};
	
	
	log.debug("findAllOrders ");
	Order.find(query, function (err, docs) {
		if (!err) {
			log.debug(docs);
			callback(false, docs)
		}
		else {
			callback(true, docs)
		};
	});
};


/**
 * get Orders info
 * @param item_id
 * @param callback
 * @returns
 */
function findOrder(id, callback) {
	var query = { "order_id" :id };
	Order.find(query, function (err, Order) {
		if (!err) {
			log.debug("Order found: " + Order);
			callback(false, Order)
		}
		else {
			// cannot find a user from DB
			log.debug("Order " + id + " cannot be found from DB.");
			callback(true, null)
		}
	});
};


/**
 * find Orders based on query strings. See Order.js for possible Order parameters query strings
 * @param query
 * @param callback
 * @returns
 */
function queryOrder(query, callback) {

	Order.find(query, function (err, Orders) {
		if (!err) {
			log.debug("Order found: " + JSON.stringify(Orders));
			callback(false, Orders);
		}
		else {
			console.error("Failed to query Orders using query string " + JSON.stringify(querystring));
			callback(true, null);
		}
	});
};
/**
 * find Orders based on Order_id,privider_name,privider_id,item_name,item_id,order_time See Order.js for possible Order parameters query strings
 * @param query
 * @param callback
 * @returns
 */
function queryOrderByKeyword(keyword, callback) {


	if(keyword!=null)
		{
		  var reg=new RegExp(keyword);
		}
	Order.find({$or:[{item_info:{provider_info:{name:reg}}},{item_info:{provider_info:{id:reg}}},{orderfinishedTime:reg},{order_id:reg},{item_info:{item_id:reg}},{item_info:{name:reg}}]}, function (err, Orders) {
		if (!err) {
			log.debug("Order found: " + JSON.stringify(Orders));
			callback(false, Orders);
		}
		else {
			console.error("Failed to query Orders using keyword " + JSON.stringify(querystring));
			callback(true, null);
		}
	});
};

/**
 * insert a array(order_info) into order for a given order_id
 */
function addArrayIntoOrder(order_id, insertJson, callback) {
	
	var query = { order_id : order_id };
	log.debug("update query:" + JSON.stringify(query));
	Order.update(query, { $push: insertJson }, function (err, docs) {
		if (!err) {
			log.debug("intsert array to order result: " + JSON.stringify(docs));
			console.log("intsert array to order result: " + JSON.stringify(docs));
			callback(false, docs)
		}
		else {
			callback(true, docs)
		}
	});
};


/**
 * delete a array(order_info) into order for a given order_id
 */
function deleteArrayFromOrder(order_id,sendjson,callback) {
	Order.update({"order_id":order_id},{$pull:{"item_info":sendjson}},function (err, docs) {
		if (!err) {
			log.debug("drop an array: " + JSON.stringify(docs));
			console.log("drop a array: " + JSON.stringify(docs));
			callback(false, docs)
		}
		else {
			callback(true, docs)
		}
	});
};

module.exports = {
	 
		createOrder           : createOrder,
		updateOrder           : updateOrder,
        isOrderInDB           : isOrderInDB,
        findAllOrders         : findAllOrders,
        findOrder             : findOrder,
        queryOrder            : queryOrder,
        queryOrderByKeyword   : queryOrderByKeyword,
        addArrayIntoOrder     : addArrayIntoOrder,
        deleteArrayFromOrder  : deleteArrayFromOrder
};