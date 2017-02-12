


/***************************************************************
 * Loggers for the platform
 *  
 ***************************************************************/

var fs = require('fs');
var utils = require('./util.js');
var path = require('path');
var config = require('../config/config.json');

var logfile = 'server.log';
var errfile = 'server.err';

/*
 * Constructor. Use config.json as config
 * file - file path that used this logger. MUST BE __filename
 */
function log(file){
    this.file = file;
    this.debugProp = config.DEBUG;
}

/*
 * log Debug message to logfile
 * debug - string debug message
 * If DEBUG=true. Debug message is printed in logfile
 * If DEBUG=false. no Debug message is printed
 */
log.prototype.debug = function(debug){
    if(this.debugProp === 'true'){
        fs.appendFile(logfile, utils.printTime() + ' [DEBUG] ' + (this.file !== undefined ? getfile(this.file) + ' ' : '') + debug + '\n', 'utf8',
        	(err) => {
        		if (err) {
        			console.error("Failed to write debug to the log files. " + err);	
        		}	
  		});
    }
};

/*
 * log info message to logfile
 * info - string INFO message
 */
log.prototype.info = function(info){
    fs.appendFile(logfile, utils.printTime() + ' [INFO] ' + (this.file != undefined ? getfile(this.file) + ' ' : '') + info + '\n', 'utf8', 
    		(err) => {
    			if (err) {
    			  console.error("Failed to write trace to the log files. " + err);	
    			}	
    		});
};

/*
 * log warn message to logfile
 * warn - string WARN message
 */
log.prototype.warn = function(warn){
    fs.appendFile(logfile, utils.printTime() + ' [WARN] ' + (this.file != undefined ? getfile(this.file) + ' ' : '') + warn + '\n', 'utf8',
    		(err) => {
        		if (err) {
        			console.error("Failed to write warning to the log files. " + err);	
        			console.warn(warn);
        		}	
    		});
};

/*
 * log err message to logfile and errfile
 * err - string ERR message
 */
log.prototype.error = function(err){
    var ts = utils.printTime();
   
    fs.appendFile(logfile, ts + ' [ERR] ' + (this.file != undefined ? getfile(this.file) + ' ' : '') + err + '\n', 'utf8',
    		(anerr) => {
        		if (anerr) {
        			console.error("Failed to write error to the log files. " + anerr);	
        			console.error(err);
        		}	
    		});
};

/*
 * log message to console and logfile
 * msg - string
 */
log.prototype.console = function(msg){
    var ts = utils.printTime();
   
    fs.appendFile(logfile, ts + ' [CONS] ' + (this.file != undefined ? getfile(this.file) + ' ' : '') + msg + '\n', 'utf8',
    		(err) => {
        		if (err) {
        			console.error("Failed to write message to the log files. " + err);	
        			console.warn(err);
        		}	
    		});
    
    console.log(ts + ' ' + (this.file != undefined ? getfile(this.file) + ' ' : '') + msg);
};

/*
 * get logger object
 * file - file path that used this logger. MUST BE __filename
 */
function getLogger(file){
    return new log(file);
}

module.exports = {
        getLogger : getLogger
};

/*
 *  Private functions below
 */

function getfile(file){

    if(file == undefined){
        return '';
    }else{
        var root = path.dirname(__dirname);
        return '[' + file.replace(root, '') + ']';
    }
}