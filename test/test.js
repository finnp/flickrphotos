var config = require('./_config.js');
var assert = require('assert');
var util = require('util');
var flickrphotos = require('../index.js');

var flickr = flickrphotos(config.api_key);

describe('flickrphotos', function() {
  it('should handle an array of ids', function(done) {
    flickr(['13402819794', '13715533304', '13659951344'], function(err, photo_details) {
      assert(!err);
      assert(util.isArray(photo_details));
      assert.equal(photo_details.length, 3);
      assert.equal(photo_details[0].author, 'halfrain');
      done();
    });
  });
  it('should handle a single id', function(done) {
    flickr('13402819794', function(err, photo_details) {
      assert(!err);
      assert.equal(photo_details.author, 'halfrain');
      done();
    });
  });
});