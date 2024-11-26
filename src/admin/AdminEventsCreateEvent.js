import React, { useState } from 'react';
import { toast, Flip } from 'react-toastify';

import Admin from '../class/admin/Admin';

const AdminEventsCreateEvent = ({ closeCreateEvent, setEvents }) => {
    
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ location, setLocation ] = useState('');
    const [ status, setStatus ] = useState('ongoing');
    const [ socialLink, setSocialLink ] = useState('');
    const [ date, setDate ] = useState('');
    const [ photo, setPhoto ] = useState(null);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const newEvent = await Admin.createEvent( name, description, location, status, new Date(date), socialLink, photo );
            setEvents((prevEvents) => [...prevEvents, newEvent]);
            closeCreateEvent();
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    return (
        <form id="adminEventsCreateEvent" className="modal form" onSubmit={ handleCreateEvent }>

            <div className='modal-header'>
                <span>
                    <h1>Create New Event</h1>
                    <svg
                        onClick={ closeCreateEvent }
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
                <h2>Create a new event</h2>
            </div>

            <div className="modal-body">
                <div className="modal-body-section vertical">
                    <label>Name</label>
                    <input 
                        type = "text" 
                        placeholder = "Enter event Name" 
                        value = { name } 
                        onChange={(e)=>setName(e.target.value)}
                        required
                    />
                </div>
                <div className="modal-body-section vertical">
                    <label>Description</label>
                    <textarea 
                        type = "text"
                        name = "description"  
                        value = { description } 
                        placeholder = "Enter event Description"
                        onChange={(e)=>setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="modal-body-section vertical">
                    <label>Location</label>
                    <input 
                        type = "text"
                        name = "location" 
                        value = { location } 
                        placeholder = "Enter event Location" 
                        onChange={(e)=>setLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="modal-body-section vertical">
                    <label>Status</label>
                    <select
                        name = "status" 
                        value = { status } 
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="pending">Pending</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="modal-body-section">
                    <div className="modal-body-section vertical">
                        <label>Date</label>
                        <input 
                            type = "date" 
                            name = "date" 
                            value={ date } 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="modal-body-section vertical">
                        <label>Photo</label>
                        <input 
                            type = "file" 
                            name = "photoURL"
                            onChange={(e) => setPhoto(e.target.files[0])}
                            required
                        />
                    </div>
                </div>
                <div className="modal-body-section">
                    <button
                        type="submit"
                        className="modalButton primary submit"
                    >
                        Create Event
                    </button>
                </div>
            </div>

            <div className="modal-footer">

            </div>

        </form>
    );
};

export default AdminEventsCreateEvent;
