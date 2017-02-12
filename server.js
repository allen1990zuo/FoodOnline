

/**
 * Main omegaalpha server running services to serve for OmegaAlpha web sites and web applications
 * This is an entry point for all other functions for the OmegaAlpha product
 * 
 * OmegaAlpha application is running with clusters. For each process on the system, it will
 * start application to provide both load balanced server for improving performance as well
 * as to provide failover the application if the master process running the application
 * failed, other fork worker will pick up to serve for the requests.
 * 
 */


var fs = require('fs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser= require('body-parser');
var mongoose= require('mongoose');
var morgan =  require('morgan');
var config = require('./config/config.json');
var log = require('./util/log.js').getLogger(__filename);
var port = config.SERVER_PORT;




// worker process as clustered for the same applications
	// use local authentication for security
	var LocalStrategy = require('passport-local').Strategy;

	// running applications on the master process
	var express = require('express');
	// create omegaAlpha application
	var app = express();

	app.use(morgan('dev'));  // log every request to the console
	app.use(express.static(__dirname + '/public'));

	app.use(cookieParser()); // read cookies (needed for auth)

	app.use(session({
	    secret: config.SESSION.SESSION_SECRET,
	    resave: true,
	    saveUninitialized: true,
	    cookie: { maxAge: config.SESSION.COOKIE_MAXAGE_MS }
	}));


	
	app.use(bodyParser.json()); // get information from html forms
	app.use(bodyParser.urlencoded({ extended: true}));

	//initialize the DB connections
	//load configuration details from the server configuration JSON
	var dbURL = config.DB_URL;
	log.info("Initializing the DB connection. " + dbURL);
	mongoose.Promise= global.Promise;
	mongoose.connect(dbURL);




	

	//routes
	require('./routes/routes.js')(app);
	
    // non SSL
	var http = require('http').createServer(app);
	http.listen(config.SERVER_PORT, function(){
		  console.log('server is listening on :' + config.SERVER_PORT);
		  
	});	

