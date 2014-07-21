// Include required modules.
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

// Get Twilio settings from config.
var config = require('./config');
var twilio = require('twilio')(config.config.accountSID, config.config.authToken);

// SQL for querying CivicData.com
var ckan_sql_template = 'SELECT * from "#resourceid#" WHERE "ADDRESS" LIKE \'#address#%\' ORDER BY "DATE OPENED" DESC';
var ckan_api = 'http://www.civicdata.com/api/action/datastore_search_sql?sql=';

// Set up Express app.
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Utility method to proper case description.
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// Route for Twilio.
app.post('/', function(req, res){

	// Get details from inbound text.
	var to = req.body.From;
	var address = req.body.Body.toUpperCase();
	var sql = encodeURIComponent(ckan_sql_template.replace('#address#', address).replace('#resourceid#', config.config.resourceID));

	// Make call to CivicData.com API.
	request(ckan_api+sql, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var ckan_json = JSON.parse(body);

	    // Format response
	    if(ckan_json.result.records.length > 0) {
	    	var permit_details = ckan_json.result.records[0];
	    	var description = permit_details["DESCRIPTION"] || 'No description provided';
		    var message = 'NAME: ' + permit_details["RECORD NAME"] + '. ';
		    message += 'DESCRIPTION: ' + description.toProperCase() + '. ';
		    message += 'STATUS: ' + permit_details["RECORD STATUS"]  + '. ';
		    message += 'ID: ' + permit_details["RECORD ID"] + '. ';
	    }
	    else {
	    	message = 'Sorry. No permits found at that address.';
	    }

	    //Send SMS response.
		twilio.sendMessage({ to: to, from: config.config.fromNumber, body: message }, function(err, responseData) { //this function is executed when a response is received from Twilio
		    if (!err) {
		        console.log(responseData.body);
		    }
		});
	  }
	});

	// Send back 200 response to Twilio.
	res.status(200).end();
});

app.listen(3000);