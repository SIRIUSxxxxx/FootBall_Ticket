//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit 

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from 'react-spinners/HashLoader';
import Error from '../components/Error';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';  // Import useTranslation

const mongoose = require('mongoose');

function BookingScreen() {
    const { matchid, fromdate, todate } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [match, setMatch] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);  // Array to store booked seats
    const [remainingSeats, setRemainingSeats] = useState(200);
    const [isEditing, setIsEditing] = useState(false); // State to track if admin is editing
    const [editedMatch, setEditedMatch] = useState({}); // Store edited match details
    const navigate = useNavigate();
    const [language, setLanguage] = useState('en'); // 'en' for English, you can add 'cn' for Chinese or other languages
    const { t } = useTranslation();  // Use the translation hook
    const isAdmin = JSON.parse(localStorage.getItem('currentUser'))?.name === 'Admin';
    console.log('isAdmin:', isAdmin);  // Debugging line
    console.log(JSON.parse(localStorage.getItem('currentUser')));  // Debugging line
    const totalSeats = selectedSeats.length;
    useEffect(() => {
    const fetchMatch = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/match/getmatchbyid', { matchid });
            if (!response.data.match) {
                setError(true);
                return;
            }
            setMatch(response.data.match);
            const bookedSeatsArray = response.data.match.currentbookings?.reduce((acc, booking) => {
                if (Array.isArray(booking.selectedSeats)) {
                    return [...acc, ...booking.selectedSeats];
                } else {
                    console.warn('Booking has no valid selectedSeats:', booking);
                    return acc;
                }
            }, []) || [];
            setBookedSeats(bookedSeatsArray);
        } catch (error) {
            console.error("Error fetching match:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    fetchMatch();
}, [matchid]);
    const onToken = async (token) => {
        const bookingDetails = {
            matchid,
            match,
            userid: JSON.parse(localStorage.getItem('currentUser'))._id,
            fromdate,
            todate,
            totalamount: totalAmount,
            totalseats: totalSeats,
            token,
            selectedSeats,
            TeamA: match.TeamA,
            TeamB: match.TeamB,
        };
    
        console.log('Booking details:', bookingDetails);
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/bookings/bookmatch', bookingDetails);
            console.log('Booking response:', response.data);
            setLoading(false);
            Swal.fire('Congratulations!', 'You have successfully booked the match', 'success').then(result => {
                window.location.href = '/profile';
            });
        } catch (error) {
            console.error('Booking failed:', error.response || error.message);
            setLoading(false);
            Swal.fire('Something went wrong:', 'error');
        }
    };

    const handleSeatClick = async (seatIndex) => {
        if (bookedSeats.includes(seatIndex)) {
            if(isAdmin==true){
                // Find the booking associated with this seat
                const booking = await axios.get(`http://localhost:5000/api/bookings/getbookingbyseat/${seatIndex}`);
                const bookedByUser = await axios.get(`http://localhost:5000/api/users/getuserbyid/${booking.data.userid}`);
                Swal.fire({
                    title: 'This seat is already booked!',
                    text: `Seat booked by: ${bookedByUser.data.name}`,
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
            }else{
                Swal.fire({
                    title: 'This seat is already booked!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });

            }

            return;
        }
        const newSelectedSeats = [...selectedSeats];
        if (newSelectedSeats.includes(seatIndex)) {
            newSelectedSeats.splice(newSelectedSeats.indexOf(seatIndex), 1);
        } else {
            newSelectedSeats.push(seatIndex);
        }
        setSelectedSeats(newSelectedSeats);
        const remainingSeats = 200 - newSelectedSeats.length - bookedSeats.length;
        setRemainingSeats(remainingSeats);
        console.log("Selected seats after click:", newSelectedSeats);
    };
    // Helper function to get seat price based on row
    // Helper function to get seat price based on row
    const getSeatPrice = (rowLetter) => {
        const rowGroups = {
            "A": 500, "B": 500, "C": 500, "Z": 500, "Y": 500, "X": 500, // Rows priced at $500
            "D": 300, "E": 300, "F": 300, "W": 300, "V": 300, "U": 300, // Rows priced at $300
        };

        // Return the price from the rowGroups mapping or default to $200
        return rowGroups[rowLetter] || 200;
    };
    // Calculate total amount based on selected seats and their row prices
    const totalAmount = selectedSeats.reduce((total, seatIndex) => {
        const rowLetter = seatIndex.charAt(0);
        const seatPrice = getSeatPrice(rowLetter);
        return total + seatPrice;
    }, 0);
    const renderSeating = () => {
        const rows = [];
        const seatRowCount = 10;
        const numRows = match.totalSeats / 20;
    
        for (let i = 0; i < numRows; i++) {
            const topRowSeats = [];
            const bottomRowSeats = [];
            
            // Left side rows (A, B, C, ... , J)
            for (let j = 0; j < seatRowCount; j++) {
                const rowLetter = String.fromCharCode(65 + i); // A, B, C, ...
                const seatNumber = j + 1; 
                const topSeatIndex = `${rowLetter}${seatNumber}`;
                const isBooked = bookedSeats.includes(topSeatIndex);
                const isSelected = selectedSeats.includes(topSeatIndex);
                topRowSeats.push(
                    <div
                        key={topSeatIndex}
                        onClick={() => handleSeatClick(topSeatIndex)}
                        style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: isBooked ? 'red' : isSelected ? '#4CAF50' : '#f0f0f0',
                            border: '1px solid #ccc',
                            margin: '2px',
                            display: 'inline-block',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            textAlign: 'center',
                            lineHeight: '30px',
                            fontSize: '12px',
                            color: isSelected ? '#fff' : '#aaa',
                        }}
                    >
                        {isBooked ? 'Booked' : isSelected ? 'Selected' : topSeatIndex}
                    </div>
                );
            }
    
            // Right side rows (Z, Y, X, ..., K)
            for (let j = 0; j < seatRowCount; j++) {
                const rowLetter = String.fromCharCode(90 - i); // Z, Y, X, ..., K
                const seatNumber = j + 1;
                const bottomSeatIndex = `${rowLetter}${seatNumber}`;
                const isBooked = bookedSeats.includes(bottomSeatIndex);
                const isSelected = selectedSeats.includes(bottomSeatIndex);
    
                bottomRowSeats.push(
                    <div
                        key={bottomSeatIndex}
                        onClick={() => handleSeatClick(bottomSeatIndex)}
                        style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: isBooked ? 'red' : isSelected ? '#4CAF50' : '#f0f0f0',
                            border: '1px solid #ccc',
                            margin: '2px',
                            display: 'inline-block',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            textAlign: 'center',
                            lineHeight: '30px',
                            fontSize: '12px',
                            color: isSelected ? '#fff' : '#aaa',
                        }}
                    >
                        {isBooked ? 'Booked' : isSelected ? 'Selected' : bottomSeatIndex}
                    </div>
                );
            }
    
            rows.push(
                <div key={i} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {topRowSeats}
                    </div>
                    <div style={{ width: '100px', height: '30px', backgroundColor: '#e0e0e0' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {bottomRowSeats}
                    </div>
                </div>
            );
        }
    
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '80%', height: '30px', backgroundColor: '#3c763d', marginBottom: '20px' }}>
                    <h3 style={{ textAlign: 'center', color: '#fff' }}>Football Field</h3>
                </div>
                {rows}
            </div>
        );
    };
    const handleSaveChanges = async () => {
        try {
            if (!match._id || !editedMatch) {
                throw new Error('Match ID or updated data is missing');
            }
            // Send the PUT request to the backend with the updated match details
            const response = await axios.put(
                `http://localhost:5000/api/match/updatematch/${match._id}`,
                editedMatch
            );
            console.log('Match updated successfully:', response.data);
            // Set isEditing to false after saving
            setIsEditing(false);
            // Update the match state with the newly updated match data
            setMatch({
                ...match,
                TeamA: editedMatch.TeamA,
                TeamB: editedMatch.TeamB,
                date: editedMatch.date,
                Venue: editedMatch.venue,
            });
    
            Swal.fire('Match updated successfully!', '', 'success');
        } catch (error) {
            console.error('Error updating match:', error);
            Swal.fire('Error updating match:', error.message, 'error');
        }
    };
    
    const handleEditClick = () => {
        setIsEditing(true);
        setEditedMatch({
            TeamA: match.TeamA,
            TeamB: match.TeamB,
            date: match.date,
            venue: match.Venue,
        });
    };


    return (
        <div className="m-5">
            {loading ? (
                <h1><Loader /></h1>
            ) : error ? (
                <h1><Error /></h1>
            ) : match ? (
                <div>
                    <div className="row justify-content-center mt-5 bs">
                        <div className="col-md-5">
                            <h1>{match.name}</h1>
                            {renderSeating()}
                        </div>
                        <div className="col-md-5">
                            <div style={{ textAlign: 'right' }}>
                                <h2>{t('matchDetails')}</h2>
                                <h2>----------------------------</h2>
                                <b>
                                    <p>{t('teams')}: {isEditing ? 
                                        <input 
                                            type="text" 
                                            value={editedMatch.TeamA} 
                                            onChange={(e) => setEditedMatch({...editedMatch, TeamA: e.target.value})} 
                                        /> 
                                        : match.TeamA} 
                                        vs 
                                        {isEditing ? 
                                        <input 
                                            type="text" 
                                            value={editedMatch.TeamB} 
                                            onChange={(e) => setEditedMatch({...editedMatch, TeamB: e.target.value})} 
                                        /> 
                                        : match.TeamB}
                                    </p>
                                    <p>{t('eventDate')}: {isEditing ? 
                                        <input 
                                            type="date" 
                                            value={editedMatch.date} 
                                            onChange={(e) => setEditedMatch({...editedMatch, date: e.target.value})} 
                                        /> 
                                        : match.date}
                                    </p>
                                    <p>{t('venue')}: {isEditing ? 
                                    <input 
                                        type="text" 
                                        value={editedMatch.venue} 
                                        onChange={(e) => setEditedMatch({...editedMatch, venue: e.target.value})} 
                                    /> 
                                    : match.Venue}
                                </p>
                                    <p>{t('selectedSeats')}: {selectedSeats.length > 0 ? selectedSeats.join(', ') : t('noSeatsSelected')}</p>
                                    <p>{t('totalSeats')}: {isEditing ? 
                                        <input
                                        type="number"
                                        value={editedMatch.totalSeats}
                                        onChange={(e) => {
                                            const newTotalSeats = parseInt(e.target.value);
                                            if (newTotalSeats <= 280) {
                                                setEditedMatch({ ...editedMatch, totalSeats: newTotalSeats });
                                            } else {
                                                setEditedMatch({ ...editedMatch, totalSeats: 280 });  // Set to 280 if exceeded
                                            }
                                        }}
                                    />
                                        : match.totalSeats}
                                    </p>
                                </b>
                            </div>
    
                            {isAdmin && !isEditing && (
                                <div style={{ textAlign: 'right' }}>
                                    <button className="btn btn-warning" onClick={handleEditClick}>
                                        {t('edit')}
                                    </button>
                                </div>
                            )}
    
                            {isAdmin && isEditing && (
                                <div style={{ textAlign: 'right' }}>
                                    <button className="btn btn-success" onClick={handleSaveChanges}>
                                        {t('saveChanges')}
                                    </button>
                                </div>
                            )}
    
                            <div style={{ textAlign: 'right' }}>
                                <b>
                                    <p>----------------------------</p>
                                    <p>{t('pricePerSeat')} {t('row 1 - 3 ')}: ${match.PricePerSeat}</p>
                                    <p>{t('pricePerSeat')} {t('row 4 - 7 ')}: ${match.PricePerSeat - 200}</p>
                                    <p>{t('pricePerSeat')} {t('row 8 - 10 ')}: ${match.PricePerSeat - 300}</p>
                                    <p>{t('totalAmount')}: ${totalAmount}</p>
                                    <StripeCheckout
                                        token={onToken}
                                        stripeKey="pk_test_51QILyAH6tWSiTP1CVvFbr6IgR7IG2ILZ96R8gNWqQ4zQV7NqOltkWRzgzeemDvd3oHSO34aQKMBHriOQXOpGInPK00uVkhN6qq"
                                        amount={totalAmount * 100}  // Stripe expects amount in cents
                                        name={match.name}
                                    >
                                        <button className="btn btn-warning">
                                            {t('payNow')}
                                        </button>
                                    </StripeCheckout>
                                </b>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );

    
}

export default BookingScreen;