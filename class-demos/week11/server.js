const express = require('express')
const nunjucks = require('nunjucks')

// imports new libraries
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express()

// initialize variables using new libraries
const httpServer = createServer(app);//create new web socket server
const io = new Server(httpServer); // and link it to express application

app.use(express.static('public')); // A: tells what folder to look in, and allows express to expose those files
app.use(express.urlencoded({ extended: true })); // A: accept all types of input, allows us to use req.body and read data from client
app.set('view engine', 'njk'); // A: allows express to read and use njk as templating tool
nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.get('/', (req,res)=>{
    res.render('index.njk', {numClient: io.engine.clientsCount})
})

// checks if a client has been connected
//any websocket events will go into this connection handler
io.on('connection', (socket) => {
	console.log('a user connected');
    console.log('total users:', io.engine.clientsCount)

    // receiving our custom event called "message"
	socket.on('message', (dataFromClient) => {
		console.log('message: ' + dataFromClient);
        // send data back to client
		io.emit('server sent data', dataFromClient);
	});

    //ex of handling specific event fired from the client
    socket.on('disconnect', ()=>{
        console.log('user disconnected')
    })
});

//replaces app.listen and instead uses http server
httpServer.listen(3000, ()=>{
    console.log('server started port 3000')
})

