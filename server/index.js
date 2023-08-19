const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const DBurl = process.env.DATABASE_URL;

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
const globalChatRoute = require('./routes/globalChatRoute');
const privateChatRoute = require('./routes/privateChatRoute');

app.use('/Backgammon/Users', userRoute);
app.use('/Backgammon/Profiles', profileRoute);
app.use('/Backgammon/Games', gameRoute);
app.use('/Backgammon/GameChat', gameChatRoute);
app.use('/Backgammon/FriendRequests', friendRequestRoute);
app.use('/Backgammon/Notifications', notificationRoute);
app.use('/Backgammon/GlobalChat', globalChatRoute);
app.use('/Backgammon/PrivateChat', privateChatRoute);

const activeProfiles = new Set();

ioServer.on('connection', (socket) => {
    socket.on('profileConnected', (profileId) => {
        activeProfiles.add(profileId);
        socket.profileId = profileId;
        socket.broadcast.emit('profileOnline', profileId);
    });

    socket.on('getOnlineProfiles', () => {
        socket.emit('onlineProfilesList', Array.from(activeProfiles));
    });

    socket.on('sendGlobalMessage', (message) => {
        ioServer.emit('receiveGlobalMessage', message);
    });

    socket.on('disconnect', () => {
        activeProfiles.delete(socket.userId);
        socket.broadcast.emit('profileOffline', socket.profileId);
    });
});


mongoose.connect(DBurl).then(() => {
    console.log("Database is connected!");

    const server = httpServer.listen(process.env.PORT, () => {
        const port = server.address().port;
        console.log('server listening on port: ', port);
    });

}).catch((err) => {
    console.log('Error connecting to the database:', err.message);
})