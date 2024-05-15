import User from './User';

class Customer extends User {
    constructor(name, email, password) {
        super(name, email, password);
        this.userType = 'customer';
    }
}