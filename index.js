var util = require('util');
var Transform = require('stream').Transform;
var querystring = require('querystring');
var async = require('async');
var request = require('request');

var flickr_api = "https://api.flickr.com/services/rest/";

var Flickrphotos = function(flickr_api_key) {
  this._endpoints = ['getInfo'];

  this.build_url = function(endpoint, photo_id) {
    var request_data = {
        method: 'flickr.photos.' + endpoint,
        api_key: flickr_api_key,
        photo_id: photo_id,
        format: 'json',
        nojsoncallback: 1
    };
    return flickr_api + "?" + querystring.stringify(request_data);
  };
};

Flickrphotos.prototype.get = function(photo_ids, done) {
  if(util.isArray(photo_ids)) {
    async.concat(photo_ids, this.get_photo_details.bind(this), done);
  } else {
    this.get_photo_details(photo_ids, done);
  }
};

Flickrphotos.prototype.use_endpoints = function(endpoints) {
  if(util.isArray(endpoints)) {
    this._endpoints = endpoints;
  } else {
    this._endpoints = Array.prototype.slice.call(arguments);
  }
};

Flickrphotos.prototype.get_photo_details = function(photo_id, done) {
  var photo_details_raw = {};
  var _this = this;
  async.each(this._endpoints, function(endpoint, done_endpoint) {
    var url = _this.build_url(endpoint, photo_id);
    request({url: url, json: true}, function(err, response, body) {
      photo_details_raw[endpoint] = body;
      done_endpoint(err);
    });  
  },
  function(err) {
    done(err, photo_details_raw);
  });  
};


var Flickrstream = function(api_key, options) {
  this.api_key = api_key;
  Transform.call(this, options);
};

util.inherits(Flickrstream, Transform);


Flickrstream.prototype._handle_line = function(photo_id) {
  var flickr = new Flickrphotos(this.api_key);
  var _this = this;
  flickr.get(photo_id, function(err, photo_details) {
    _this.push(JSON.stringify(photo_details));
    _this.push('\n\r');
  });
};

Flickrstream.prototype._transform = function(chunk, encoding, done) {
  var data = chunk.toString();
  if (this._last_data) {
    data = this._last_data + data;
  }
  var lines = data.split('\n');
  this._last_data = lines.pop();

  lines.forEach(this._handle_line.bind(this));
  done();
};

Flickrstream.prototype._flush = function(done) {
  if(this.last_data) {
    this._handle_line(this._last_data);
    this.last_data = null;
  }
};

exports.Flickrphotos = Flickrphotos;
exports.Flickrstream = Flickrstream;
exports.Flickrphotos.prototype.create_stream = new Flickrstream();