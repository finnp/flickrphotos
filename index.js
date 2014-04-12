var util = require('util');
var Transform = require('stream').Transform;
var querystring = require('querystring');
var async = require('async');
var request = require('request');

var flickr_api = "https://api.flickr.com/services/rest/";

var Flickrphotos = function(flickr_api_key) {
  this._endpoints = ['getInfo'];
  this.api_key = flickr_api_key;

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
  this.push('[\n');
  this.first_line = true;
};

util.inherits(Flickrstream, Transform);


Flickrstream.prototype._handle_line = function(photo_id, done) {
  var flickr = new Flickrphotos(this.api_key);
  var _this = this;
  flickr.get(photo_id, function(err, photo_details) {
    if(!_this.first_line) {
      _this.push(',\n');
    }
    _this.first_line = false;
    _this.push('  ');
    _this.push(JSON.stringify(photo_details));
    if (done) done();
  });
};

Flickrstream.prototype._transform = function(chunk, encoding, done) {
  var data = chunk.toString();
  if (this._last_data) {
    data = this._last_data + data;
  }
  var lines = data.split('\n');
  this._last_data = lines.pop();

  var _this = this;
  async.each(lines, function(photo_id, done) {
    _this._handle_line(photo_id, done);
  }, done);

};

Flickrstream.prototype._flush = function(done) {
  var _this = this;
  if(this.last_data) {
    this._handle_line(this._last_data, function() {
      _this.push('\n]\n');
      done();
    });
    this.last_data = null;
  } else {
    _this.push('\n]\n');
    done();
  }
};

Flickrphotos.prototype.create_stream = function() {
  return new Flickrstream(this.api_key);
};

exports.Flickrphotos = Flickrphotos;
exports.Flickrstream = Flickrstream;