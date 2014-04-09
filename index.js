var querystring = require('querystring');
var async = require('async');
var request = require('request');

var flickr_api = "https://api.flickr.com/services/rest/";

module.exports = function(flickr_api_key) {

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

  var clean_data = function(photo_details) {
    return {
      author: photo_details.getInfo.photo.owner.username,
      sizes: photo_details.getSizes.sizes.size
    }
  };

  return function(photo_ids, done_all) {
    this.flickr_api_key = flickr_api_key;

    async.concat(photo_ids, function(photo_id, done_photo) {
      var endpoints = ['getInfo', 'getSizes'];
      var photo_details_raw = {};
      async.each(endpoints, function(endpoint, done_endpoint) {
        var url = build_url(endpoint, photo_id);
        request({url: url, json: true}, function(err, response, body) {
          photo_details_raw[endpoint] = body;
          done_endpoint(err);
        });  
      },
      function(err) {
        done_photo(err, clean_data(photo_details_raw));
      });  
    },
    function(err, photos_details) {
      done_all(photos_details);
    });
  };
};