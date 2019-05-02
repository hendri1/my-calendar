import jwt from 'jsonwebtoken';

class Helper {

    objectHaveSameKeys(obj1, obj2) {       
        return Object.keys(obj1).every(function(prop){
            return obj2.hasOwnProperty(prop);
        });
    }

    statusCode(type, parameter) {
        let result = {
            status: '',
            message: ''
        };

        switch (type) {
            case 'success':
                switch (parameter) {
                    case 'ok':
                        result.status = 200;
                        result.message = 'OK';
                        break;
                    case 'updated':
                        result.status = 201;
                        result.message = 'Data has been updated';
                        break;
                    case 'created':
                        result.status = 201;
                        result.message = 'Data has been created';
                        break;
                    case 'deleted':
                        result.status = 201;
                        result.message = 'Data has been deleted';
                        break;
                }
                break;
            case 'client_error':
                switch (parameter) {
                    case 'bad_request':
                        result.status = 400;
                        result.message = 'Request Incomplete';
                        break;
                    case 'invalid_token':
                        result.status = 401;
                        result.message = 'Failed to authenticate token';
                        break;
                    case 'token_expired':
                        result.status = 401;
                        result.message = 'Token has been expired';
                        break;
                    case 'forbidden':
                        result.status = 403;
                        result.message = 'You doesn\'t have access to this api';
                        break;
                    case 'not_found':
                        result.status = 404;
                        result.message = 'Api Not Found';
                        break;
                    case 'method_not_allowed':
                        result.status = 405;
                        result.message = 'Method not allowed to this api';
                        break;
                }
                break;
            case 'server_error':
                result.status = 500;
                result.message = 'Internal Server Error';
                break;
        }

        return result;
    }
}

export default new Helper();