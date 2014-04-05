var querystring = require('querystring');
var request = require('request');

var flickr_api = "https://api.flickr.com/services/rest/";

module.exports = function(flickr_api_key) {
  return function(photo_ids, callback) {
    this.flickr_api_key = flickr_api_key;

    photo_ids.forEach(function(photo_id) {
      var request_data = {
        method: 'flickr.photos.getInfo',
        api_key: flickr_api_key,
        photo_id: photo_id,
        format: 'json',
        nojsoncallback: 1
      };
      var url = flickr_api + "?" + querystring.stringify(request_data);
      var queue_size = photo_ids.length;
      var photos = [];
      request({url: url, json: true}, function(error, response, body) {
        queue_size--;
        if(!error && response.statusCode == 200) {
          photos.push(body);
        }
        if(queue_size < 1) {
          callback(photos);
        }
      });
    });
  };
};