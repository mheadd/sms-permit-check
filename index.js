var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var accela = require('accela-construct');
var address = require('./address');

// Get Twilio settings from config.
var config = require('./config');
var twilio = require('twilio')(config.config.accountSID, config.config.authToken);

// Config settings.
var config = require('./config');
accela.setup(config.config.accela);

// Port to run server on.
var port = process.argv[2] || 3000;

// Limit SMS responses.
var limit = 3;

// Set up Express app.
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', function(req, res){

	// Get details from inbound text.
	var to = req.body.From;
	var address = req.body.Body;

	// Create a new address object.
	var adr = new Address();

	// Parse the address sent from user.
	adr.parse(address, function(result, error) {
		
		// Use the address information to look up records in Accela API.
		if(!error) {
			accela.search.records({ expand: 'addresses' }, result, function (records, error) {
			    if(!error) {
			    	// Send results to user.
			    	// TODO: Format response based on Atlanta record structure.
					if(records.result) {
						for(var i=0; i<limit; i++) {
							var message = 'ID: ' + records.result[i].id + '.\n';
							message += 'Type: ' + records.result[i].type.subType + '.\n';
							twilio.sendMessage({ to: to, from: config.config.fromNumber, body: message });
						}
					}
					// No records found at this address.
					else {
						twilio.sendMessage({ to: to, from: config.config.fromNumber, body: 'No records found at that address.' });
					}
				}
				// Houston, we have a problem.
				else {
					twilio.sendMessage({ to: to, from: config.config.fromNumber, body: 'Could not look up records for that address.' });
				}
			});
		}

		// Couldn't parse address sent by user.
		else {
			twilio.sendMessage({ to: to, from: config.config.fromNumber, body: 'Could not use that address. Try again..?' });
		}
		res.status(200).end();
	});
});

app.listen(port);