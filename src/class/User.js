import { FService } from "./controllers/FirebaseService.ts";

class User {
    constructor(docId = "", name ="", email="", userType="", profilePicture="") {
        this.docId = docId;
        this.name = name;
        this.email = email;
        this.userType = userType;
        this.profilePicture = profilePicture;
    }
    
    setUserDetails(docId, name, email, userType, profilePicture){
        this.docId = docId;
        this.name = name;
        this.email = email;
        this.userType = userType;
        this.profilePicture = profilePicture;
    }
    //Common functions
    //Dishes
    static async getDishes(){        
        return FService.getDocuments('dishes');
    }
    
}

export default User;
const userInstance = new User()
export { userInstance }