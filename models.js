'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    emailAddress: String,
    password: String
});

var User = mongoose.model('User', UserSchema);

var CourseSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    title: String,
    description: String,
    estimatedTime: String,
    materialsNeeded: String
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = {User, Course};