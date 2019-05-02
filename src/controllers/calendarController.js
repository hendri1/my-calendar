import express from 'express';
import calendarModel from '../models/calendarModel';
import calendarCollection from '../collections/calendarCollection';
import Helper from '../helper/helper';
import tokenMiddleware from '../middleware/tokenMiddleware';

const calendarRouter = express.Router();
const prefix = '/calendar';

async function getCalendar(req, res) {
    let result = {};
    let statusCode = '';

    let id = req.params.id;
    let parameter = {};
    
    if(typeof(id) !== 'undefined') {
        parameter._id = id;
    }
    calendarCollection.find(parameter, function (err, respond){       
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

async function createCalendar(req, res) {   
    let result = {};
    let statusCode = '';

    let calendarM = calendarModel.getModelCalendar();
    let calendarRequest = req.body;

    const check = Helper.objectHaveSameKeys(calendarM, calendarRequest);
    if (check === false) {
        statusCode = Helper.statusCode('client_error', 'bad_request');
        result = statusCode;
        res.send(result);
    } else { 
        calendarRequest.users = JSON.parse(calendarRequest.users);
        calendarCollection.create(calendarRequest, function (err, respond){       
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

async function updateCalendar(req, res) {
    let result = {};
    let statusCode = '';

    let id = req.params.id;
    let calendarRequest = req.body;

    let param = { 
        _id: id, 
    }
    
    calendarCollection.updateOne(param, calendarRequest, function (err, respond){
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

async function deleteCalendar(req, res) {
    let result = {};
    let statusCode = '';

    let id = req.params.id;

    let param = { 
        _id: id, 
    }
    
    calendarCollection.deleteOne(param, function (err, respond){
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

calendarRouter.get(prefix + '/:id?', (req, res, next) => tokenMiddleware.checkToken(req, res, next), (req, res) => getCalendar(req, res));
calendarRouter.post(prefix + '/create', (req, res, next) => tokenMiddleware.checkToken(req, res, next), (req, res) => createCalendar(req, res));
calendarRouter.patch(prefix + '/update/:id', (req, res, next) => tokenMiddleware.checkToken(req, res, next), (req, res) => updateCalendar(req, res));
calendarRouter.delete(prefix + '/delete/:id', (req, res, next) => tokenMiddleware.checkToken(req, res, next), (req, res) => deleteCalendar(req, res));

module.exports = calendarRouter;