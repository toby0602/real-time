const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('server connection')
    ws.on('message', (message) => {
        const messageString = message.toString(); // 將 Buffer 轉換為字符串
        console.log('接收:', messageString);

        const parsedMessage = JSON.parse(messageString);
        wss.clients.forEach(client => { // 廣播消息給所有連接的客戶端
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(parsedMessage));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});

/*  筆記

    ws:// 非加密 或 wss:// 加密
    
    methods：
    1. send - client發訊息給server
    2. close - 關閉連線

    event：
    1. open - 連接建立時 
    2. message - client收到server的訊息時
    3. error - 通信發生錯誤時
    4. close - 關閉連線時
*/