const mongoose = require('mongoose');

describe('app.js', function() {
    describe('connection to db', function() {
        it('API should connected to db', function() {
            mongoose.connect('mongodb://127.0.0.1:27017/my_calendar', {useNewUrlParser: true});
        });
    });

    after(function(){
        mongoose.connection.close();
    });
});