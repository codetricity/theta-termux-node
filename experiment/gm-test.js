const fs = require('fs');
const gm = require('gm');

gm('/sdcard/DCIM/100RICOH/R0010097.JPG').resize(200, 100).noProfile().write('./thumbnail.png', function (err) {
    if (!err) console.log('done');
});
