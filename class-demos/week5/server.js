//last time stored in array, this time in database/file
//1. import libraries to be used
//import express library
const express = require('express')
let nedb = require("@seald-io/nedb")

//import templating library
let nunjucks = require('nunjucks')

//2. initialize library settings
let app = express()

//sets up database variable that we are storing data in an external file
let database = new nedb({ filename: "data.db", autoload: true });

//settings up nunjucks template 
nunjucks.configure("views", { //views holds nunjucks files
  autoescape: true,
  express: app,
});
//express will use the templating engine of nunjucks
app.set('view engine', 'njk')

//3. Middleware: settings for our application
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//3. routes
app.get('/', (request, respond)=>{
    //any database manipulation needs to happen before sending the response
    database.insert({data: "hello"})

    //response needs to go at the very end of the function
    respond.send('<h1>hi</h1>') //pass any string in html format
})

app.get('/data', (request, respond)=>{
    //first param: object looked for, second: callback function/action to happen once data found
    //empty object returns EVERYTHING 
    let query = {}
    database.find(query, (error, foundData)=>{
        //check for error, if found, send 'error', else send data
        if(error){
            respond.send('error')
        } else {
            //send back data in json format
            //format found data in json
            let formattedJSON = {
                allData: foundData,
            }
            respond.json(formattedJSON)
        }
    })
})

app.get('/guestbook', (request,respond)=>{
    //use render function to convert any special .njk data into our client html
    //second param is an object that reps the data that is going to be populated on the client-side
    //serverData = name of variable i will use
    respond.render('guestbook.njk', {serverData: "<h1>hi</hi>"} )
})

app.post('/sign', (request,respond)=>{
    //processing body of requestuest in the format i want it to be displayed as json data
    //this is also how it will be stored in my database
    let guestSignature = {
        guestName: request.body.guest,
        guestMessage: request.body.guestMessage
    }

    //storing data in database
    database.insert(guestSignature)

    //send user back to guestbook
    respond.redirect('/guestbook')
})

app.get('/display-guest-messages', (request, respond)=>{
    let query = {
        guestName: {$exists: true}
    }
    database.find(query, (error, foundData)=>{ //ex: if filtering/querying for diff genres
        if(error){ 
            respond.redirect('/guestbook')
        } else{
            console.log(foundData)
            respond.render('messages.njk', {messages: foundData})
        }
    })
})

//last: start server
app.listen(9001, ()=>{
    console.log("server running")
})