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
const thumbDir = __dirname + '/public/thumbs';
app.use('/static', express.static(__dirname + '/public'));
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

// example of POST with payload and parameters

app.post("/listFiles", (req, res) => {
  request({
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    url: "http://localhost:8080/osc/commands/execute",
    method: "POST",
    json: {
      name: "camera.listFiles",
      parameters: {
        "fileType": "image",
        "entryCount": 2,
        "maxThumbSize": 0        
      }

    }
  }, (error, response, body) => {
    
      const localImageUri = body.results.entries[0].fileUrl;
      const imageUrl = new URL(localImageUri);
      const imagePath =  imageUrl.pathname;
      console.log("first image path = " + imagePath);
      console.log(ipAddress)
    let webPage = JSON.stringify(body, null, 2) ;


      imageUrl.host = ipAddress;
      imageUrl.port = '80';


      res.render('imageList', {
	  webPage: webPage,
	  imageUrl: imageUrl,
	  clientMode: clientMode
      } );

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
		.write(__dirname + '/public/thumbs/' + item, function(err) {
		    if (!err) console.log('wrote thumbnail ' + item);
		});	    
	    }
	});
    });

});

// reduce file size by reducing quality

app.post('/reduce-quality', (req, res) => {

    let thumbArray = [];
    fs.readdir(ricohImageDir, (err, items) => {
	items.forEach ((item) => {
	    if (isImage(item)) {
		thumbArray.push(item);
		gm('/sdcard/DCIM/100RICOH/' + item)
		.quality(30)
		.noProfile()
		.write(__dirname + '/public/gallery/' + item, function(err) {
		    if (!err) console.log('wrote reduced image file size ' + item);
		});	    
	    }
	});
    });

});


app.listen(3000, ()=> {
  console.log("THETA node plug-in running on port 3000");
});


app.post('/show-thumbs', (req, res) => {
    fs.readdir(thumbDir, (err, items) => {
	res.render("thumbList", {thumbs: items});
    });	
});
