'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: {type: String,
                required: [true, 'First name is required']},
    lastName: {type: String,
                required: [true, 'Lase name is required']},
    emailAddress: {type: String,
                required: [true, 'Email address is required']},
    password: {type: String,
                required: [true, 'Password is required']}
});

var User = mongoose.model('User', UserSchema);

var CourseSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    title: {type: String,
                required: [true, 'Course title is required']},
    description: {type: String,
                required: [true, 'Course description is required']},
    estimatedTime: {type: String,
                required: [true, 'Estimated time is required']},
    materialsNeeded: {type: String,
                required: [true, 'materials needed is required']}
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = {User, Course};