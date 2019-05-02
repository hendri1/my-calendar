import moment from 'moment';
import jwt from 'jsonwebtoken';
import userTokenCollection from '../collections/userTokenCollection';
import Helper from '../helper/helper';

class tokenMiddleware {
    getConfig() {
        return 'mysecret';
    }

    setToken(userId) {
        let token = jwt.sign({ id: userId }, this.getConfig(), {
            expiresIn: 86400
        });

        let insertToken = this.insertTokenUser(token, userId);
        
        if(insertToken === false) {
            token = 'internal server error';
        }
        return token;
    }

    checkToken(req, res, next) {
        const $this = this;
        let authorization = req.headers.authorization;
        if (authorization.startsWith('Bearer ')) {        
            authorization = authorization.slice(7, authorization.length).trimLeft();
        }

        authorization = authorization.split(' ');
        let userId = authorization[0];
        let token = authorization[1];
        let result = {};
        let statusCode = '';

        if(token === '') {
            statusCode = Helper.statusCode('client_error', 'invalid_token');
            result = statusCode;
            res.send(result);
            next();
        }

        jwt.verify(token, this.getConfig(), function(err, decoded) {
            if (err) {
                $this.updateTokenUser(token, userId);
                statusCode = Helper.statusCode('client_error', 'token_expired');
                result = statusCode;
                res.send(result);
                next();
            } else {
                $this.checkTokenUser(res, next, token, userId);
            }
        }); 
    }

    updateTokenUser(token, userId) {
        let data = {
            is_expired: true
        };

        let param = { 
            user_id: userId, 
            token: token, 
            is_expired: false 
        }
        
        userTokenCollection.updateOne(param, data, function (err, respond){
            if(err) {
                return false;
            } else {
                return true;
            }
        });
    }

    insertTokenUser(token, userId) {
        const tomorrow = moment().add(1, 'days').format('DD-MM-YYYY HH:mm:ss');
        
        let data = {
            user_id: userId,
            token: token,
            expired: tomorrow,
            is_expired: false
        };
        
        userTokenCollection.create(data, function (err, respond){       
            if(err) {
                return false;
            } else {
                return true;
            }
        });
    }

    checkTokenUser(res, next, token, userId) {
        const $this = this;
        let result = {};
        let statusCode = '';

        userTokenCollection.findOne({ user_id: userId, token: token, is_expired: false }, function (err, respond){
            if(err) {
                statusCode = Helper.statusCode('client_error', 'invalid_token');
                result = statusCode;
                res.send(result);
                next();
            } else {
                if(respond !== null) {
                    let now = moment().format('DD-MM-YYYY HH:mm:ss');
                    let dateToken = moment(respond.expired, 'DD-MM-YYYY HH:mm:ss');
                    
                    let isAfter = moment(now, 'DD-MM-YYYY HH:mm:ss').isAfter(dateToken);
                    
                    if(isAfter === true) {
                        let updateToken = $this.updateTokenUser(token, userId);
                        if(updateToken === true) {
                            statusCode = Helper.statusCode('client_error', 'token_expired');
                            result = statusCode;
                            res.send(result);
                            next();
                        } else {
                            statusCode = Helper.statusCode('server_error');
                            result = statusCode;
                            res.send(result);
                            next();
                        }
                    } else {
                        next();
                    }
                } else {
                    statusCode = Helper.statusCode('client_error', 'invalid_token');
                    result = statusCode;
                    res.send(result);
                    next();
                }
            }
        });
    }
}

export default new tokenMiddleware();