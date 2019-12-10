const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

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
    url: "http://127.0.0.1:8080/osc/commands/execute",
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
    
    let secondImageUri = body.results.entries[1].fileUrl;
    console.log("first image uri = " + secondImageUri);
    let webPage = "<h1>Body of response</h1>" + "<pre>" +
      JSON.stringify(body, null, 2) + "</pre> + <hr>" ;
    webPage = webPage + "<img width='500' src='" + secondImageUri + "'>";
    
    res.send(webPage);
  });
});

app.listen(3000, ()=> {
  console.log("THETA node plug-in running on port 3000");
});