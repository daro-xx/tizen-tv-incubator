// attaching modules
var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var port = 80;

// runnig server
http.createServer(function(request, response) {
  var uri = url.parse(request.url, true);
  var pathname = uri.pathname;
  var filename;

  console.log("Processing request: %s", pathname);
  if (pathname === "/preview.json") {
    fs.readFile('./preview.json', function(err, data) {
      const json = JSON.parse(data),
        host = request.headers.host;
  
      if(err) {        
        response.writeHead(500, {"Content-Type": "application/json"});
        response.write(err + "\n");
        response.end();
        return;
      }

      json.sections.map((section) => {
        section.tiles.map((tile) => {
          tile.image_url = `http://${host}/${tile.image_url}`;
          return tile;
        })
        return section;
      });

      response.writeHead(200);
      response.write(JSON.stringify(json));
      response.end();
    });
  } else {
    // Static part: serving videos, thumbnails and images for application
    filename = path.join(process.cwd(), pathname);

    fs.exists(filename, function(exists) {
      if(!exists || fs.statSync(filename).isDirectory()) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      fs.readFile(filename, "binary", function(err, file) {
        if(err) {        
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }

        response.writeHead(200);
        response.write(file, "binary");
        response.end();
      });
    });
  };
}).listen(port);

console.log("Server is running at port %s", port);