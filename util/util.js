

var config = require('../config/config.json');



function padding(pad, str){
    str = "" + str;
    return pad.substr(0, pad.length - str.length) + str;
}

/*
 * print current time. Format [YYYY-MM-DD-HH-MM-SS]
 */
function printTime(){
    var d = new Date();
    var pad = "00";
    return '[' + d.getFullYear() + '-' + padding(pad, d.getMonth() + 1) + '-' +
               padding(pad, d.getDate()) + '-' + padding(pad, d.getHours()) + '-' +
               padding(pad, d.getMinutes()) + '-' + padding(pad, d.getSeconds()) + ']';
}

/*
 * print current time. Format [YYYY-MM-DD-HH-MM-SS]
 */
function printTimestamp(){
    var d = new Date();
    var pad = "00";
    return   d.getFullYear() + padding(pad, d.getMonth() + 1) +
             padding(pad, d.getDate()) + padding(pad, d.getHours()) +
             padding(pad, d.getMinutes()) + padding(pad, d.getSeconds());
}

/*
 * print current date. Format [YYYY-MM]
 */
function printDate(){
    var d = new Date();
    var pad = "00";
    return d.getFullYear() + '-' + padding(pad, d.getMonth() + 1) + '-' + padding(pad, d.getDate());
}




module.exports = {
		printTime : printTime,
        printTimestamp : printTimestamp,
        printDate : printDate
       
};