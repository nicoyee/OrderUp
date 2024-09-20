import React, { useState, useEffect } from 'react';
import EventsController from '../class/controllers/EventsController';
import '../css/EventsList.css'

const ITEMS_PER_PAGE = 6;

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await EventsController.fetch();
        setEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastEvent = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstEvent = indexOfLastEvent - ITEMS_PER_PAGE;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => (
      <button
        key={number}
        onClick={() => handlePageClick(number)}
        className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
      >
        {number}
      </button>
    ));
  };

  return (
    <div className="events-list">
      <h1 className="events-title">Upcoming Events</h1>

      <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

    <div className="events-items">
    {loading ? (
        <p>Loading events...</p>
    ) : (
        currentEvents.map((event) => (
        <div key={event.id} className="event-item">
            <div className="event-item-image-container">
            <img
                src={event.photoURL}
                alt={event.eventName}
                className="event-item-image"
            />
            </div>
            <div className="event-item-details">
            <h3 className="event-item-name">{event.eventName}</h3>
            <p className="event-item-description">{event.description}</p>
            <p className="event-item-date">Date: {new Date(event.date).toLocaleDateString()}</p>
            {/* <a
                href={event.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="event-item-link"
            >
                More Info
            </a> */}
            </div>
        </div>
        ))
    )}
    </div>


      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          className="pagination-btn"
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {renderPaginationButtons()}

        <button
          onClick={handleNextPage}
          className="pagination-btn"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EventsList;
