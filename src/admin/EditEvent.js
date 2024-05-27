import React, { useState } from 'react';
import '../css/Admin/EditEvent.css';
import Admin from '../class/admin/Admin'

const EditEvent = ({ event, onUpdateEvent, onCancel }) => {
  const [updatedEvent, setUpdatedEvent] = useState({ ...event }); // Initialize state with a copy of the event

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent(prevState => ({ ...prevState, [name]: value })); // Ensure state update is based on previous state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Admin.updateEvent(updatedEvent); // Call the updateEvent function from Admin
      onUpdateEvent(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div className="edit-event-modal">
      <div className="modal-content">
        <span className="close" onClick={onCancel}>&times;</span>
        <h2>Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name:</label>
            <input type="text" name="eventName" value={updatedEvent.eventName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={updatedEvent.description} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input type="text" name="location" value={updatedEvent.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select name="status" value={updatedEvent.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input type="date" name="date" value={updatedEvent.date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <button type="submit">Update Event</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
