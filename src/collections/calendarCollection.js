import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const calendarType = new Schema({
    calendarName: String,
    startDate: String,
    endDate: String,
    users: Array,
    location: String,
    owner: String
});
const calendarCollection = mongoose.model('calendar', calendarType, 'calendar');

module.exports = calendarCollection;