const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

// define of dataBase
const db = require('./config/dataBase')

// Test if connected to dataBase
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Error:' + err))

const app = express();

//Body parser
// app.use(bodyParser.urlencoded({ extended: false}));

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Set staticfolder
//app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Create basic tables in dataBase
var createDB = require('./models/index');
createDB();

// Index Route
// app.get('/', (req, res) => res.render('hello', { layout: 'main' }));

// dataBase routes
app.use('/', require('./routes/users'));

//TEST
// app.get('/', (req, res) => res.render('login', { layout: 'main' }));

// Set up http web
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server is listening on ${PORT}`));

