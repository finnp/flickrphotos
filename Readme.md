# flickrphotos

Right now this is a simple tool for getting metadata from the flickr API for
photo ids. It allows you to request several photos at once and also different
flickr API endpoints.

You can install it with `npm install flickrphotos`. It also comes with a little
CLI, so you might also install it with the `-g` flag.

## Usage

There is a callback-like `FlickrPhotos` as well as a Transform Stream
`FlickrStream`available.

### FlickrPhotos
This snippets prints the name of the author of the picture.
```javascript
var Flickrphotos = require('flickrphotos').Flickrphotos;
var flickr = new Flickrphotos(api_key);

flickr.get('13402819794', function(err, photo_details) {
	console.log(photo_details.getInfo.photo.owner.username);
});
```

By default only the `getInfo` endpoint is used. However other photo endpoints
that take the `photo_id` as a parameter can also be enabled. For an overview
have a look at the [flickr API documentation](https://www.flickr.com/services/api/#api-photos),
there are probably not many endpoints that match that requirement.
```javascript
flickr.use_endpoints('getInfo', 'getSizes', 'getPerms');

flickr.get('13402819794', function(err, photo_details) {
	console.log(photo_details.getInfo.photo.owner.username);
	console.log(photo_details.getSizes.sizes[0].url);
	console.log(photo_details.getPerms.perms.ispublic);
});
```

It also allows to get information for several photos at once and return the json
data as an unordered array.

```javascript
flickr.get(['13402819794', '13715533304', '13659951344'], handle_photos);
```

You may also create a FlickrStream from this:
```javascript
var flickr_stream = flickr.create_stream();
```

### FlickrStream
There is also a Transform stream in `objectMode` available which reads photo ids and
writes the response objects.
```javascript
var Flickrstream = require('flickrphotos').Flickrstream;
var flickrstream = new Flickrstream(api_key);
flickrstream.write('13402819794');
flickrstream.write('13402819794');
flickrstream.end();
```

If you want to use text streams, I recommend using something like
split and JSONStream like this. This is also what the CLI of this module uses.

```
var split = require('split');
var JSONStream = require('JSONStream');
var Flickrstream = require('flickrphotos').Flickrstream;
var flickrstream = new Flickrstream(api_key);

fs.createWriteStream('photoids.txt')
	.pipe(split())
	.pipe(flickrstream)
	.pipe(JSONStream.stringify())
	.pipe(process.stdout);
```

## Command line usage

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
