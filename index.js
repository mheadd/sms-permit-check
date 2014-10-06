// Include required modules.
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

// Port to run server on.
var port = process.argv[2] || 3000;

// Get Twilio settings from config.
var config = require('./config');
var twilio = require('twilio')(config.config.accountSID, config.config.authToken);

// SQL for querying CivicData.com.
var ckan_sql_template = 'SELECT * from "#resourceid#" WHERE "Street Address" LIKE \'#address#%\' ORDER BY "Date" DESC';
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
	request(ckan_api + sql, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var ckan_json = JSON.parse(body);

	    // Format response.
	    if(ckan_json.result.records.length > 0) {
	    	var permit_details = ckan_json.result.records[0];
	    	var description = permit_details["Permit Name"] || 'No description provided';
		    var message = 'DESCRIPTION: ' + description.toProperCase() + '.\n ';
		    message += 'TYPE: ' + permit_details["Type"]  + '.\n ';
		    message += 'RECORD #: ' + permit_details["Record #"] + '.\n ';
		    message += 'STATUS: ' + 'In Progress.'
	    }
	    else {
	    	message = 'Sorry. No permits found at that address.';

	    // Send SMS response to user.
		twilio.sendMessage({ to: to, from: config.config.fromNumber, body: message }, function(err, responseData) { 
		    if (!err) {
		        console.log(responseData.body);
		    }
		});
	  }
	});

	// Send back 200 response to Twilio.
	res.status(200).end();
});

app.listen(port);