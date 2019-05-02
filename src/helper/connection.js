import mongoose from 'mongoose';

class Connection {

    constructor() {
        this.connectDB();        
    }

    connectDB() {
        mongoose.connect('mongodb://127.0.0.1:27017/my_calendar', {useNewUrlParser: true}).then(
            () => {
                console.log('connected to db');
            },
            err => {
                console.error.bind(console, 'connection error:');
            }
        );
    }
}

export default new Connection();