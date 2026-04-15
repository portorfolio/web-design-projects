// how do we know this is a npm project?
// A: bc it has a package.json

// what command do we run to start an npm project?
// A: npm init (optional -y)

// how do we create the node_modules folder if it doesn't exist?
// A: npm install

// what does the below chunk of code do?
// A: imports and initializes libraries used in code
const express = require('express');
const multer = require('multer');
const nunjucks = require('nunjucks');
const nedb = require('@seald-io/nedb');

// what is app?
// A: creates web server that uses express
const app = express();
// what is database?
// A: a variable making a new database using nedb (.db file) where data is separately stored
const database = new nedb({ filename: 'data.db', autoload: true });

// what is this configuring?
// A: creates folder where media will be uploaded to when input into database.
const upload = multer({
	dest: 'public/uploads',
});

// what do each of these statements do?
// write the answer next to the line of code
app.use(express.static('public')); // A: tells what folder to look in, and allows express to expose those files
app.use(express.urlencoded({ extended: true })); // A: accept all types of input, allows us to use req.body and read data from client
app.set('view engine', 'njk'); // A: allows express to read and use njk as templating tool
nunjucks.configure('views', {
	autoescape: true,
	express: app,
}); // A: setting views folder as where njk files are stored and links it to app

// what type of request is this? what does it do?
// A: a get request, sets action for when this route is hit
app.get('/', (request, response) => {
	// how many different responses can we write? list them.
	// A: render, send, json, redirect, sendFile
	// how many parameters does response.render use? list them.
	// A: two: filename, optional: information requested
	// write out the render for index.njk using the database
	database.find({}, (err, foundData) => {
		response.render('index.njk', { serverData: foundData });
	}
)
});

// what are the three parameters in this function?
// A: route, looking for one image uploaded, callback
app.post('/upload', upload.single('theimage'), (req, res) => {
	let currentDate = new Date();

	// what type of data structure is this?
	// A: object
	let data = {
		dataCaption: req.body.text,
		date: currentDate.toLocaleString(),
		timestamp: currentDate.getTime(),
	};

	// why do we write this if statement?
	// A: to check if file is actually uploaded/exists
	if (req.file) {
		data.image = '/uploads/' + req.file.filename;
	}

	// what does the insert function do?
	// A: puts data in database
	database.insert(data);

	res.redirect('/');
});

// what does the number signify?
// A: port number
// how do we access this on the web?
// A: http://localhost:insertnumber
app.listen(6001, () => {
	console.log('server started on port 6001');
});

// continue answering the questions in the index.njk
