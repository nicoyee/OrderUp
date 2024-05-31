import '../css/common/modals.css';
import './adminModal.css';
import '../css/Admin/DatePicker.css';

import React, { useState, useEffect} from 'react';
import DatePicker from 'react-datepicker';

import Admin from '../class/admin/Admin';

const CreateEvent = ({ closeModal, setEvents }) => {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('ongoing');
    const [date, setDate] = useState(new Date());
    const [socialLink, setSocialLink] = useState('');
    const [photo, setPhoto] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [events, setEventsState] = useState([]);

    const closeCreateEventModal = () => {
        closeModal();
        resetForm();
    };

    const resetForm = () => {
        setEventName('');
        setDescription('');
        setLocation('');
        setStatus('ongoing');
        setDate(new Date());
        setSocialLink('');
        setPhoto(null);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const newEvent = await Admin.createEvent(eventName, description, location, status, date, socialLink, photo);
            setEvents([...events, newEvent]);
            closeModal();
        } catch (error) {
            setErrorMessage('Error creating event. Please try again.');
        }
    };

    return (
        <form id='manageEvent' className="modalForm" onSubmit={ handleCreateEvent }>

        <div className='modalForm-header'>
          <span>
            <h1>Create An Event</h1>
            <svg
                onClick={ closeCreateEventModal }
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
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
            </div>
          <div className='adminForm-section'>
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </div>
          <div className='adminForm-section'>
            <label>Location</label>
            <div className='adminForm-input'>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
          </div>
          <div className='adminForm-section'>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className='adminForm-section'>
            <label>Date</label>
            <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
            }) => (
                    <div className="custom-header">
                        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="nav-button">
                            &lt;
                        </button>
                        <span>{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</span>
                        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="nav-button">
                            &gt;
                        </button>
                    </div>
            )}
                required
            />
          </div>
          <div className='adminForm-section'>
            <label>Event Link</label>
            <input type="url" value={socialLink} onChange={(e) => setSocialLink(e.target.value)} />
          </div>
          <div className='adminForm-section'>
            <label>Photo</label>
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
          </div>
          <button className="adminForm-submit">Create Event</button>
          </div>
        </div>
      </form>
    );
};

export default CreateEvent;