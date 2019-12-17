//jshint esversion: 6

// const fs = require('fs');
const gm = require('gm');

gm('./z1-original.JPG').monochrome().write('./monochrome.JPG', function (err) {
    if (!err) console.log('done');
});
