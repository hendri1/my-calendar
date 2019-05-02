import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const userType = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String
});
const userCollection = mongoose.model('user', userType, 'user');

module.exports = userCollection;