const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const DBurl = 'mongodb://127.0.0.1:27017/Backgammon';

const app = express();
const httpServer = http.createServer(app);
const ioServer = socketIO(httpServer, {
    cors: {
        origin: ['http://localhost:4200']
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const userRoute = require('./routes/userRoute');
const profileRoute = require('./routes/profileRoute');
const gameRoute = require('./routes/gameRoute');
const gameChatRoute = require('./routes/gameChatRoute');
const friendRequestRoute = require('./routes/friendRequestRoute');
const notificationRoute = require('./routes/notificationRoute');
const publicChatRoute = require('./routes/publicChatRoute');
const privateChatRoute = require('./routes/privateChatRoute');

app.use('/Backgammon/Users', userRoute);
app.use('/Backgammon/Profiles', profileRoute);
app.use('/Backgammon/Games', gameRoute);
app.use('/Backgammon/GameChat', gameChatRoute);
app.use('/Backgammon/FriendRequests', friendRequestRoute);
app.use('/Backgammon/Notifications', notificationRoute);
app.use('/Backgammon/PublicChat', publicChatRoute);
app.use('/Backgammon/PrivateChat', privateChatRoute);

ioServer.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


mongoose.connect(DBurl).then(() => {
    console.log("Database is connected!");

    const server = httpServer.listen(8080, () => {
        const port = server.address().port;
        console.log('server listening on port: ', port);
    });

}).catch((err) => {
    console.log('Error connecting to the database:', err.message);
})