var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")


router.get("/campgrounds", function(req,res){
	Campground.find({},function(err, allCampgrounds){
		if(err){
			console.log(err)
		}
		else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});	
		}
	});

});

router.post("/campgrounds",isLoggedIn, function(req,res){
	var name = req.body.name
	var image = req.body.image
	var des = req.body.description
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image,author: author, description: des}
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err)
		} else {
			res.redirect("/campgrounds")
		}
	});
	
});

router.get("/campgrounds/new",isLoggedIn, function(req,res){
	res.render("campgrounds/new.ejs");
});

router.get("/campgrounds/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			console.log(err)
		} else{
			
			res.render("campgrounds/show", {campground: foundCamp});	
		}
	});
	
	
});

//EDIT
router.get("/campgrounds/:id/edit",checkOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		} else{
			res.render("campgrounds/edit", {campground:foundCamp});
		}
	})
	
});

//UPDATE
router.put("/campgrounds/:id",checkOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
		if(err){console.log(err)}
		else{res.redirect("/campgrounds/" + req.params.id)};
	});
});

router.delete("/campgrounds/:id",checkOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){console.log(err)}
		else{
			res.redirect("/campgrounds")
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

function checkOwnership(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err,foundCamp){
			if(err){
				req.flash("error", "Campground not found")
				res.redirect("back");
			} else{
				if(foundCamp.author.id.equals(req.user._id)){
					return next();
				} else{
					req.flash("error", "You donot have permission to do that!")
					res.redirect("back")
				}
			}

		});	
	}
	else{
		res.flash("error", "You need to be logged in to do that")
		res.redirect("/login")
	}
}

module.exports = router;
