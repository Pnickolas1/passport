// Require dependencies
var express = require('express');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var db = require('./models');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//creating instance of database for User table
var User = db.User;


// Server setup variables
var app = express();
var PORT = process.env.PORT || 8000;


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(bodyParser());
app.use(require('connect-multiparty')());
app.use(cookieParser());
app.use(session({ secret: 'super-secret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	if(req.user){
		console.log(req.user);
	}
	next();
});


// Define handlesbars engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// Set handlebars engine
app.set('view engine', 'handlebars');

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + '/public'));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Require the routes set in burger_controller.js
require('./controllers/passport.js')(app); // Enter controller name(s) in blank. create more as needed



// Static directory
app.use(express.static("/public"));




// Syncing our sequelize models and then starting our express app
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
}).catch(function(err) {
    console.log(err);
});
