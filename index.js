const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const ip = require("ip");
const url = require("url");
const ejs = require('ejs');
const fs = require('fs');
const isImage = require('is-image');
const gm = require('gm');
const _ = require('lodash');

const app = express();

const ricohImageDir = "/sdcard/DCIM/100RICOH";
const thumbDir = __dirname + '/media/thumbs';
app.use('/static', express.static(__dirname + '/public'));
app.use('/media', express.static(__dirname + '/media'));
app.use('/100RICOH', express.static(ricohImageDir));

const ipAddress = ip.address();

let clientMode = false;

if (ipAddress == "192.168.1.1") {
    clientMode = false;
} else {
    clientMode = true;
}

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get("/", (req, res)=> {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res)=> {
  request("http://127.0.0.1:8080/osc/info", (error, response, body)=>{
    console.log(response);
    res.send(response);
  });
});

// example of POST with simple payload

app.post("/takePicture", (req, res) => {
  request({
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    url: "http://127.0.0.1:8080/osc/commands/execute",
    method: "POST",
    json: {
      name: "camera.takePicture"
    }
  }, (error, response, body) => {
    console.log(response);
    res.send(response);
  });
});

// example of getting files from underlying OS
// full-size images

app.post("/listFilesCL", (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {

	let imageNames = [];
	items.forEach( (item) => {
	    if (isImage(item)) {
		imageNames.push(item);
	    }
	});
	res.render('fsList', {imageNames: imageNames });
    })

});

app.get("/view/:imageName", (req, res) => {
    const imageName = req.params.imageName;

    res.render("imageDetails", {imageName: imageName});

});

app.post('/create-thumbnails', (req, res) => {

    let thumbArray = [];
    fs.readdir(ricohImageDir, (err, items) => {
	items.forEach ((item) => {
	    if (isImage(item)) {
		thumbArray.push(item);
		gm('/sdcard/DCIM/100RICOH/' + item)
		.resize(200, 100)
		.noProfile()
		.write(__dirname + '/media/thumbs/' + item, function(err) {
		    if (!err) console.log('wrote thumbnail ' + item)
		    else console.log(err);
		});	    
	    }
	});
    });

});

// reduce file size by reducing quality

app.post('/reduce-quality', (req, res) => {

    let imageArray = [];
    fs.readdir(ricohImageDir, (err, items) => {
	items.forEach ((item) => {
	    if (isImage(item)) {
		imageArray.push(item);
		gm('/sdcard/DCIM/100RICOH/' + item)
		.quality(30)
		.noProfile()
		.write(__dirname + '/media/gallery/' + item, function(err) {
		    if (!err) console.log('wrote reduced image file size ' + item);
		});	    
	    }
	});

    });

});

app.post('/show-thumbs', (req, res) => {
    fs.readdir(thumbDir, (err, items) => {
	_.remove(items, (item) => {
	    return !isImage(item);
	});
	res.render("thumbList", {thumbs: items});
    });	
});


app.post('/drawshapes', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {

	const item = items[items.length -1];
	const outputName = 'watermark_' + item;
	
	gm('/sdcard/DCIM/100RICOH/' + item)
	// rounded rectangle x0, y0, x1, y1, wc, hc
	    .drawRectangle(500, 500, 1000, 1000, 100)
	// circle x0, y0, x1, y1
	    .drawEllipse(2000, 500, 300, 300)
	    .stroke("red", 20)
	    .drawLine(2500, 500, 4000, 900)
	    .fill("#888")
	
		.noProfile()
		.write(__dirname + '/media/watermark/' + outputName, function(err) {
		    if (!err) {
			console.log('wrote oil paint ' + outputName)
			res.render("processed", {
			    directory: "watermark/",
			    imageName: outputName
			});
		    }
		    else {
			console.log(err);
			res.render("error", {
			    errror: err
			});
		    }	
		});	    

    });
});


app.post('/paint', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {
	const item = items[items.length -1];
	const outputName = 'oilpaint_' + item;
	gm('/sdcard/DCIM/100RICOH/' + item)
	    .paint(30)
	    .write(__dirname + '/media/paint/' + outputName, function(err) {
		    if (!err) {
			console.log('wrote oil paint ' + outputName)
			res.render("processed", {
			    directory: "paint/",
			    imageName: outputName
			});
		    }
		    else {
			console.log(err);
			res.render("error", {
			    errror: err
			});
		    }		
		
		});	    
    });
});

app.get('/showpaint', (req, res) => {
    fs.readdir(__dirname + '/media/paint/', (err, items) => {
	const item = items[items.length - 1];
	if (!err) {
	    res.render("processed", {
		directory: "paint/",
		imageName: item
	    })
	}
    });
    
});


app.post('/monochrome', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {
	const item = items[items.length -1];
	const outputName = 'monochrome_' + item;
	gm('/sdcard/DCIM/100RICOH/' + item)
	    .monochrome()
		.write(__dirname + '/media/color/' + outputName, function(err) {
		    if (!err) {
			console.log('wrote monochrome ' + outputName)
			res.render("processed", {
			    directory: "color/",
			    imageName: outputName
			});
		    }
		    else {
			console.log(err);
			res.render("error", {
			    errror: err
			});
		    }
		});	    
    });
});

// swirl parameter is the degrees around the center point that the image rotates
app.post('/fingerpaint', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {
	const item = items[items.length -1];
	const outputName = 'fingerpaint_' + item;
	gm('/sdcard/DCIM/100RICOH/' + item)
	    .swirl(180)
		.write(__dirname + '/media/paint/' + outputName, function(err) {
		    if (!err) {
			console.log('wrote fingerpaint ' + outputName)
			res.render("processed", {
			    directory: "paint/",
			    imageName: outputName
			});
		    }
		    else {
			console.log(err);
			res.render("error", {
			    errror: err
			});
		    }
		});	    
    });
});


app.post('/charcoal', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {
	const item = items[items.length -1];
	const outputName = 'charcoal_' + item
	gm('/sdcard/DCIM/100RICOH/' + item)
	    .charcoal(3)
		.write(__dirname + '/media/paint/' + outputName, function(err) {
		    if (!err) {
			console.log('wrote charcoal ' + outputName)
			res.render("processed", {
			    directory: "paint/",
			    imageName: outputName
			});
		    }
		    else {
			console.log(err);
			res.render("error", {
			    errror: err
			});
		    }
		});	    
    });
});

app.post('/negative', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {
	const item = items[items.length -1];
	const outputName = 'negative_' + item
	gm('/sdcard/DCIM/100RICOH/' + item)
	    .negative()
		.write(__dirname + '/media/paint/' + outputName, function(err) {
		    if (!err) {
			console.log('wrote negative ' + outputName)
			res.render("processed", {
			    directory: "paint/",
			    imageName: outputName
			});
		    }
		    else {
			console.log(err);
			res.render("error", {
			    errror: err
			});
		    }
		});

    });
   
});

app.post('/edge', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {
	const item = items[items.length -1];
	const outputName = 'edge_' + item
	gm('/sdcard/DCIM/100RICOH/' + item)
	    .edge(30)
	    .write(__dirname + '/media/paint/' + outputName, function(err) {
		if (!err) {
		    console.log('wrote edge ' + outputName)
		    res.render("processed", {
			directory: "paint/",
			imageName: outputName
			});
		    }
		    else {
			console.log(err);
			res.render("error", {
			    errror: err
			});
		    }
		});	    
    });
});




app.listen(3000, ()=> {
  console.log("THETA node plug-in running on port 3000");
});


