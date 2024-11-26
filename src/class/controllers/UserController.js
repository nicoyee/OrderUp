import { FService } from "./FirebaseService.ts";
import User from "../User.js";
class UserController {
  static fetchAndUpdateUserDetails(setUid, setUserDetails, navigate) {
      const unsubscribe = FService.onAuthStateChanged(async (user) => {
        if (user) {
          setUid(user.uid);
          const fetchedUser = await UserController.getUser(user.uid);
          if (fetchedUser) {
            setUserDetails(
              fetchedUser.docId,
              fetchedUser.name,
              fetchedUser.email,
              fetchedUser.userType,
              fetchedUser.profilePicture
            );
          }
        } else {
          navigate("/");
        }
      });
      // Return the unsubscribe function to allow unsubscribing if needed
      return unsubscribe;
  }
  static async getUser(uid) {
      try {
      const userDoc = await FService.getDocument('users', uid);
      if (userDoc.exists()) {
          const userData = userDoc.data();
          const user = new User(
          userDoc.id,
          userData.name,
          userData.email,
          userData.userType,
          userData.profilePicture
          );
          return user;
      } else {
          throw new Error("User not found");
      }
      } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
      }
  }

  static async updateUser(uid, userDetails) {
    try {
      const userDocRef = FService.getDocRef('users', uid);
      await FService.updateDocument(userDocRef, userDetails);
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
  
  static async updateProfilePicture(uid, photo) {
    try {
      const photoURL = await FService.uploadPhoto(photo, 'profilePictures');
      // Assuming 'photoURL' is the field in the user document where the photo URL is stored
      await this.updateUser( uid, { photoURL });
      console.log("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  }

  static async setGcashImage(newImageFile) {
    try {
      const newImageRef = FService.getStorageRef(`/gcash/${newImageFile.name}`);
      await FService.uploadFile(newImageRef, newImageFile);
      const newImageUrl = await FService.getDownloadURL(newImageRef);

      const gcashDocRef = FService.getDocumentRef('qr_code', 'gcash');
      await FService.setDocument(gcashDocRef, {
        filename: newImageFile.name,
        imageUrl: newImageUrl,
      });
      console.log("GCash image updated successfully");
    } catch (error) {
      console.error("Error updating GCash image:", error);
      throw error;
    }
  }
}

export default UserController;
