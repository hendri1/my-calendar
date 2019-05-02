class userModel {
    getModelLogin() {
        let loginModel = {
            username: '',
            password: ''
        }
        return loginModel;
    }

    getModelUser() {
        let userModel = {
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            password: ''
        }
        return userModel;
    }
}

export default new userModel();