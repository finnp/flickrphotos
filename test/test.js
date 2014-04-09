var config = require('./_config.js');
var assert = require('assert');
var util = require('util');
var flickrphotos = require('../index.js');

var flickr = flickrphotos(config.api_key);

describe('flickrphotos', function() {
  it('should call the callback with array as first argument for a list of ids', function(done) {
    flickr(['13402819794', '13715533304', '13659951344'], function(photo_details) {
      assert(util.isArray(photo_details));
      assert.equal(photo_details.length, 3);
      assert.equal(photo_details[0].author, 'halfrain');
      done();
    });
  });
});