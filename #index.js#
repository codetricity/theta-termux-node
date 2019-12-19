const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const ip = require("ip");
const url = require("url");
const ejs = require('ejs');
const fs = require('fs');
const isImage = require('is-image');
const gm = require('gm');

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
	res.render("thumbList", {thumbs: items});
    });	
});


app.post('/drawshapes', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {

	const item = items[items.length -1];
	gm('/sdcard/DCIM/100RICOH/' + item)
	// rounded rectangle x0, y0, x1, y1, wc, hc
	    .drawRectangle(500, 500, 1000, 1000, 100)
	// circle x0, y0, x1, y1
	    .drawEllipse(2000, 500, 300, 300)
	    .stroke("red", 20)
	    .drawLine(2500, 500, 4000, 900)
	    .fill("#888")
	
		.noProfile()
		.write(__dirname + '/media/watermark/' + item, function(err) {
		    if (!err) console.log('wrote watermark ' + item)
		    else console.log(err);
		});	    
    });
});


app.post('/paint', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {
	const item = items[items.length -1];
	gm('/sdcard/DCIM/100RICOH/' + item)
	    .paint(30)
		.write(__dirname + '/media/paint/' + item, function(err) {
		    if (!err) console.log('wrote paint ' + item)
		    else console.log(err);
		});	    
    });
});

app.post('/monochrome', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {
	const item = items[items.length -1];
	gm('/sdcard/DCIM/100RICOH/' + item)
	    .monochrome()
		.write(__dirname + '/media/color/' + item, function(err) {
		    if (!err) console.log('wrote monochrome ' + item)
		    else console.log(err);
		});	    
    });
});

// swirl parameter is the degrees around the center point that the image rotates
app.post('/fingerpaint', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {
	const item = items[items.length -1];
	gm('/sdcard/DCIM/100RICOH/' + item)
	    .swirl(180)
		.write(__dirname + '/media/paint/' + item, function(err) {
		    if (!err) console.log('wrote fingerpaint ' + item)
		    else console.log(err);
		});	    
    });
});


app.post('/charcoal', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {
	const item = items[items.length -1];
	gm('/sdcard/DCIM/100RICOH/' + item)
	    .charcoal(3)
		.write(__dirname + '/media/paint/' + item, function(err) {
		    if (!err) console.log('wrote charcoal ' + item)
		    else console.log(err);
		});	    
    });
});

app.post('/negative', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {
	const item = items[items.length -1];
	gm('/sdcard/DCIM/100RICOH/' + item)
	    .negative()
		.write(__dirname + '/media/paint/' + item, function(err) {
		    if (!err) console.log('wrote negative ' + item)
		    else console.log(err);
		});	    
    });
});

app.post('/edge', (req, res) => {
    fs.readdir(ricohImageDir, (err, items) => {
	const item = items[items.length -1];
	gm('/sdcard/DCIM/100RICOH/' + item)
	    .edge(30)
		.write(__dirname + '/media/paint/' + item, function(err) {
		    if (!err) console.log('wrote edge ' + item)
		    else console.log(err);
		});	    
    });
});




app.listen(3000, ()=> {
  console.log("THETA node plug-in running on port 3000");
});


