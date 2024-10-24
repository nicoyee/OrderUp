import { FService } from "./FirebaseService.ts";
import { doc, setDoc } from "firebase/firestore";
class EventsController {
    static async create(eventName, description, location, status, date, socialLink, photo) {
        try {
            let photoURL = '';
            if (photo) {
                // Upload photo to storage
                photoURL = await FService.uploadPhoto(photo, 'events');
            }
            const newEvent = {
                eventName,
                description,
                location,
                status,
                date: date.toISOString(),
                socialLink,
                photoURL
            };
            // Add new event document to Firestore
            const docRef = await FService.addDocument('events', newEvent);
            console.log('Event created successfully:', { id: docRef.id, ...newEvent });
            return { id: docRef.id, ...newEvent };
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    static async fetch() {
        try {
            const querySnapshot = await FService.getDocuments('events');
            const events = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(event => !event.deleted);
            return events;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }
    

    static async update(eventId, eventData) {
        try {
            let photoURL = eventData.photoURL;
            if (eventData.photo && typeof eventData.photo !== 'string') {
                // Upload updated photo to storage
                photoURL = await FService.uploadPhoto(eventData.photo, 'events');
            }
            const updatedEvent = {
                ...eventData,
                photoURL,
                socialLink: eventData.socialLink.trim()
            };
            // Update event document in Firestore
            await FService.updateDocument('events', eventId, updatedEvent);
            console.log('Event updated successfully:', updatedEvent);
            return updatedEvent;
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }

    static async delete(eventId) {
        try {
            await setDoc(doc(FService.db, 'events', eventId), {
                deleted: true
            }, { merge: true });
    
            console.log('Event marked as deleted successfully');
        } catch (error) {
            console.error('Error marking event as deleted:', error);
            throw error;
        }
    }
    
}

export default EventsController;