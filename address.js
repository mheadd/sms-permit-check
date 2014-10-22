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

			// Address object to pass into call to Accela Construct API.
			addressObject = { address: {} };

			for(var item in results) {
				if(results[item].tag == 'AddressNumber') {
					addressObject.address.streetStart = results[item].value;
				}
				else if(results[item].tag == 'StreetName') {
					addressObject.address.streetName = results[item].value;
				}
				else if(results[item].tag == 'StreetNamePostType') {
					addressObject.address.streetSuffix = { text: results[item].value, value: results[item].value };
				}
				else if(results[item].tag == 'StreetNamePostDirectional') {
					addressObject.address.streetSuffixDirection = { text: results[item].value, value: results[item].value };
				}
				else if(results[item].tag == 'PlaceName') {
					addressObject.address.city = results[item].value;
				}
				else if(results[item].tag == 'StateName') {
					addressObject.address.state = { text: results[item].value, value: results[item].value };
				}
				else if(results[item].tag == 'ZipCode') {
					addressObject.address.postalCode = results[item].value;
				}
			}

			callback(addressObject, null);

		}
		else {
			callback(null, error + '. Response code: ' + response.statusCode);
		}

	});

};

exports.Address = Address;