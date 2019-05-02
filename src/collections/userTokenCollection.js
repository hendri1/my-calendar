import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const userTokenType = new Schema({
    user_id: String,
    token: String,
    expired: String,
    is_expired: Boolean
});
const userTokenCollection = mongoose.model('user_token', userTokenType, 'user_token');

module.exports = userTokenCollection;