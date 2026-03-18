const express = require('express')
const multer = require('multer')
const nunjucks = require('nunjucks')
const cookieParser = require('cookie-parser')
const nedb = require('@seald-io/nedb')

const app = express()
const database = new nedb({filename: "data.db", autoload: true})
//set up multer where files will be stored
const uploadProcessor = multer({dest:'static/uploads'})

//use nunjucks inside of our response.render
nunjucks.configure("views",{
    autoescape: true,
    express: app
})

app.set('view engine', 'njk')
app.use(express.static('static'))
app.use(express.urlencoded({extended: true}))

//for every page we want to access, we need a new route
app.get('/',(request, response) =>{

    //if we wanna get everything inside database, we use empty object
    let query = {}
    database.find(query, (err, foundData)=>{
        response.render('index.njk', {dataToBeSent: foundData})
    })
    // response.render('index.njk', {dataToBeSent: "hi"})
})

app.get('/make-a-post',(request, response)=>{
    response.render('make-post.njk')
})

app.post('/post', uploadProcessor.single("uploadedImage"), (request,response)=>{
    console.log(request.body)
    console.log(request.file)

    let dataToBeStored = {
        dataCaption: request.body.caption,
        filePath: "/uploads/" + request.file.filename,
        timestamp: Date.now(),
        date: new Date(Date.now()).toLocaleString(),
    }
    
    console.log(dataToBeStored)
    database.insert(dataToBeStored)

    response.redirect('/make-a-post')
})

app.get('/post/:id',(request,response)=>{
    let query = {
        _id: request.params.id
    }

    database.findOne(query,(err, foundData)=>{
        console.log(foundData)
        response.render('unique.njk', {dataToBeSent: foundData})
    })
})
app.listen(9001, ()=>{
    console.log('server has started')
})