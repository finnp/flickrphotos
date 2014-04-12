var util = require('util');
var Transform = require('stream').Transform;
var async = require('async');
var Flickrphotos = require('./Flickrphotos.js');

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
  if(this._last_data) {
    this._handle_line(this._last_data, function() {
      _this.push('\n]\n');
      done();
    });
    this._last_data = null;
  } else {
    _this.push('\n]\n');
    done();
  }
};

module.exports = Flickrstream;