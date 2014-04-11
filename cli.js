#!/usr/bin/env node

var Flickrphotos = require('./index.js').Flickrphotos;
var program = require('commander');

program
  .version('0.0.2')
  .usage('[options] <photoids ...>')
  .option('-k, --key [flickrkey]', 'A flickr api key for the request')
  .option('-c, --compact', 'Prints the JSON non-formatted')
  .parse(process.argv);

if (program.key) {
  var flickr = new Flickrphotos(program.key);

  flickr.get(program.args, function(err, photo_details) {
    var indentation = program.compact ? 0 : 2;
    console.log(JSON.stringify(photo_details, null, indentation));
  });
} else {
  console.error("You need to specify a flickr api key via -k.");
}


