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

app.use(express.json()); // Adjust the limit as needed
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const userRoute = require('./routes/userRoute');
app.use('/Backgammon/Users', userRoute);

ioServer.on('connection', (socket) => {
    console.log('user connected');

    
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