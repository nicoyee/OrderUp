import User from './user.js';

class Admin extends User {
    constructor(name, email, profilePicture) {
        super(name, email, 'admin', profilePicture);
    }
}

export default Admin;
