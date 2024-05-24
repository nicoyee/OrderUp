import React, { useState, useEffect} from 'react';
import DatePicker from 'react-datepicker';
import '../css/Admin/DatePicker.css';
import '../css/Admin/CreateEvent.css';
import AdminController from '../class/admin/AdminController';

const CreateEvent = ({ modalIsOpen, setModalIsOpen, setEvents }) => {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('ongoing');
    const [date, setDate] = useState(new Date());
    const [socialLink, setSocialLink] = useState('');
    const [photo, setPhoto] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [events, setEventsState] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const events = await AdminController.fetchEvents();
            setEventsState(events);
        } catch (error) {
            setErrorMessage('Error fetching events. Please try again.');
        }
    };

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
            const newEvent = await AdminController.createEvent(eventName, description, location, status, date, socialLink, photo);
            setEvents([...events, newEvent]);
            closeModal();
        } catch (error) {
            setErrorMessage('Error creating event. Please try again.');
        }
    };

    return (
        modalIsOpen && (
            <div className="createevent-modal">
                <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <h1>Create Event</h1>
                    <form onSubmit={handleCreateEvent}>
                        <div className="formGroup">
                            <label>Event Name</label>
                            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                        </div>
                        <div className="formGroup">
                            <label>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="formGroup">
                            <label>Location</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
                        </div>
                        <div className="formGroup">
                            <label>Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="pending">Pending</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
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
                        <div className="formGroup">
                            <label>Event Link</label>
                            <input type="url" value={socialLink} onChange={(e) => setSocialLink(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <label>Photo</label>
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
