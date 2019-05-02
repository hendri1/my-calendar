class calendarModel {
    constructor() {

    }

    getModelCalendar() {
        let calendarModel = {
            calendarName: '',
            startDate: '',
            endDate: '',
            users: [],
            location: '',
            owner: ''
        }
        return calendarModel;
    }
}

export default new calendarModel();