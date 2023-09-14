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
const gameInvitationRoute = require('./routes/gameInvitationRoute');

app.use('/Backgammon/Users', userRoute);
app.use('/Backgammon/Profiles', profileRoute);
app.use('/Backgammon/Games', gameRoute);
app.use('/Backgammon/GameChat', gameChatRoute);
app.use('/Backgammon/FriendRequests', friendRequestRoute);
app.use('/Backgammon/Notifications', notificationRoute);
app.use('/Backgammon/GlobalChat', globalChatRoute);
app.use('/Backgammon/PrivateChat', privateChatRoute);
app.use('/Backgammon/GameInvitation', gameInvitationRoute);

const activeProfiles = new Set();
const activeGames = new Map();

ioServer.on('connection', (socket) => {
    socket.on('profileConnected', (profileId) => {
        activeProfiles.add(profileId);
        socket.profileId = profileId;
        socket.join(profileId);
        socket.broadcast.emit('profileOnline', profileId);
    });

    socket.on('getOnlineProfiles', () => {
        socket.emit('onlineProfilesList', Array.from(activeProfiles));
    });

    socket.on('sendGlobalMessage', (message) => {
        ioServer.emit('receiveGlobalMessage', message);
    });

    socket.on('sendFriendRequest', (data) => {
        ioServer.to(data.recipient).emit('receiveFriendRequest', data);
    });
    
    socket.on('acceptFriendRequest', (data) => {
        ioServer.to(data.sender).emit('friendRequestAccepted', data);
    });

    socket.on('rejectFriendRequest', (data) => {
        ioServer.to(data.sender).emit('friendRequestRejected', data);
    });

    socket.on('friendRemove', ({profileId, friendId}) => {
        ioServer.to(profileId).emit('friendRemoved', friendId);
    });

    socket.on('joinChat', ({chatId, profileId}) => {
        console.log(`profile ${profileId} joined chat ${chatId}`);
        socket.join(chatId);
        ioServer.to(chatId).emit('profileJoinedChat', profileId);
    });

    socket.on('leaveChat', ({chatId, profileId}) =>{
        console.log(`profile ${profileId} left chat ${chatId}`);
        socket.leave(chatId);
        ioServer.to(chatId).emit('profileLeftChat', profileId);
    });

    socket.on('sendPrivateMessage', ({chatId, message}) =>{
        ioServer.to(chatId).emit('receivePrivateMessage', message);
    });

    socket.on('sendNotification', ({profileId, notification}) =>{
        ioServer.to(profileId).emit('recievedNotification', notification);
    });

    socket.on('markNotification', ({profileId, notification}) =>{
        ioServer.to(profileId).emit('notificationMarked', notification);
    });

    socket.on('deleteNotification', ({profileId, notification}) =>{
        ioServer.to(profileId).emit('notificationDeleted', notification);
    });

    socket.on('sendGameInvitation', (invitation) => {
        ioServer.to(invitation.recipient).emit('recievedGameInvitation', invitation);
    });

    socket.on('acceptGameInvitation', (invitation) => {
        ioServer.to(invitation.sender).emit('gameInvitationAccepted', invitation);
    });

    socket.on('rejectGameInvitation', (invitation) => {
        ioServer.to(invitation.sender).emit('gameInvitationRejected', invitation);
    });

    socket.on('createGame', (gameId) => {
        
    });

    socket.on('move', (gameState) => {
        ioServer.emit('onMove', gameState)
    });

    socket.on('joinGame', (gameId) => {
        socket.join(gameId);
        ioServer.to(gameId).emit('joinedGame', gameId);
    });

    socket.on('disconnect', () => {
        socket.leave(socket.profileId);
        activeProfiles.delete(socket.profileId);
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