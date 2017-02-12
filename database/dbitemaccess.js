

/***************************************************************
 * Database access: All item database calls are in here
 *  
 ***************************************************************/


var mongoose = require('mongoose');
var crypt = require('bcrypt-nodejs');
var uuid = require('node-uuid');
var schema = require('../model/item').getItemModel();
var Item = mongoose.model('Item', schema);
var log = require('../util/log.js').getLogger(__filename);
var config = require('../config/config.json');
var util = require('../util/util.js');

//enable db debugger
mongoose.set('debug', config.MONGOOSE_DEBUG);

/**
 * create a new item in DB
 * @returns
 */

function createItem(aItem,name, callback) {
	
		isItemInDB(aItem.id, function(itemExist) {
			
			//if (itemExist == null) {
				var itemID= uuid.v4(); // use uuid generated for the item id
				console.log("random uuid used as an item id: " + itemID);
				var item = new Item(aItem);
				item.id=itemID;
				item.owner_name=name;
				console.log("CREATEITEM--item"+JSON.stringify(item));
				// insert a new item to db
				item.save(function (err, itemObj) {
					if (err) {
						console.error("Failed to create a item: " + err);
						callback(true, itemObj)
					}
					else {
						log.info('Item is inserted successfully.');
						callback(false, itemObj)
					}
					
				});
			
			
		});
	
}

/**
 * update item info for a given item id
 */
function updateItem(id, updatedJson, callback) {
	
	var query = { id : id };
	log.debug("update query:" + JSON.stringify(query));
	Item.update(query, { $set: updatedJson }, function (err, docs) {
		if (!err) {
			log.debug("Update item result: " + JSON.stringify(docs));
			callback(false, docs)
		}
		else {
			callback(true, docs)
		}
	});
};


/**
 * validate a item existence in DB
 */
function isItemInDB(id, callback) {
	var query = { id : id };
	log.debug("Check if item " + id + " has already in the DB.");
	Item.findOne(query, function(err, item) {
		
	    if (err) {
	    	console.log(err);
	    	callback(null)
	    }
	    else {
	    	if (item != null) {
				log.info("Item " + id + " is found in DB.");
				callback(item);
			}
	    	else {
	    		console.error("Item id doesn't exist in DB.");
	    		callback(null);
	    	}
	    }
	    
	});
}

/**
 * get all items from DB. 
 * can only see own info
 *
 */
function findAllItems(callback) {

	log.debug("findAllItems ");
	Item.find(function (err, docs) {
		if (!err) {
			console.log("findallitems:"+JSON.stringify(docs));
			callback(false,docs);
		}
		else {
			console.log(JSON.stringify(docs));
			callback(true,docs);
		};
	});
};


/**
 * get items info
 * @param owner_id
 * @param callback
 * @returns
 */
function findItem(name, callback) {
	var query = { owner_name :name };
	Item.find(query, function (err, item) {
		if (!err) {
			log.debug("Item found: " + item);
			callback(false, item)
		}
		else {
			// cannot find a user from DB
			log.debug("Item " + id + " cannot be found from DB.");
			callback(true, null)
		}
	});
};


/**
 * find items based on query strings. See Item.js for possible Item parameters query strings
 * @param query
 * @param callback
 * @returns
 */
function queryItem(query, callback) {

    query = JSON.stringify(query);
    var queryvalue = query.toString().split("\"");
    var parma1=queryvalue[1];//attribute
    var parma2=queryvalue[3];//value
    var querystring={};
    if(parma2!=null){
    querystring[parma1]=new RegExp(parma2.toString());
    }
	Item.find(querystring, function (err, items) {
		if (!err) {
			log.debug("item found: " + JSON.stringify(items));
			callback(false, items);
		}
		else {
			console.error("Failed to query items using query string " + JSON.stringify(querystring));
			callback(true, null);
		}
	});
};
/**
 * find items based on owner_id,mainCat,tags,description,name  See Item.js for possible Item parameters query strings
 * @param query
 * @param callback
 * @returns
 */
function queryItemByKeyword(keyword, callback) {

    console.log(keyword)
	if(keyword!=null)
		{
		  var reg=new RegExp(keyword);
		}
	Item.find({ $or:[{owner_id:reg},{description:reg},{name:reg}]},function (err, items) {
		if (!err) {
			log.debug("item found: " + JSON.stringify(items));
			console.log("item found: " + JSON.stringify(items));
			callback(false, items);
		}
		else {
			console.error("Failed to query items using keyword " + JSON.stringify(querystring));
			callback(true, null);
		}
	});
};




/**
 * Delete a item based on its id
 * @param id
 * @param callback
 * @returns
 */
function deleteItem(id, callback) {
	
	var query = {id : id};
	log.debug("To delete with query:" + JSON.stringify(query));
	// we assume the id should be unique in the db, so it should only return with 1 record.
	Item.findOneAndRemove(query, function (err, data) {
		if (!err) {
			
				callback(err, data)
		}
		else { // failed
			callback(err, null)
		}
	});
	
};

/**
 * get items info
 * @param item id
 * @param callback
 * @returns
 */

function findByItemId(id,callback) {
	var query = {id :id };
	console.log(query);
	Item.find(query, function (err, item) {
		if (!err) {
			log.debug("Using item id to find : " + item);

			callback(false, item)
		}
		else {
			// cannot find a user from DB
			log.debug("Item " + id + " cannot be found from DB.");
			callback(true, null)
		}
	});
};

module.exports = {
	 
		createItem           : createItem,
		updateItem           : updateItem,
        isItemInDB           : isItemInDB,
        findAllItems         : findAllItems,
        findItem             : findItem,
        queryItem            : queryItem,
        deleteItem           : deleteItem,   
        queryItemByKeyword   : queryItemByKeyword,
        findByItemId         : findByItemId
};