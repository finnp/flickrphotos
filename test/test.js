var assert = require('assert');
var util = require('util');
var Flickrphotos = require('../index.js').Flickrphotos;

var api_key = process.env.TEST_API_KEY;

// Mock the api if no api_key is available in environment
if(!api_key) {
  console.info("> Running in mock mode");
  require('./api_mock.js')();
  api_key = "m";
} else {
  console.info("> Testing with live flickr api");
}

var flickr = new Flickrphotos(api_key);

describe('flickrphotos', function() {

  it('should handle an array of ids', function(done) {
    flickr.get(['13402819794', '13715533304', '13659951344'], function(err, photo_details) {
      assert(!err);
      assert(util.isArray(photo_details));
      assert.equal(photo_details.length, 3);
      assert.equal(photo_details[0].getInfo.photo.owner.username, 'halfrain');
      done();
    });
  });

  it('should handle a single id', function(done) {
    flickr.get('13402819794', function(err, photo_details) {
      assert(!err);
      assert.equal(photo_details.getInfo.photo.owner.username, 'halfrain');
      done();
    });
  });
});

describe('set_endpoints', function() {

  it('should set the used endpoints for the upcoming calls', function(done) {
    flickr.use_endpoints('getInfo', 'getSizes');
    flickr.get('13402819794', function(err, photo_details) {
      assert(!err);
      assert.equal(photo_details.getInfo.photo.owner.username, 'halfrain');
      assert.equal(photo_details.getSizes.sizes.candownload, 1);
      done();
    });
    // cleanup
    flickr.use_endpoints('getInfo');
  });
});