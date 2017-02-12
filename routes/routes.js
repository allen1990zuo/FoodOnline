//define the route

var dbuseraccess=require("../database/dbuseraccess.js");
var dbitemaccess=require("../database/dbitemaccess.js");
var dborderaccess=require("../database/dborderaccess.js");
var passport= require('passport');
var uuid = require('node-uuid');
var config = require('../config/config.json');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var Client = require('node-rest-client').Client;
var client = new Client();
/***************************************************************
 * Routes for server
 * 
 ****************************************************************/

module.exports = function(app) {
	
	// passport needs ability to serialize and unserialize users out of session
	passport.serializeUser(function(user, done) {
		done(null, true);
	});

	passport.deserializeUser(function(id, done) {
		done(null, true);
	});

	// passport local strategy for local-login, refers to this app
	passport.use('local-login', new LocalStrategy(function(username, password, done) {
		console.log("LocalStrategy is used." + username + "," + password);
		
		// check if username in the database with specified password
		dbuseraccess.isAthenticatedUser(username, password, function(err, user) {
			
			if (err) {
				 return done(null, false, { message: 'Failed to authenticate ' + username });	
			}
			else {
				return done(null, {"username" : username, "password" : password});
			}
		
		});
		
	}));

	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions	
	
	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {

		console.log("Is the user authenticated? " + req.isAuthenticated());
		
	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated()) {
	        return next();
	    }

	    // if they aren't redirect them to the home page
	    res.redirect('/login');
	}

	app.post('/signup',function(req,res){
		 client.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAmA5wrbj0kNOot7iPwDnQNssDBxR0mbzo",function(data,erro){
			console.log("right:"+JSON.stringify(data));
	    	var lat=data.location.lat;
	    	var lng=data.location.lng;
	    	var user_id=uuid.v4();
			var user={
					"name":req.body.name,
					"password":req.body.password,
					"user_id":user_id,
					"type":req.body.type,
					"location":[lng,lat]
			}
			console.log("user:"+JSON.stringify(user));
			dbuseraccess.createUser(user,function(err,data){
				if(err){
					console.log("signup--route:"+err)
					res.send(err);
				}
				else{
					console.log(JSON.stringify(data));
					res.send(data);
				}
			})
	   
        })
		
	})
	
    // ===================================== 
    // process the login form
    // =====================================
    //
    app.post('/login', passport.authenticate("local-login",  {
         failureRedirect: '/login'
    }),    
    function(req, res) {
    	name=req.body.username;
    	console.log('--name--login'+JSON.stringify(name));
    	console.log("local-login authentication is done. req.isAuthenticated()? " + req.isAuthenticated()); 
    	dbuseraccess.findUser(name,function(err,user){
    		if(err){console.log(err)}
    		else{
    			console.log('loing-user--'+JSON.stringify(user));
    			console.log('login-user:'+JSON.stringify(user[0].name))
    			res.cookie("x-key", user[0].name, { maxAge: config.COOKIE_EXPIRE_IN_MS, httpOnly: true});
    			res.send(user);
    		}
    	})
    	
    });
	
	
    
   //get userinfo information
   app.get('/userinfo',isLoggedIn,function(req,res){
	   var name=req.cookies["x-key"];
	   console.log(JSON.stringify(name));
	   dbuseraccess.findUser(name,function(err,data){
		   if(err){console.log(err)}
		   else{
			   console.log(JSON.stringify(data));
			   res.send(data);
		   }
	   })
	   
   })
   
   //update userinfo 
   app.post('/updateuser',isLoggedIn,function(req,res){
	   client.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAmA5wrbj0kNOot7iPwDnQNssDBxR0mbzo",function(data){
	    	console.log(JSON.stringify(data));
	    	var lat=data.location.lat;
	    	var lng=data.location.lng;
	    	var name=req.cookies["x-key"];;
	 	    var sendjson=req.body;
	 	    sendjson.location=[lng,lat];
	 	    console.log("name--update:"+JSON.stringify(name)+"---"+JSON.stringify(sendjson));
	 	    dbuseraccess.updateUser(name,sendjson,function(err,data){
	 		   if(err){console.log(err)}
	 		   else{
	 			   console.log(JSON.stringify(data));
	 			   res.send(data);
	 		   }
	 	    })
		 	    
		 	   
	   })
	   
   })
   
   
   //find all sellers
   app.post('/sellerinfo',isLoggedIn,function(req,res){
	   var query={type:2};
	   dbuseraccess.queryUser(query,function(err,data){
		   if(err){console.log(err)}
		   else{
			   console.log(JSON.stringify(data));
			   res.send(data);
		   }
	   })
   })
   
   
   //change userinfo password
   app.post('/changepassword',isLoggedIn,function(req,res){
	   var name=req.body.name;
	   var password=req.body.password;
	   console.log("name--update:"+JSON.stringify(name)+"---"+JSON.stringify(password));
	   dbuseraccess.changepassword(name,password,function(err,data){
		   if(err){console.log(err)}
		   else{
			   console.log(JSON.stringify(data));
			   res.send(data);
		   }
	   })
   })
   
   
   //add item info to cart in userinfo
   app.post("/addArrayToUser",isLoggedIn,function(req,res){
	   var sendjson={
			   item_id:req.body.id,
	           name: req.body.name,
	           unitPrice:req.body.unitPrice,
	           image:req.body.image,
	           owner_name:req.body.owner_name,
	           owner_tel:req.body.owner_tel
	   }
	   name=req.cookies["x-key"];
	   console.log("name-addarray:"+JSON.stringify(name));
	   console.log("sendjson--addarray"+JSON.stringify(sendjson));
	   dbuseraccess.addArrayIntoUser(name,sendjson,function(err,data){
		   if(err){console.log(err)}
		   else{
			   console.log("addarray--user:"+JSON.stringify(data));
			   res.send(data);
		   }
	   })
   })
   
   
   //deleteitemfromcart
   app.post("/deleteitemfromcart",isLoggedIn,function(req,res){
	   name=req.cookies["x-key"];
	   var sendjson={cart:req.body};
	   console.log("deleteitemfrom cart --sendjson"+JSON.stringify(sendjson));
	   dbuseraccess.deleteArrayFromUser(name,sendjson,function(err,data){
		   if(err){console.log(err)}
		   else{
			   console.log("delete--user:"+JSON.stringify(data));
			   res.send(data);
		   }
	   })
   })
   
   //item
  


   
 
/** API path that will upload the files */
  var imagename;
  app.post('/upload', function(req, res) {
	var storage = multer.diskStorage({ //multers disk storage settings
	    destination: function (req, file, callback) {
	    	callback(null, './public/images/fooditems');
	    },
	    filename: function (req, file, callback) {
	        imagename=uuid.v4()+".jpg"
	    	callback(null, imagename);
	       
	    }
	    
	});

	var upload = multer({ //multer settings
	                storage: storage
	            }).single('file');
	console.log('test-upload--test:'+res.body);
    upload(req,res,function(err){
    	
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        else{
        	
        	res.json({error_code:0,err_desc:null});
        }
         
    });
  });
  
  //create item
  app.post('/createitem',isLoggedIn,function(req,res){
	   var item=req.body;
	   item.image=imagename;
	   console.log(JSON.stringify(item));
	   var name=req.cookies['x-key'];
	   dbitemaccess.createItem(item,name,function(err,data){
		   if(err){console.log(err)}
		   else{
			   console.log(JSON.stringify(data));
			   res.send(data);
		   }
	   })
  })
  

//list items
   app.get('/listitem',isLoggedIn,function(req,res){
	   var name=req.cookies['x-key'];
	   dbitemaccess.findItem(name,function(err,data){
		   if(err){console.log(err)}
		   else{
			   console.log(JSON.stringify(data));
			   res.send(data);
		   }
	   })
   })
   
   //delete item with a certain id
   app.post('/deleteitem',isLoggedIn,function(req,res){
	   var id=req.body.id;
	   console.log("id:"+JSON.stringify(id));
	   dbitemaccess.deleteItem(id,function(err,data){
		   if(err){console.log(err)}
		   else{
			   console.log(JSON.stringify(data));
			   res.send(data);
		   }
	   })
   })
   
   app.post('/updateitem',isLoggedIn,function(req,res){
	   var id=req.body.id;
	   console.log("id:"+JSON.stringify(id))
	   var sendjson={
			    "name":req.body.name,
				"description":req.body.description,
				"unitPrice":req.body.unitPrice,
	   }
	   console.log("updateitem:"+JSON.stringify(sendjson));
	   dbitemaccess.updateItem(id,sendjson,function(err,data){
		   if(err){console.log(err)}
		   else{
			   console.log(JSON.stringify(data));
			   res.send(data);
		   }
	   })
   })
  
   
 //find items based on status, when the status is publish
	app.get('/itemFindAll',function(req,res){
		dbitemaccess.findAllItems(function(err,data){
			if(err){console.log(err)}
			else{
				console.log(JSON.stringify(data));
				res.send(data);
			}
		})
	});
  
  
//find item by keyword
	app.post('/itemsByKeyword',function(req,res){
	    	var keyword=req.body.keyword;
	    	console.log("keyword--itemsbykeyword:"+keyword)
	    	dbitemaccess.queryItemByKeyword(keyword,function(err,data){
	    		if(err){res.send(err);}
	    		else{
	    			res.send(data);
	    			console.log("itembykeyword:"+JSON.stringify(data));
	    		}
	    	});
	    });
	
//find item by provider_id
	app.post('/itemsbyprovider',function(req,res){
		var name=req.body.name;
		dbitemaccess.findItem(name,function(err,data){
			if(err){res.send(err);}
    		else{
    			res.send(data);
    			console.log("itemsbyprovider:"+JSON.stringify(data));
    		}
		})
	})
	
	
	//order
	
	//create order
	app.post("/createorder",isLoggedIn,function(req,res){
		var order=req.body;
		console.log("createorder:"+JSON.stringify(order));
		dborderaccess.createOrder(order,function(err,data){
			if(err){res.send(err);}
    		else{
    			res.send(data);
    			console.log("createorder--route:"+JSON.stringify(data));
    		}
		})
	})
	
	
	//order info with certain consumer name
	app.post("/orderinfo",isLoggedIn,function(req,res){
		var name=req.body.name;
		var query={"consumer_name":name}
		dborderaccess.queryOrder(query,function(err,data){
			if(err){res.send(err);}
    		else{
    			res.send(data);
    			console.log("orderinfo--route:"+JSON.stringify(data));
    		}
		})
	})
	
	
	//order info with certain consumer name
	app.post("/orderinfoProvider",isLoggedIn,function(req,res){
		var name=req.body.name;
		var query={"item_info.owner_name":name}
		console.log("orderinfoProvider--"+JSON.stringify(query))
		dborderaccess.queryOrder(query,function(err,data){
			if(err){res.send(err);}
    		else{
    			res.send(data);
    			console.log("orderinfo--route:"+JSON.stringify(data));
    		}
		})
	})
	
	
	//delete item from order
    app.post("/deleteitemfromOrder",isLoggedIn,function(req,res){
    	var order_id=req.body.order_id;
    	var sendjson=req.body.item;
    	console.log('deleteitem-route--'+JSON.stringify(order_id)+"sendjson:"+JSON.stringify(sendjson));
    	dborderaccess.deleteArrayFromOrder(order_id,sendjson,function(err,data){
    		if(err){res.send(err);}
    		else{
    			res.send(data);
    			console.log("orderinfo--route:"+JSON.stringify(data));
    		}
    	})
    })
    
    //find order by query
    app.post('/orderbyquery',isLoggedIn,function(req,res){
    	var sendjson=req.body;
    	console.log(JSON.stringify(sendjson));
    	dborderaccess.queryOrder(sendjson,function(err,data){
    		if(err){res.send(err);}
    		else{
    			res.send(data);
    			console.log("orderbyquery--route:"+JSON.stringify(data));
    		}
    	})
	
    })
    
    
    //updateorder 
    app.post('/updateorder',isLoggedIn,function(req,res){
    	var sendjson={item_info:req.body.item_info};
    	var order_id=req.body.order_id;
    	
    	console.log("updateorder-route:"+JSON.stringify(sendjson)+"---order:"+JSON.stringify(order_id));
    	dborderaccess.updateOrder(order_id,sendjson,function(err,data){
    		if(err){res.send(err);}
    		else{
    			res.send(data);
    			console.log("orderbyquery--route:"+JSON.stringify(data));
    		}
    	})
    	
    	
    	
    	
    })
    
    
    
};