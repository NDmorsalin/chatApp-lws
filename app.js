// external Dependency
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
// internal dependency
const { notFound, defaultError } = require('./middleware/common/errorhandler');
const loginRoute = require('./route/loginRoute');
const userRoute = require('./route/userRoute');
const inboxRoute = require('./route/inboxRoute');

// app obj
const app = express();
const server = http.createServer(app);
const io = new Server(server);

global.io = io;
// process .env file
dotenv.config();

// database mongoose  connection
mongoose
    .connect(process.env.MONGOOSE_CONNECTION_STRING, {})
    .then(() => {
        console.log('data base connection successfully');
    })
    .catch((err) => {
        console.log(err);
    });

// request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// setup view engine
app.set('view engine', 'ejs');

// public static folder
app.use(express.static(path.join(__dirname, 'public')));

// route setup
app.use('/inbox', inboxRoute);
app.use('/user', userRoute);
app.use('/', loginRoute);

// error setup
// not found page
app.use(notFound);
// other error
app.use(defaultError);

// express connection
server.listen(process.env.PORT, () => {
    console.log(`chat app is running on prot ${process.env.PORT}`);
});
