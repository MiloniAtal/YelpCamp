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

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://Miloni:21Febru@ry@miloni-rz0by.mongodb.net/<dbname>?retryWrites=true&w=majority");


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









app.listen(3000, function(){
	console.log("serving on port 3000")
});