import express from 'express';
import md5 from 'md5';
import userModel from '../models/userModel';
import userCollection from '../collections/userCollection';
import Helper from '../helper/helper';
import tokenMiddleware from '../middleware/tokenMiddleware';

const userRouter = express.Router();
const prefix = '/user';

async function loginUser(req, res) {
    let result = {};
    let statusCode = '';

    let loginModel = userModel.getModelLogin();
    let loginRequest = req.body;

    const check = Helper.objectHaveSameKeys(loginModel, loginRequest);

    if (check === false) {
        statusCode = Helper.statusCode('client_error', 'bad_request');
        result = statusCode;
        res.send(result);
    } else { 
        result.status = 200;
        result.message = 'OK';

        let username = loginRequest.username;
        let password = md5(loginRequest.password);
        userCollection.findOne({ username: username, password: password }, function (err, respond){
            if(err) {
                statusCode = Helper.statusCode('server_error');
                result = statusCode;
            } else {
                const token = tokenMiddleware.setToken(respond._id);

                statusCode = Helper.statusCode('success', 'ok');
                result = statusCode;
                result.respond = {
                    user_id: respond._id,
                    token: token
                };
            }
            res.send(result);
        });
    }
}

async function getUser(req, res) {
    let result = {};
    let statusCode = '';

    let id = req.params.id;
    let parameter = {};
    
    if(typeof(id) !== 'undefined') {
        parameter._id = id;
    }
    userCollection.find(parameter, function (err, respond){       
        if(err) {
            statusCode = Helper.statusCode('server_error');
            result = statusCode;
        } else {
            statusCode = Helper.statusCode('success', 'ok');
            result = statusCode;
            result.count = respond.length;
            result.data = respond;
        }
        res.send(result);
    });
}

async function createUser(req, res) {   
    let result = {};
    let statusCode = '';

    let userM = userModel.getModelUser();
    let userRequest = req.body;

    const check = Helper.objectHaveSameKeys(userM, userRequest);

    if (check === false) {
        statusCode = Helper.statusCode('client_error', 'bad_request');
        result = statusCode;
        res.send(result);
    } else { 
        userRequest.password = md5(userRequest.password);
        userCollection.create(userRequest, function (err, respond){       
            if(err) {
                statusCode = Helper.statusCode('server_error');
                result = statusCode;
            } else {
                statusCode = Helper.statusCode('success', 'created');
                result = statusCode;
                result.respond = respond;
            }
            res.send(result);
        }); 
    }
}

async function updateUser(req, res) {
    let result = {};
    let statusCode = '';

    let id = req.params.id;
    let userRequest = req.body;

    let param = { 
        _id: id, 
    }
    
    userCollection.updateOne(param, userRequest, function (err, respond){
        if(err) {
            statusCode = Helper.statusCode('server_error');
            result = statusCode;
        } else {
            statusCode = Helper.statusCode('success', 'updated');
            result = statusCode;
            result.respond = respond;
        }
        res.send(result);
    });
}

async function deleteUser(req, res) {
    let result = {};
    let statusCode = '';

    let id = req.params.id;

    let param = { 
        _id: id, 
    }
    
    userCollection.deleteOne(param, function (err, respond){
        if(err) {
            statusCode = Helper.statusCode('server_error');
            result = statusCode;
        } else {
            statusCode = Helper.statusCode('success', 'deleted');
            result = statusCode;
            result.respond = respond;
        }
        res.send(result);
    });
}

userRouter.post(prefix + '/login', (req, res) => loginUser(req, res));
userRouter.get(prefix + '/:id?', (req, res, next) => tokenMiddleware.checkToken(req, res, next), (req, res) => getUser(req, res));
userRouter.post(prefix + '/create', (req, res, next) => tokenMiddleware.checkToken(req, res, next), (req, res) => createUser(req, res));
userRouter.patch(prefix + '/update/:id', (req, res, next) => tokenMiddleware.checkToken(req, res, next), (req, res) => updateUser(req, res));
userRouter.delete(prefix + '/delete/:id', (req, res, next) => tokenMiddleware.checkToken(req, res, next), (req, res) => deleteUser(req, res));

module.exports = userRouter;