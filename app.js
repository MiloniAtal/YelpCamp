var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/user"),
	campgroundRoute = require("./routes/campgrounds.js"),
	commentsRoute = require("./routes/comments.js"),
	indexRoute = require("./routes/index.js"),
	flash = require("connect-flash"),
	methodOverride = require("method-override");
	
	seedB = require("./seeds");
// seedB();


mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});



app.use(bodyParser.urlencoded({ extended: true}));
app.set("view engine", "ejs" )
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Bruno is love",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoute);
app.use(commentsRoute);
app.use(campgroundRoute);


const host = '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, function() {
  console.log("Server started.......");
});