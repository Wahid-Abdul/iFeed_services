var express = require('express');
var router = express.Router();
var geocoder = require('geocoder');
var Food = require('../database/food.js');
var Zipped = require('../database/zipped.js');

var GeoFire = require('geofire');
var db = require('./firebase.js');
var ref = db.ref("geoLoc");
var geoFire = new GeoFire(ref);
var geoFire = new GeoFire(ref);

function displayPostcode(address) {
  console.log("dp called");
  console.log(address);
  for (p = address.length-1; p >= 0; p--) {
    if (address[p].types.indexOf("postal_code") != -1) {
       console.log(address[p].long_name);
       return address[p].long_name;
    }
  }
}

router.post('/',function(req,res){

  // Reverse Geocoding
  geocoder.reverseGeocode( req.body.latitude, req.body.longitude, function ( err, data ) {
    // do something with data
    //console.log(data.results[0]);
    var addr = data.results[0].formatted_address;
    var result;
    var food = Food();

    food.quantity = req.body.quantity;
    food.latitude = req.body.latitude;
    food.longitude = req.body.longitude;
    food.name = req.body.name;
    food.uid = req.body.uid;
    food.time = req.body.time;
    food.address = addr;
    food.save(function(err,data1){
    if(err){
      console.log(err);
    }
    console.log(data1);
    result = data1;
    geoFire.set(""+data1._id, [parseFloat(food.latitude),parseFloat(food.longitude)]).then(function() {
     console.log("Provided key has been added to GeoFire");
    }, function(error) {
      console.log("Error: " + error);
    });
    });
  });
  console.log(req.body);
});

/*
  Exporting the postFeed route
*/
module.exports = router;
