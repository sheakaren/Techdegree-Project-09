'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: {type: String,
                required: [true, 'First name is required']},
    lastName: {type: String,
               required: [true, 'Last name is required']},
    emailAddress: {type: String,
                   required: [true, 'Email address is required'],
                   unique: [true, 'Unique email address is required']},
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
    estimatedTime: String,
    materialsNeeded: String
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = {User, Course};