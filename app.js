var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var hbs = require('hbs');

var homeController = require('./controllers/home');
var accountController = require('./controllers/account');
var contactUsController = require('./controllers/contact-us');
var eventController = require('./controllers/event');
var galleryController = require('./controllers/gallery');
var ourCultureController = require('./controllers/our-culture');
var whatWeBelieveController = require('./controllers/what-we-believe');
var whoWeAreController = require('./controllers/who-we-are');

var app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'));
var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});


app.use('/', homeController);
app.use('/account', accountController);
app.use('/contact-us', contactUsController);
app.use('/event',eventController);
app.use('/gallery', galleryController);
app.use('/our-culture', ourCultureController);
app.use('/what-we-believe', whatWeBelieveController);
app.use('/who-we-are', whoWeAreController);


// catch 404
app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
