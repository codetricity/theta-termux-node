//jshint esversion:6

const fs = require('fs');
const gm = require('gm');

gm('./original-v.jpg')
    .fontSize(200)
    .drawText(1000, 800, 
        "theta360.guide        theta360.guide        theta360.guide" )
    .drawText(1000, 1600, 
        "theta360.guide        theta360.guide        theta360.guide" )
    .drawText(1000, 2400, 
        "theta360.guide        theta360.guide        theta360.guide" )    
    .write('./textOverlay.jpg', function (err) {
        if (!err) console.log('done');
    });
