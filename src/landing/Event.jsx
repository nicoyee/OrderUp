import React, { useState, useEffect } from 'react';
import EventsController from "../class/controllers/EventsController"; // Ensure correct path
import '../landing/css/Event.css'

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await EventsController.fetch(); // Fetch events from Firestore
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div id="eventPageContainer">
  {loading ? (
    <p>Loading events...</p>
  ) : (
    <div className="eventList">
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="eventCard">
            <img src={event.photoURL} alt={event.eventName} />
            <div className="description">
              <h2>{event.eventName}</h2>
              <p>{event.description}</p>
              <p className="location">{event.location}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )}
</div>
  );
};

export default Event;
