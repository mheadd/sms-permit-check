# SMS Permit Check (Atlanta version)

A Node.js application that allows a user to check for a permit at a specific address using text messaging.

The data source for permit information is [Accela Automation](https://developer.accela.com/).

## Usage

* Log in to the [Accela Devloper Portal](https://developer.accela.com/).
* Create a new citizen application (make note of the App ID & App Secret).
* Clone this repo.
* Run <code>npm install</code> to install dependencies.
* Set up a [Twilio](https://www.twilio.com/) account.
* Copy <code>config.sample.js</code> to <code>config.js</code> and enter your Twilio credentials & Accela app credentials.

## Sample Record

A sample response when searching for a record using the Accela Construct API.

```json
{
    "result": [
        {
            "addresses": [
                {
                    "streetStart": 660,
                    "refAddressId": 924562401,
                    "id": 1000718993,
                    "isPrimary": "Y",
                    "streetName": "PEACHTREE",
                    "postalCode": "00000",
                    "county": "FULTON",
                    "serviceProviderCode": "ATLANTA_GA",
                    "city": "ATLANTA",
                    "recordId": {
                        "id": "ATLANTA_GA-14BLR-00000-18389",
                        "trackingId": 0,
                        "serviceProviderCode": "ATLANTA_GA",
                        "value": "14BLR-00000-18389"
                    },
                    "state": {
                        "value": "GA",
                        "text": "GA"
                    },
                    "streetSuffix": {
                        "value": "ST",
                        "text": "ST"
                    },
                    "streetSuffixDirection": {
                        "value": "NE",
                        "text": "NE"
                    }
                }
            ],
            "name": "Curing Kids",
            "id": "ATLANTA_GA-14BLR-00000-18389",
            "type": {
                "module": "Building",
                "type": "Commercial",
                "value": "Building/Commercial/Electrical/NA",
                "category": "NA",
                "text": "Electrical Commercial",
                "group": "Building",
                "subType": "Electrical",
                "id": "Building-Commercial-Electrical-NA"
            },
            "customId": "BE-201409718",
            "status": {
                "value": "Issued",
                "text": "Issued"
            },
            "createdBy": "PUBLICUSER80438",
            "module": "Building",
            "serviceProviderCode": "ATLANTA_GA",
            "openedDateFrom": "2014-10-30 00:00:00",
            "trackingId": 1433897272146,
            "value": "14BLR-00000-18389"
        }
    ],
    "status": 200,
    "page": {
        "offset": 0,
        "hasmore": true,
        "limit": 1
    }
}
```
