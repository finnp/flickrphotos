var util = require('util');
var Transform = require('stream').Transform;
var async = require('async');
var Flickrphotos = require('./Flickrphotos.js');

var Flickrstream = function(api_key) {
  this.flickr = new Flickrphotos(api_key);
  Transform.call(this, {objectMode: true});
};

util.inherits(Flickrstream, Transform);

Flickrstream.prototype._transform = function(photo_id, encoding, done) {
  var self = this;
  if(photo_id) {
    this.flickr.get(photo_id, function(err, photo_details) {
      self.push(photo_details);
      done();
    });
  } else {
    done();
  }
};

module.exports = Flickrstream;