

import { FController } from "./controllers/controller.ts";

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
        return FController.getDocuments('dishes');
    }

    static async updateProfilePicture(userId, newImageFile) {
        try {
            const userDoc = await FController.getDocument('users', userId);
            const userData = userDoc.data();
            const oldImageUrl = userData?.profilePicture;

            if (oldImageUrl && oldImageUrl !== 'https://ui-avatars.com/api/?name=ben&background=random') {
                const oldImageRef = FController.getStorageRef('', oldImageUrl);
                await FController.deleteStorageObject(oldImageRef);
                console.log("Old profile picture image deleted successfully");
            }

            const newImageRef = FController.getStorageRef(`profile/${userId}`, newImageFile.name);
            await FController.uploadStorageObject(newImageRef, newImageFile);
            console.log("New profile picture image uploaded successfully");

            const newImageUrl = await FController.getDownloadURL(newImageRef);
            await FController.updateDocument('users', userId, { profilePicture: newImageUrl });
            console.log("Profile picture URL updated successfully in Firestore");
        } catch (error) {
            console.error("Error replacing profile picture: ", error);
        }
    }
}

export default User;
const userInstance = new User()
export { userInstance }