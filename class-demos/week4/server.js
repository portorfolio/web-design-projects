//js file running our server
//imports express library
const express = require('express');

//initializes app as express server
const app = express();

//files wanted on front-end go inside public
app.use(express.static("public"));

//allow us to send and receive json data
app.use(express.urlencoded({ extended: true }));

let guestbookMessages = []
//1st param: url, location data is wanted from; 2nd param: function, action to happen when this route is hit
// app.get('/test',callback)

// function callback(request, response){

// }

app.get('/',(request,response)=>{
    //can only do one type at once 
    response.send('i now set up my / route');
})

app.get('/gb',(request,response)=>{
    response.sendFile('guestbook.html', {root:'./public'})
})

app.post('/sign',(request,response)=>{
    console.log(request.body)
    console.log('sign route hit')
    let guest = request.body.guest
    let message = request.body.message

    guestbookMessages.push({
        person: guest,
        note: message
    })
    // response.send('hi')
    response.redirect('/all-messages');
})

//send response to client
app.get('/all-messages',(request,response)=>{
    response.json({allMessages: guestbookMessages})
})

app.listen(8000, ()=>{
    //writing console.log inside server will show up in terminal
    console.log('server is running');
})