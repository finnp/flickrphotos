#!/usr/bin/env node

var Flickrphotos = require('./index.js').Flickrphotos;
var Flickrstream = require('./index.js').Flickrstream;
var program = require('commander');

program
  .version('0.0.2')
  .usage('[options] -k <flickrkey> <photoids ...>')
  .option('-k, --key <flickrkey>', 'A flickr api key for the request (required)')
  .option('-c, --compact', 'Prints the JSON non-formatted')
  .parse(process.argv);

if (!program.key) program.help();

if(program.args.length === 0) {
  var flickr_stream = new Flickrstream(program.key);
  process.stdin.pipe(flickr_stream).pipe(process.stdout);
} else {
  var flickr = new Flickrphotos(program.key);

  flickr.get(program.args, function(err, photo_details) {
    var indentation = program.compact ? 0 : 2;
    console.log(JSON.stringify(photo_details, null, indentation));
  });
}

