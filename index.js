const express = require('express');
const exphbs  = require('express-handlebars');
const request = require('request');
const path = require('path');
const bodyparser = require('body-parser')
const PORT = process.env.PORT || 5000;

const app = express();


// User body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));

// API Token: pk_f2631b6f06d54b13b7f0caf99d23bd8a
function call_api(finishedAPI, ticker) {
  request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_f2631b6f06d54b13b7f0caf99d23bd8a', { json: true }, (err, res, body) => {
    if (err) {
      console.log(err);
    }

    if (res.statusCode === 200) {
      finishedAPI(body);
    }
  });
}

// Set handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Set handlebar index GET route
app.get('/', function (req, res) {
  call_api(function(doneAPI) {
    res.render('home', {
      stock: doneAPI
    });
  }, "fb");
});

// Set handlebar index POST route
app.post('/', function (req, res) {
  call_api(function(doneAPI) {
    res.render('home', {
      stock: doneAPI,
    });
  }, req.body.stock_ticker);
});

// Create about page route
app.get('/about.html', function (req, res) {
    res.render('about');
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Server listening on port ' + PORT));
