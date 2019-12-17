const fs = require('fs');
const gm = require('gm');

gm('./z1-original.JPG').resize(200, 100).noProfile().write('./thumbnail.png', function (err) {
    if (!err) console.log('done');
});
