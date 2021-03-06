# flickrphotos
[![Build Status](https://travis-ci.org/finnp/flickrphotos.svg?branch=master)](https://travis-ci.org/finnp/flickrphotos)

Right now this is a simple tool for getting metadata from the flickr API for
photo ids. It allows you to request several photos at once and also different
flickr API endpoints.

You can install it with `npm install flickrphotos`. It also comes with a little
CLI, so you might also install it with the `-g` flag.

**Note:** If you use this somewhere, make sure to add the exact version number in your
`package.json` since I might radically change the API of this module in the future.

## Usage

Flickrphotos provides a [Transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform)
as well as the possibility to get photo information through a callback.

### Get with callback
This snippets prints the name of the author of the picture.
```javascript
var Flickrphotos = require('flickrphotos');
var flickr = new Flickrphotos(api_key);

flickr.get('13402819794', function(err, photoDetails) {
	console.log(photoDetails.getInfo.photo.owner.username);
});
```

By default only the `getInfo` endpoint is used. However other photo endpoints
that take the `photo_id` as a parameter can also be enabled. For an overview
have a look at the [flickr API documentation](https://www.flickr.com/services/api/#api-photos),
there are probably not many endpoints that match that requirement.
```javascript
flickr.useEndpoints('getInfo', 'getSizes', 'getPerms');

flickr.get('13402819794', function(err, photoDetails) {
	console.log(photoDetails.getInfo.photo.owner.username);
	console.log(photoDetails.getSizes.sizes[0].url);
	console.log(photoDetails.getPerms.perms.ispublic);
});
```

It also allows to get information for several photos at once and return the json
data as an unordered array.

```javascript
flickr.get(['13402819794', '13715533304', '13659951344'], handlePhotos);
```

### Transform stream

Flickrphotos is also a Transform stream in `objectMode`, which reads photo ids and
writes the response objects.
```javascript
var Flickrphotos = require('flickrphotos');
var flickr = new Flickrphotos(apiKey);
flickr.write('13402819794');
flickr.write('13402819794');
flickr.end();
```

If you want to use text streams, I recommend using something like
[split](https://www.npmjs.org/package/split) and JSONStream like this. This is also what the CLI of this module uses.

```
var split = require('split');
var JSONStream = require('JSONStream');
var Flickrphotos = require('flickrphotos');
var flickr = new Flickrphotos(apiKey);

fs.createWriteStream('photoids.txt')
	.pipe(split())
	.pipe(flickr)
	.pipe(JSONStream.stringify())
	.pipe(process.stdout);
```

### Command line interface

If you install the package with the `-g` flag or link it, you may use the
`flickrphotos` command by specifying the flickr api key and the photoids.
The result will be an array of photo meta data for each photo.

```
flickrphotos -k <flickr-api-key> 13402819794 13715533304 > imagedata.json
```
You can also pipe photo ids seperated by newlines into the command.

```
photoids.txt > flickrphotos -k <flickr-api-key> > photodata.json
```


To get more information about the options of this command, have a look at
```
flickrphotos -h
```
