import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import EventsController from "../class/controllers/EventsController";
import '../landing/css/Event.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Event = ({ setLandingContent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await EventsController.fetch();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    draggable: true,
    centerMode: true, // Centers the active slide
    centerPadding: "20px", // Adds minimal padding for better fit
  };

  const handleBackClick = () => {
    setLandingContent('navigation'); // Adjust to your actual landing page action
  };

  return (
    <div id="eventPageContainer">
      <div className="event-header">
        <h1>Events</h1>
        <h2 className="event-back-button" onClick={handleBackClick}>Back</h2>
      </div>
      
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <Slider {...settings} className="eventSlider">
          {events.length === 0 ? (
            <p>No events available.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="eventCardContainer">
                <div className="eventCard">
                  <img src={event.photoURL} alt={event.eventName} />
                  <div className="description">
                    <h2>{event.eventName}</h2>
                    <p>{event.description}</p>
                    <p className="location">{event.location}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </Slider>
      )}
    </div>
  );
};

export default Event;
