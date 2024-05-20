import Firebase from "./firebase.ts";

class User {
    constructor(docId, name, email, userType, profilePicture) {
        this.docId = docId;
        this.name = name;
        this.email = email;
        this.userType = userType;
        this.profilePicture = profilePicture;
    }

    //Dishes
    static async getDishes(){
        const firebase = Firebase.getInstance();
        
        return firebase.getDocuments('dishes');
      }
    // TODO: Implement CRUD operations for orders

}

export default User;
