import React, { useState, useEffect} from 'react';
import Admin from '../../class/admin/Admin';


const CreateEvent = ({ modalIsOpen, setModalIsOpen, setEvents }) => {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('ongoing');
    const [date, setDate] = useState('');
    const [socialLink, setSocialLink] = useState('');
    const [photo, setPhoto] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [events, setEventsState] = useState([]);

    const closeModal = () => {
        setModalIsOpen(false);
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
            const newEvent = await Admin.createEvent(eventName, description, location, status, new Date(date), socialLink, photo);
            setEvents([...events, newEvent]);
            closeModal();
        } catch (error) {
            setErrorMessage('Error creating event. Please try again.');
        }
    };

    return (
        modalIsOpen && (
            <div className="create-event-modal">
                <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <h1>Create Event</h1>
                    <form onSubmit={handleCreateEvent}>
                        <div className="form-group">
                            <label>Event Name:</label>
                            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Description:</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Location:</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Status:</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="pending">Pending</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date:</label>
                            <input type="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Event Link:</label>
                            <input type="url" value={socialLink} onChange={(e) => setSocialLink(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Photo:</label>
                            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                        </div>
                        <div className="error-message">{errorMessage}</div>
                        <button type="submit">Create Event</button>
                    </form>
                </div>
            </div>
        )
    );
};

export default CreateEvent;