var express = require("express");
var router = express.Router(),
	passport = require("passport");
	User = require("../models/user")


router.get("/", function(req, res){
	res.render("landing")
});


//AUTH ROUTES

router.get("/register", function(req,res){
	res.render("register")
});

//SIGNUP LOGIC
router.post("/register", function(req,res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err)
			res.render("register");
		} 
		else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/campgrounds");
			})
		}
	})
});


//LOGIN
router.get("/login", function(req,res){
	res.render("login");
});

router.post("/login",passport.authenticate("local", {
	successRedirect : "/campgrounds",
	failureRedirect: "/login"
}), function(req,res){
	
});


//LOGOUT		
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged you out!")
	res.redirect("/campgrounds")
});




function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please login first!");
	res.redirect("/login")
}


module.exports = router;

