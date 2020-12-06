const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { userJoin, checkRoom } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', socket => {
    socket.on('start', () => {
        const me = socket.id;
    
        io.emit('currentId', me);
        
        const { user, canStart } = userJoin(socket.id);

        socket.join(user.room);

        if (canStart)
        {
            io.to(user.room)
                .emit('sysMsg','系統訊息：加密連線完成，開始聊天囉！');
        }
        
        socket.on('inputMsg', (chatMsg) => {
            io.to(user.room)
                .emit('outputMsg', {chatMsg, id:socket.id});
        });

        socket.on('gone', () => socket.disconnect());
        
        socket.on('disconnect', () => {
            checkRoom(user.room);
            io.to(user.room)
                .emit('sysMsg', '對方已離開，因為你太無聊了，去找跟你的人生一樣無聊的人吧');
        });
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));