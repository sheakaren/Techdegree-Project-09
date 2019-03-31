'use strict';

var express = require("express");
var router = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

var User = require("./models").User;
var Course = require("./models").Course;


// GET Users route
router.get("/users", function(req, res, next){
    // Returns the currently authenticated user
    User.find({})
        .exec(function(err, users){
            if(err) return next(err);
            res.json(users);
        });
});

// POST Users route
router.post("/users", function(req, res, next){
    //  Creates a user, sets the Location header to "/", and returns no content
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        password: bcryptjs.hashSync(req.body.password)
    });
    user.save(function(err, user){
        if (err) return next(err);
        res.status(201);
        res.json(user);
    });
});

// GET Courses route
router.get("/courses", function(req, res, next){
    // Returns a list of courses (including the user that owns each course)
    Course.find({})
        .populate('user')
        .exec(function(err,courses){
            if(err) return next(err);
            res.json(courses);
        });
});

// GET Courses ID route
router.get("/courses/:id", function(req, res, next){
    // Returns a the course (including the user that owns the course) for the provided course ID
    res.json(req.Course)
});

//  POST Courses route
router.post("/courses", function(req, res, next){
    // Creates a course, sets the Location header to the URI for the course, and returns no content
    var course = new Course({
        user: req.body.user,
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded
    });
    course.save(function(err, course){
        if (err) return next(err);
        res.status(201);
        res.json(user);
    });
});

// PUT Courses ID route
router.put("/courses/:id", function(req, res, next){
    // Updates a course and returns no content
    req.course.update(req.body, function(err){
        if (err) return next(err);
        res.status(204);
    });
});

// DELETE Courses ID route
router.delete("/courses/:id", function(req, res, next){
    // Deletes a course and returns no content
    req.course.remove(function(err){
        req.course.save(function(err, course){
            if (err) return next(err);
            res.status(204);
        });
    });
});

module.exports = router;