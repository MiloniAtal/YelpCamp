var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
var Comment = require("../models/comment")



router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err)
		} else{
			res.render("comments/new", {campground: foundCamp});	
		}
	});
});

router.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err)
		} else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err)
					req.flash("error", "Something went wrong")
					req.redirect("back");
				}
				else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCamp.comments.push(comment);
					foundCamp.save();
					req.flash("success", "Comment created successfully")
					res.redirect("/campgrounds/" + req.params.id)
				}
			});	
		}
	});
});

router.get("/campgrounds/:id/comments/:comment_id/edit",checkOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err,foundComment){
		if(err){
			console.log(err);
		}
		else{
			 res.render("comments/edit", {campground_id : req.params.id, comment: foundComment});
		}
	});
		  
});

router.put("/campgrounds/:id/comments/:comment_id",checkOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/campgrounds/:id/comments/:comment_id",checkOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}

function checkOwnership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err,foundComment){
			if(err){
				res.redirect("back");
			} else{
				if(foundComment.author.id.equals(req.user._id)){
					return next();
				} else{
					req.flash("error", "You donot have permission to do that!")
					res.redirect("back")
				}
			}

		});	
	}
	else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("/login")
	}
}
module.exports = router;
