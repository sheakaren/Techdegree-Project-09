'use strict';

var express = require("express");
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


// USERS

// Authenticate User Middleware

// This array is used to keep track of user records
// as they are created.
// const users = []; // Do I need this for this project? - I don't think so. Keeping it for now

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
      res.status(401).json({ "Email address and password are required" });
    }
};

var router = express.Router();


// GET Users route ---- GOOD
router.get("/users", authenticateUser, function(req, res, next){
    // Returns the currently authenticated user
    User.find({})
        .exec(function(err, users){
            if(err) return next(err);
            res.json(users);
        });
});

// POST Users route ---- GOOD??
router.post("/users", authenticateUser, function(req, res, next){
    //  Creates a user, sets the Location header to "/", and returns no content
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        password: bcryptjs.hashSync(req.body.password)
    });
    user.save(function(err, user){
        if (err) return res.status(400).json({error: err});
        res.location('/');
        res.status(201);
        res.json(user);
    });
});

// COURSES

// GET Courses route ---- GOOD
router.get("/courses", authenticateUser, function(req, res, next){
    // Returns a list of courses (including the user that owns each course)
    Course.find({})
        .populate('user')
        .exec(function(err,courses){
            if(err) res.status(400).json({error: err});
            res.json(courses);
        });
});

// GET Courses ID route ---- GOOD
router.get("/courses/:id", authenticateUser, function(req, res, next){
    // Returns a the course (including the user that owns the course) for the provided course ID
    res.json(req.Course)
});

//  POST Courses route ---- GOOD
router.post("/courses", authenticateUser, function(req, res, next){
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
        res.location("/" + course.id)
        res.status(201);
        res.json(user);
    });
});

// PUT Courses ID route ---- GOOD?
router.put("/courses/:id", authenticateUser, function(req, res, next){
    // Updates a course and returns no content
    req.course.update(req.body, function(err){
        if (err) return res.status(400).json({error: err});
        res.status(204);
    });
});

// DELETE Courses ID route
router.delete("/courses/:id", authenticateUser, function(req, res, next){
    // Deletes a course and returns no content
    req.course.remove(function(err){
        req.course.save(function(err, course){
            if (err) return res.status(400).json({error: err});
            res.status(204);
        });
    });
});

module.exports = router;