#!/usr/bin/env node

var program = require('commander');
var split = require('split');
var Flickrphotos = require('./index.js').Flickrphotos;
var Flickrstream = require('./index.js').Flickrstream;
var version = require('./package.json').version;
var JSONStream = require('JSONStream');

program
  .version(version)
  .usage('[options] -k <flickrkey> <photoids ...>')
  .option('-k, --key <flickrkey>', 'A flickr api key for the request (required)')
  .option('-c, --compact', 'Prints the JSON non-formatted')
  .parse(process.argv);

if (!program.key) program.help();

if(program.args.length === 0) {
  var flickr_stream = new Flickrstream(program.key);
  var to_json = JSONStream.stringify();
  process.stdin
    .pipe(split())
    .pipe(flickr_stream)
    .pipe(to_json)
    .pipe(process.stdout);
} else {
  var flickr = new Flickrphotos(program.key);

  flickr.get(program.args, function(err, photo_details) {
    var indentation = program.compact ? 0 : 2;
    console.log(JSON.stringify(photo_details, null, indentation));
  });
}