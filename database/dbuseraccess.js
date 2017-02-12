


/***************************************************************
 * Database access: All user database calls are in here
 *  
 ***************************************************************/


var mongoose = require('mongoose');
var crypt = require('bcrypt-nodejs');
var schema = require('../model/user').getUserModel();
var User = mongoose.model('User', schema);
var log = require('../util/log.js').getLogger(__filename);
var config = require('../config/config.json');
var ObjectID = require('mongodb').ObjectID;

//enable db debugger
mongoose.set('debug', config.MONGOOSE_DEBUG);


/**
 * validate a user existence in DB
 */
function isUserInDB(name, callback) {
	var query = { name : name};
	console.log("Check if username " + name + " has already in the DB.");
	User.findOne(query, function(err, user) {
		
	    if (err) {
	    	console.log(err);
	    	callback(null)
	    }
	    else {
	    	if (user != null) {
	    		console.log("User " + name + " is found in DB.");
				callback(user);
			}
	    	else {
	    		console.error("User name doesn't exist in DB.");
	    		callback(null)
	    	}
	    }
	    
	});
}

/**
 * create a new user in DB
 * @returns
 */
function createUser(aUser, callback) {
	
	var password = aUser.password;
	// encrypt and hash the password, so we don't sotre it directly in the database
	crypt.hash(password, null, null, function(err, hash) {
		// check the user id if it exists already, if exists, we should fail the signup
		isUserInDB(aUser.name, function(userExist) {
			
			if (userExist == null) {
				aUser.password = hash;
				var user = new User(aUser);
				console.log("dbuseraccess-user"+JSON.stringify(user));
				// insert a new user to db
				user.save(function (erro, userObj) {
					if (erro) {
						console.error("Failed to create a user: " + err);
						callback(true, userObj)
					}
					else {
						console.log('User is inserted successfully.');
						callback(false, userObj)
					}
					
				});
			}
			else { // user exists in teh DB already, send message back to caller.
				console.log("Failed to create a user since the user id exists in the system already.");
				callback(true, aUser)
			}
			
		});
	});
}


/**
 * get a given user info
 * @param name
 * @param callback
 * @returns
 */
function findUser(name, callback) {
	var query = { name : name };
	User.find(query, function (err, user) {
		if (!err) {
			console.log("User found: " + user);
			callback(false, user)
		}
		else {
			// cannot find a user from DB
			console.log("User " + id + " cannot be found from DB.");
			callback(true, null)
		}
	});
};


/**
 * find users based on query strings. See user.js for possible user parameters query strings
 * @param query
 * @param callback
 * @returns
 */
function queryUser(query, callback) {
	User.find(query, function (err, users) {
		if (!err) {
			console.log("Users found: " + JSON.stringify(users));
			callback(false, users);
		}
		else {
			console.log("Failed to query users using query string " + JSON.stringify(query));
			callback(true, null);
		}
	});
};


/**
 * update user info for a given user id
 */
function updateUser(name, updatedJson, callback) {
	
	var query = { name : name };
	log.debug("update query:" + JSON.stringify(query));
	User.update(query, { $set: updatedJson }, function (err, docs) {
		if (!err) {
			console.log("Update user result: " + JSON.stringify(docs));
			callback(false, docs)
		}
		else {
			callback(true, docs)
		}
	});
};


/**
 * change password
 * @returns
 */
function changepassword(name,password, callback) {
	
	var query = { name : name };
	var hash = crypt.hashSync(password);
	var sendjson={"password":hash};
	console.log("changepassword-db:"+JSON.stringify(sendjson))
	User.update(query,sendjson,function(err,data){
		if(err){
			callback(true,data);
		}
		else{
			console.log(JSON.stringify(data))
			callback(false,data);
		}
	})
		
	
}

/**
 * insert a array(address,order_id,comment) into userinfo for a given user id
 */
function addArrayIntoUser(name, insertJson, callback) {
	
	var query = { name : name };
	console.log("query"+JSON.stringify(query))
	console.log("insertJson"+JSON.stringify(insertJson))
	log.debug("update query:" + JSON.stringify(query));
	User.update(query, { $push: {"cart":insertJson}}, function (err, docs) {
		if (!err) {
			console.log("intsert address to user result: " + JSON.stringify(docs));
			callback(false, docs)
		}
		else {
			console.log("addarray-erro")
			callback(true, docs)
		}
	});
};


/**
 * delete a array(address,order_id,comment) in userinfo for a given user id
 */
function deleteArrayFromUser(name,deleteJson,callback) {
	var name=name;
	User.update({"name":name},{$pull:deleteJson},function (err, docs) {
		if (!err) {
			log.debug("find an array: " + JSON.stringify(docs));
			console.log("find a array: " + JSON.stringify(docs));
			callback(false, docs)
		}
		else {
			callback(true, docs)
		}
	});
};



/**
 * authenticate a user using the userid/password
 */
function isAthenticatedUser(name, password, callback) {
	
	var query = { 'name':name};
	log.debug("authenticating userid: " + JSON.stringify(query));
	console.log("authenticating userid: " + JSON.stringify(query));
	User.findOne(query, function(err, user) {
		if (user !== null) {
			
			// we need to validate the password based on the hash value
			crypt.compare(password, user.password, function(err, res) {
				
				log.debug("res:" + res);
				if (res) { // password hash matched
					log.info("User passwd hash is matched.");
					console.log("User passwd hash is matched.");
					callback(false, user);
				}
				else {
					console.error("User is not authenticated.");
					console.log("User passwd hash is matched.");
					callback(true, null);
				}
			});
			
		}
		else { // user is not in the DB
			console.error("User is not authenticated because the user id doesn't exist in the DB.");
			callback(true, null);
		}
	});
}


module.exports = {
		createUser         : createUser,
        findUser           : findUser,
        queryUser          : queryUser,
        updateUser         : updateUser,
        isAthenticatedUser : isAthenticatedUser,
        isUserInDB         : isUserInDB,
        changepassword     : changepassword,
        addArrayIntoUser   : addArrayIntoUser,
        deleteArrayFromUser: deleteArrayFromUser
};

