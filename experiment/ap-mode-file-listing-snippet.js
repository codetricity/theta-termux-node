
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
