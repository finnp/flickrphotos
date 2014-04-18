/*global describe, it, before, beforeEach, after, afterEach */
var assert = require('assert');
var util = require('util');
var fs = require('fs');
var Flickrphotos = require('../index.js');

var apiKey = process.env.TEST_API_KEY;

// Mock the api if no api_key is available in environment
if(!apiKey) {
  console.info('> Running in mock mode');
  require('./api_mock.js')();
  apiKey = 'm';
} else {
  console.info('> Testing with live flickr api');
}

describe('Flickrphotos', function() {

  var flickr = new Flickrphotos(apiKey);

  describe('get', function() {
    it('should handle an array of ids', function(done) {
      var imageIds = ['13402819794', '13715533304', '13659951344'];
      flickr.get(imageIds, function(err, photoDetails) {
        assert(!err);
        assert(util.isArray(photoDetails));
        assert.equal(photoDetails.length, 3);
        assert.equal(photoDetails[0].getInfo.photo.owner.username, 'halfrain');
        done();
      });
    });
    it('should handle a single id', function(done) {
      flickr.get('13402819794', function(err, photoDetails) {
        assert(!err);
        assert.equal(photoDetails.getInfo.photo.owner.username, 'halfrain');
        done();
      });
    });
  });

  describe('setEndpoints', function() {

    it('should set the used endpoints for the upcoming calls', function(done) {
      flickr.useEndpoints('getInfo', 'getSizes');
      flickr.get('13402819794', function(err, photoDetails) {
        assert(!err);
        assert.equal(photoDetails.getInfo.photo.owner.username, 'halfrain');
        assert.equal(photoDetails.getSizes.sizes.candownload, 1);
        done();
      });
      // cleanup
      flickr.useEndpoints('getInfo');
    });
  });

  describe('stream',function() {
    it('should reads ids and write objects with the details', function(done) {
      var flickrstream = new Flickrphotos(apiKey);
      var photoDetails = [];
      flickrstream.on('data', function(obj) {
        photoDetails.push(obj);
      });
      flickrstream.on('end', function() {
        assert(util.isArray(photoDetails));
        assert.equal(photoDetails.length, 2);
        assert.equal(photoDetails[0].getInfo.photo.owner.username, 'halfrain');
        done();
      });
      flickrstream.write('13402819794');
      flickrstream.write('13715533304');
      flickrstream.end();
    });
  });
});
