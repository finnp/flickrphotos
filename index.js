var util = require('util');
var Transform = require('stream').Transform;
var querystring = require('querystring');
var async = require('async');
var request = require('request');

var flickrApi = 'https://api.flickr.com/services/rest/';

var Flickrphotos = function(flickrApiKey) {
  Transform.call(this, {objectMode: true});
  this._endpoints = ['getInfo'];
  this.apiKey = flickrApiKey;
};
util.inherits(Flickrphotos, Transform);

Flickrphotos.prototype.get = function(photoIds, done) {
  if(util.isArray(photoIds)) {
    async.concat(photoIds, this.getPhotoDetails.bind(this), done);
  } else {
    this.getPhotoDetails(photoIds, done);
  }
};

Flickrphotos.prototype.buildURL = function(endpoint, photoId) {
  var requestData = {
      method: 'flickr.photos.' + endpoint,
      api_key: this.apiKey, // jshint ignore:line
      photo_id: photoId, // jshint ignore:line
      format: 'json',
      nojsoncallback: 1
  };
  return flickrApi + '?' + querystring.stringify(requestData);
};

Flickrphotos.prototype.useEndpoints = function(endpoints) {
  if(util.isArray(endpoints)) {
    this._endpoints = endpoints;
  } else {
    this._endpoints = Array.prototype.slice.call(arguments);
  }
};

Flickrphotos.prototype.getPhotoDetails = function(photoId, done) {
  var photoDetailsRaw = {};
  var _this = this;
  async.each(this._endpoints, function(endpoint, doneEndpoint) {
    var url = _this.buildURL(endpoint, photoId);
    request({url: url, json: true}, function(err, response, body) {
      photoDetailsRaw[endpoint] = body;
      doneEndpoint(err);
    });  
  },
  function(err) {
    done(err, photoDetailsRaw);
  });  
};

Flickrphotos.prototype._transform = function(photoId, encoding, done) {
  var self = this;
  if(photoId) {
    this.get(photoId, function(err, photoDetails) {
      self.push(photoDetails);
      done();
    });
  } else {
    done();
  }
};

exports = module.exports = Flickrphotos;