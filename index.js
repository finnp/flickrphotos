var util = require('util');
var querystring = require('querystring');
var async = require('async');
var request = require('request');

var flickr_api = "https://api.flickr.com/services/rest/";

module.exports = function(flickr_api_key) {
  var _endpoints = ['getInfo'];

  var build_url = function(endpoint, photo_id) {
    var request_data = {
        method: 'flickr.photos.' + endpoint,
        api_key: flickr_api_key,
        photo_id: photo_id,
        format: 'json',
        nojsoncallback: 1
    }
    return flickr_api + "?" + querystring.stringify(request_data);
  };

  this.get_photo_details = function(photo_id, done) {
    var photo_details_raw = {};
    async.each(_endpoints, function(endpoint, done_endpoint) {
      var url = build_url(endpoint, photo_id);
      request({url: url, json: true}, function(err, response, body) {
        photo_details_raw[endpoint] = body;
        done_endpoint(err);
      });  
    },
    function(err) {
      done(err, photo_details_raw);
    });  
  };

  this.use_endpoints = function(endpoints) {
    if(util.isArray(endpoints)) {
      _endpoints = endpoints;
    } else {
      _endpoints = Array.prototype.slice.call(arguments);
    }
  };

  this.get = function(photo_ids, done) {
    if(util.isArray(photo_ids)) {
      async.concat(photo_ids, this.get_photo_details, done);
    } else {
      this.get_photo_details(photo_ids, done)
    }
  };
};