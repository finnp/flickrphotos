var assert = require('assert');
var util = require('util');
var fs = require('fs');
var Flickrphotos = require('../index.js').Flickrphotos;
var Flickrstream = require('../index.js').Flickrstream;

var api_key = process.env.TEST_API_KEY;

// Mock the api if no api_key is available in environment
if(!api_key) {
  console.info("> Running in mock mode");
  require('./api_mock.js')();
  api_key = "m";
} else {
  console.info("> Testing with live flickr api");
}


describe('Flickrphotos', function() {

  var flickr = new Flickrphotos(api_key);

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

  describe('create_stream', function() {

    it('should return a Flickstream with the correct api key', function() {
      var flickrstream = flickr.create_stream();
      assert(flickrstream instanceof Flickrstream);
      assert.equal(flickrstream.flickr.api_key, api_key);
    });
  });
});

describe('Flickrstream', function() {

  it('should take a stream of newline seperated ids and pipe new line seperated json', function(done) {
    var flickrstream = new Flickrstream(api_key);
    photo_details = []
    flickrstream.on('data', function(obj) {
      photo_details.push(obj);
    });
    flickrstream.on('end', function() {
      assert(util.isArray(photo_details));
      assert.equal(photo_details.length, 2);
      assert.equal(photo_details[0].getInfo.photo.owner.username, 'halfrain');
      done();
    });
    flickrstream.write('13402819794');
    flickrstream.write('13715533304');
    flickrstream.end();
  });
});