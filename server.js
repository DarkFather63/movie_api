const http = require('http');
  fs = require('fs');
  url = require('url');

http.createServer((request, response) => {
  let addr = request.url,
  q = url.parse(addr, true),
  filepath = '';

  fs.appendFile('log.text', 'URL:' + addr + '\n Timestamp' + new Date() + '\n\n', (err) => {
    if (err){
      console.log(err);
    } else {
      console.log('Added to log');
    }
  });

  if (q.pathname.includs('documentation')){
    filepath = (__dirname + '/documentation.html');
  } else {
    filepath = 'index.html';
  }

  fs.readFile(filepath, (err, data) => {
    if (err){
      throw err;
    }
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(data);
    response.end();
  })
}).listen(8080);

console.log('My first Node test server is running on port 8080.');
