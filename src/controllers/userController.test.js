const assert = require('assert');

const mongoose = require('mongoose');
const express = require('express');
const md5 = require('md5');

const Schema = mongoose.Schema;
const userType = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String
});
const userCollection = mongoose.model('user', userType, 'user');

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
        it('API Login Success', function() {
            const loginRequest = {
                username: 'hendri',
                password: '12345'
            };

            let login = false;
            let username = loginRequest.username;
            let password = md5(loginRequest.password);
            userCollection.findOne({ username: username, password: password }, function (err, respond){
                if(err) {
                    login = false;
                } else {
                    if(respond) {
                        login = true;
                    } else {
                        login = false;
                    }
                }
                assert.equal(login, true);
            });
        });
        it('API Login Wrong Password Or Username', function() {
            const loginRequest = {
                username: 'hendri',
                password: '1234'
            };

            let login = false;
            let username = loginRequest.username;
            let password = md5(loginRequest.password);
            userCollection.findOne({ username: username, password: password }, function (err, respond){
                if(err) {
                    login = false;
                } else {
                    if(respond) {
                        login = false;
                    } else {
                        login = true;
                    }
                }
                assert.equal(login, true);
            });
        });
        it('API Get All User', function() {
            let result = false;
            userCollection.find({}, function (err, respond){
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
        it('API Get User By ID', function() {
            let id = '5cc15a5cb44d9d558bd738d3';
            let parameter = {};

            if(typeof(id) !== 'undefined') {
                parameter._id = id;
            }
            let result = false;
            userCollection.find(parameter, function (err, respond){
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
        it('API Get User By ID, With Wrong ID', function() {
            let id = '6cc15a5cb44d9d558bd738d3';
            let parameter = {};

            if(typeof(id) !== 'undefined') {
                parameter._id = id;
            }
            let result = false;
            userCollection.find(parameter, function (err, respond){
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