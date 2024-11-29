import "./css/AdminEvents.css";

import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FaBan } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";

import React, { useEffect, useState, useContext } from 'react';
import { toast, Flip } from 'react-toastify';
import Modal from 'react-modal';

import Admin from '../class/admin/Admin';

import Loading from '../common/Loading';
import StatusIndicator from "../common/StatusIndicator";
import CreateEvent from "./AdminEventsCreateEvent";

const AdminEvents = () => {

    const [ loading, setLoading ] = useState(true);
    const [ events, setEvents ] = useState([]);
    const [ selectedEvent, setSelectedEvent ] = useState(null);
    const [ editedEvent, setEditedEvent ] = useState(null);
    const [ createEventModal, showCreateEventModal ] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch events directly
                const eventsData = await Admin.fetchEvents();
    
                if (eventsData) {
                    // Process the events: filter out deleted ones
                    const activeEvents = eventsData.filter(event => !event.deleted);
                    setEvents(activeEvents);
                } else {
                    console.error('Fetched events data is undefined or null:', eventsData);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleEdit = (event) => {
        setSelectedEvent(event.id);
        setEditedEvent({ ...event });
    };

    const handleEditCancel = () => {
        setSelectedEvent(null);
        setEditedEvent(null);
    };

    const handleDeleteEvent = async (eventId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this event?');
        if (isConfirmed) {
            try {
                // If confirmed, mark the event as deleted
                await Admin.deleteEvent(eventId);
                setEvents(events.filter(event => event.id !== eventId)); // Optionally remove it from the UI
            } catch (error) {
                console.error('Error marking event as deleted:', error);
            }
        }
    };

    const handleEditChange = (e) => {
        const { name, type, value, files } = e.target;
    
        if (type === 'file') {
            if (files && files[0]) {
                setEditedEvent(prev => ({
                    ...prev,
                    photoFile: files[0], // Store the actual file object
                }));
            }
        } else {
            setEditedEvent(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleEditConfirm = async (eventId) => {
        try {
            let updatedEventData = { ...editedEvent };

            // If there's a new photo file, upload it first
            if (editedEvent.photoFile) {
                const photoURL = await Admin.uploadEventPhoto(editedEvent.photoFile);
                updatedEventData = {
                    ...updatedEventData,
                    photoURL: photoURL
                };
            }

            // Clean up temporary photo data
            delete updatedEventData.photoFile;

            await Admin.updateEvent(eventId, updatedEventData);

            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === eventId ? { ...event, ...updatedEventData } : event
                )
            );

            toast.success(`${editedEvent.eventName} has been successfully edited!`, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Flip,
            });

            setSelectedEvent(null);
            setEditedEvent(null);

        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const viewCreateEventModal = () => {
        showCreateEventModal(true);
        document.body.classList.add('modal-open');
    };
    
    const closeCreateEventModal = () => {
        showCreateEventModal(false);
        document.body.classList.remove('modal-open');
    };
   
    return (
        <div id="adminEvents" className="dashboard-content">

            <div className="dashboard-section">
                <div className="userInfo admin">
                    <div className="userInfo-left">
                        <span className="vertical">
                            <h1>Dashboard</h1>
                            <h3>Events</h3>
                        </span>
                    </div>
                    <div className="userInfo-right">
                        <button 
                            className="primaryButton icon"
                            onClick={ viewCreateEventModal }
                        >
                            <MdEventAvailable /> 
                            Add Event
                        </button>
                    </div>
                </div>  
            </div>

            <div className="dashboard-section">

                <div className="dataCard table">
                    <div className="dataCard-header">
                        <div className="dataCard-header-section">
                            <h1>Event Details</h1>
                        </div>
                    </div>

                    <div className="dataCard-content full">
                    {loading ? (

                        <Loading />

                    ) : (

                        <table>

                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                            { events.map((event) => (
                                <tr 
                                    key={event.id}
                                    className={ selectedEvent === event.id ? "activeRow" : ""}
                                >

                                    <td className="image-cell">
                                    { selectedEvent === event.id ? (
                                        <input
                                            type="file"
                                            name="photoURL"
                                            onChange={ handleEditChange }
                                        />
                                    ) : (
                                        <img src = { event.photoURL } alt = { event.name } />
                                    )}
                                    </td>
                                    <td>
                                    { selectedEvent === event.id ? (
                                        <input
                                            type="text"
                                            name="eventName"
                                            value={ editedEvent.eventName }
                                            onChange={ handleEditChange }
                                        />
                                    ) : (
                                        event.eventName
                                    )}
                                    </td>
                                    <td>
                                    { selectedEvent === event.id ? (
                                        <textarea
                                            name="description"
                                            value={editedEvent.description}
                                            onChange={ handleEditChange }
                                        />
                                    ) : (
                                        <div className="tableCell text">
                                            { event.description }
                                        </div>
                                    )}
                                    </td>
                                    <td>
                                    { selectedEvent === event.id ? (
                                        <input
                                            type="text"
                                            name="location"
                                            value={ editedEvent.location }
                                            onChange={ handleEditChange }
                                        />
                                    ) : (
                                        event.location
                                    )}
                                    </td>
                                    <td>
                                    { selectedEvent === event.id ? (
                                        <select 
                                            name="status" 
                                            value={ editedEvent.status }
                                            onChange={ handleEditChange }
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    ) : (
                                        <StatusIndicator status = { event.status } />
                                    )}
                                    </td>
                                    <td>
                                    { selectedEvent === event.id ? (
                                        <input
                                            type="date" 
                                            name="date" 
                                            value={ editedEvent.date.slice(0, 10) }
                                            onChange={ handleEditChange }
                                        />
                                    ) : (
                                        event.date.slice(0, 10)
                                    )}
                                    </td>
                                    <td>
                                        <div className="tableCell centered">
                                        { selectedEvent === event.id ? (
                                            <>
                                                <button 
                                                    className="secondaryButton tooltip yellow"
                                                    onClick={() => handleEditConfirm(event.id)}
                                                >
                                                    <span>Confirm</span>
                                                    <FaCheck/>
                                                </button>

                                                <button 
                                                    className="secondaryButton tooltip red"
                                                    onClick={ handleEditCancel }
                                                >
                                                    <span>Cancel</span>
                                                    <FaBan/>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    className="secondaryButton tooltip"
                                                    onClick={() => handleEdit(event)}
                                                >
                                                    <span>Edit</span>
                                                    <MdEdit/>
                                                </button>

                                                <button 
                                                    className="secondaryButton tooltip red"
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                >
                                                    <span>Delete</span>
                                                    <FaTrashAlt/>
                                            </button>
                                            </>
                                            
                                        )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>

                        </table>

                    )}
                    </div>

                    <div className="dataCard-footer">
                        
                    </div>

                </div>

            </div>

            <Modal
               isOpen={ createEventModal }
               onRequestClose={ closeCreateEventModal }
               className={`${ createEventModal ? 'modal-open' : '' }`}
               overlayClassName="modalOverlay" 
            >
                { createEventModal && (
                    <CreateEvent
                        closeCreateEvent = { closeCreateEventModal }
                        setEvents = { setEvents }
                    />
                )}
            </Modal>

        </div>
    );

};

export default AdminEvents;