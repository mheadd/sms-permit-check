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
			searchObject = { address: {}, module: 'Building', status: { text: 'Active/Permit Issued', value: 'Active/Permit Issued' } };

			for(var item in results) {
				if(results[item].tag == 'AddressNumber') {
					searchObject.address.houseNumberStart = parseInt(results[item].value);
				}
				else if(results[item].tag == 'StreetName') {
					searchObject.address.streetName = results[item].value + '%';
				}
				else if(results[item].tag == 'StreetNamePostType') {
					searchObject.address.streetSuffix = { text: results[item].value, value: results[item].value };
				}
				else if(results[item].tag == 'StreetNamePostDirectional') {
					searchObject.address.streetSuffixDirection = { text: results[item].value, value: results[item].value };
				}
				else if(results[item].tag == 'PlaceName') {
					searchObject.address.city = results[item].value;
				}
				else if(results[item].tag == 'StateName') {
					searchObject.address.state = { text: results[item].value, value: results[item].value };
				}
				else if(results[item].tag == 'ZipCode') {
					searchObject.address.postalCode = results[item].value;
				}
			}
			callback(searchObject, null);

		}
		else {
			callback(null, error + '. Response code: ' + response.statusCode);
		}

	});

};

exports.Address = Address;