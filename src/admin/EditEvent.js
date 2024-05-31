import '../css/common/modals.css';
import './adminModal.css';

import React, { useState } from 'react';
import Admin from '../class/admin/Admin';

const EditEvent = ({ event, onUpdateEvent, handleCloseEditEventModal }) => {
  const [updatedEvent, setUpdatedEvent] = useState({ ...event });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent(prevState => ({ ...prevState, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent(prevState => ({ ...prevState, [name]: new Date(value).toISOString() }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setUpdatedEvent(prevState => ({ ...prevState, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEventData = { ...updatedEvent };
      if (typeof updatedEvent.photo === 'object') {
        const photoURL = await Admin.uploadPhoto(updatedEvent.photo, 'events');
        updatedEventData.photoURL = photoURL;
      }
      await Admin.updateEvent(updatedEvent.id, updatedEventData);
      onUpdateEvent(updatedEventData);
      handleCloseEditEventModal();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <form id='manageEvent' className="modalForm" onSubmit={ handleSubmit }>

      <div className='modalForm-header'>
        <span>
          <h1>Update An Event</h1>
          <svg
              onClick={ handleCloseEditEventModal }
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
          >
              <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </span>
      </div>

      <div className='adminForm-body'>
        <div className='adminForm-section'>
          <label>Event Name</label>
          <div className='adminForm-input'>
            <input type="text" name="eventName" value={updatedEvent.eventName} onChange={handleChange} />
          </div>
        <div className='adminForm-section'>
          <label>Description</label>
          <textarea name='description' placeholder="Enter description" value={updatedEvent.description} onChange={handleChange}></textarea>
        </div>
        <div className='adminForm-section'>
          <label>Location</label>
          <div className='adminForm-input'>
            <input type="text" name="location" value={updatedEvent.location} onChange={handleChange} />
          </div>
        </div>
        <div className='adminForm-section'>
          <label>Status</label>
          <select name="status" value={updatedEvent.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className='adminForm-section'>
          <label>Date</label>
          <input type="date" name="date" value={updatedEvent.date.slice(0, 10)} onChange={handleDateChange} />
        </div>
        <div className='adminForm-section'>
          <label>Event Link</label>
          <input type="url" name="socialLink" value={updatedEvent.socialLink} onChange={handleChange} />
        </div>
        <div className='adminForm-section'>
          <label>Photo</label>
          <input type="file" name="photo" onChange={handleFileChange} />
        </div>
        <button className="adminForm-submit">Update Event</button>
        </div>
      </div>
    </form>
  );
};

export default EditEvent;
