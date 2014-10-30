var request = require('request');

Address = function() {

	// API to parse address.
	this.url = 'http://usaddress.datamade.us/api/?address=';

};

Address.prototype.parse = function(adr, callback) {

	request(this.url + adr, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var addressParts = JSON.parse(body);
			var results = addressParts.result;

			// Record object to pass into call to Accela Construct API.
			recordObject = { address: {}, module:"Building", types: [ { type:"Commercial" }, { type:"Residential" } ] };

			for(var item in results) {
				if(results[item].tag == 'AddressNumber') {
					recordObject.address.streetStart = results[item].value;
				}
				else if(results[item].tag == 'StreetName') {
					recordObject.address.streetName = results[item].value;
				}
				else if(results[item].tag == 'StreetNamePostType') {
					recordObject.address.streetSuffix = { text: results[item].value, value: results[item].value };
				}
				else if(results[item].tag == 'StreetNamePostDirectional') {
					recordObject.address.streetSuffixDirection = { text: results[item].value, value: results[item].value };
				}
				else if(results[item].tag == 'PlaceName') {
					recordObject.address.city = results[item].value;
				}
				else if(results[item].tag == 'StateName') {
					recordObject.address.state = { text: results[item].value, value: results[item].value };
				}
				else if(results[item].tag == 'ZipCode') {
					recordObject.address.postalCode = results[item].value;
				}
			}

			callback(recordObject, null);

		}
		else {
			callback(null, error + '. Response code: ' + response.statusCode);
		}

	});

};

exports.Address = Address;