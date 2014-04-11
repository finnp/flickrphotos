# flickrphotos

Right now this is a simple tool for getting metadata from the flickr API for photo ids. It allows you to request several photos at once and also different flickr API endpoints.

You can install it with `npm install flickrphotos`. You can test the code by running `npm test`.

## Examples

This snippets prints the name of the author of the picture.
```javascript
var Flickrphotos = require('flickrphotos').Flickrphotos;
var flickr = new Flickrphotos(api_key);

flickr.get('13402819794', function(err, photo_details) {
	console.log(photo_details.getInfo.photo.owner.username);
});
```

By default only the `getInfo` endpoint is used. However other photo endpoints that take the `photo_id` as a parameter can also be enabled. For an overview have a look at the [flickr API documentation](https://www.flickr.com/services/api/#api-photos), there are probably not many endpoints that match that requirement.
```javascript
flickr.use_endpoints('getInfo', 'getSizes', `getPerms);

flickr.get('13402819794', function(err, photo_details) {
	console.log(photo_details.getInfo.photo.owner.username);
	console.log(photo_details.getSizes.sizes[0].url);
	console.log(photo_details.getPerms.perms.ispublic);
});
```

It also allows to get information for several photos at once and return the json data as an unordered array.

```javascript
flickr.get(['13402819794', '13715533304', '13659951344'], handle_photos);
```