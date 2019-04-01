'use strict';

var express = require("express");
var router = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

var User = require("./models").User;
var Course = require("./models").Course;


router.param("id", function(req, res, next, id){
    Course.findById(id, function(err, doc){
        if (err) return next(err);
        if (!doc) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        req.Course = doc;
        return next();
    })
    .populate('user');
});


// Authenticate User Middleware

// This array is used to keep track of user records
// as they are created.
const users = []; // Do I need this for this project?

const authenticateUser = (req, res, next) => {
    const credentials = auth(req);
    if (credentials) {
      User.findOne({ emailAddress: credentials.name }, function(err, user) {
        if (user) {
          const authenticated = bcrypt.compareSync(credentials.pass, user.password);
        if (authenticated) {
            console.log(`Authentication successful for username: ${user.username}!`);
            // Store the user on the Request object.
            req.currentUser = user;
            next();
          } else {
            err = new Error("Authentication failure. Username and/or password not valid.");
            err.status = 401;
            next(err);
          }
        } else {
          err = new Error("Authentication failure. Username and/or password not valid.");
          err.status = 401;
          next(err);
        }
      })
    } else {
      res.status(401).json({ "Authentication Error": "User email address and password are required" });
    }
};

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