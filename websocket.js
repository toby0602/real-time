// 引入模組
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// 設置 HTTP 伺服器和 WebSocket 伺服器
const port = 8082;
const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? '/websocket.html' : req.url);
  const extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'application/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
    case '.mp4':
      contentType = 'video/mp4';
      break;
    case '.woff':
      contentType = 'application/font-woff';
      break;
    case '.ttf':
      contentType = 'application/font-ttf';
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf8');
        });
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('新用戶連接');
  
  ws.on('message', (message) => {
    console.log(`接收到的訊息: ${message}`);
    ws.send(`你發送的訊息是: ${message}`);
  });

  ws.on('close', () => {
    console.log('用戶斷開連接');
  });
});

server.listen(port, () => {
  console.log(`伺服器運行於 http://localhost:${port}`);
});
