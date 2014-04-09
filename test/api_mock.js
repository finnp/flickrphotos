var nock = require('nock');

module.exports = function() {
  nock('https://api.flickr.com')
    .persist()
    .filteringPath(/photo_id=[^&]+/g, 'photo_id=0')
    .get('/services/rest/?method=flickr.photos.getInfo&api_key=m&photo_id=0&format=json&nojsoncallback=1')
    .reply(200, {
      photo: {
        owner: {
          username: 'halfrain'
        }
      }
    })
    .get('/services/rest/?method=flickr.photos.getSizes&api_key=m&photo_id=0&format=json&nojsoncallback=1')
    .reply(200, {
      sizes: {
        candownload: 1
      }
    });
};
