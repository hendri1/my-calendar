const assert = require('assert');

const mongoose = require('mongoose');
const express = require('express');
const md5 = require('md5');

const Schema = mongoose.Schema;
const calendarType = new Schema({
    calendarName: String,
    startDate: String,
    endDate: String,
    users: Array,
    location: String,
    owner: String
});
const calendarCollection = mongoose.model('user', calendarType, 'user');

describe('userController.js', function() {
    before(function(){
        mongoose.connect('mongodb://127.0.0.1:27017/my_calendar', {useNewUrlParser: true}).then(
            () => {
                console.log('connected to db');
            },
            err => {
                console.error.bind(console, 'connection error:');
            }
        );
    });

    describe('API User Function', function() {
        it('API Get All Calendar', function() {
            let result = false;
            calendarCollection.find({}, function (err, respond){
                if(err) {
                    result = false;
                } else {
                    if(respond) {
                        result = true;
                    } else {
                        result = false;
                    }
                }
                assert.equal(result, true);
            });
        });
        it('API Get Calendar By ID', function() {
            let id = '5cca614db038f93368ea29b1';
            let parameter = {};

            if(typeof(id) !== 'undefined') {
                parameter._id = id;
            }
            let result = false;
            calendarCollection.find(parameter, function (err, respond){
                if(err) {
                    result = false;
                } else {
                    if(respond) {
                        result = true;
                    } else {
                        result = false;
                    }
                }
                assert.equal(result, true);
            });
        });
        it('API Get Calendar By ID, With Wrong ID', function() {
            let id = '6cca614db038f93368ea29b1';
            let parameter = {};

            if(typeof(id) !== 'undefined') {
                parameter._id = id;
            }
            let result = false;
            calendarCollection.find(parameter, function (err, respond){
                if(err) {
                    result = false;
                } else {
                    if(respond) {
                        result = true;
                    } else {
                        result = false;
                    }
                }
                assert.equal(result, true);
            });
        });
    });

    after(function(){
        mongoose.connection.close();
    });
});