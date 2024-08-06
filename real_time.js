const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// 創建 HTTP 服務器
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 設置靜態文件夾
app.use(express.static('public'));

// 根路徑路由處理
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/Real_time_by_angular.html');
});



// Socket.IO 連接處理
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

// 服務器監聽端口
server.listen(3030, () => {
    console.log('listening on *:3030');
});