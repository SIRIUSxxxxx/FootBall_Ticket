// matchRoute.js
const express = require('express');
const router = express.Router();

const Match = require('../models/match.js'); // Import the Match model

// Get all matches
router.get('/getallmatch', async (req, res) => {
    try {
        const match = await Match.find({});
        res.json({ match });
    } catch (error) {
        console.error('Error fetching match:', error);
        return res.status(400).json({ message: error.message });
    }
});

// Backend Route to Update Seats
router.post('/updateSeats', async (req, res) => {
    const { matchId, totalSeats } = req.body;

    try {
        const match = await Match.findById(matchId);
        if (!match) return res.status(404).json({ message: 'Match not found' });

        match.totalSeats = totalSeats; // Update total seats
        await match.save();
        res.status(200).json({ message: 'Seats updated successfully', totalSeats });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete a match by ID
router.delete('/deletematch/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const match = await Match.findByIdAndDelete(id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.json({ message: 'Match deleted successfully' });
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).json({ message: 'Error deleting match', error: error.message });
    }
});

// Get match by ID
router.post('/getmatchbyid', async (req, res) => {
    const matchid = req.body.matchid;
    try {
        const match = await Match.findOne({ _id: matchid });
        res.send({ match });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Add new match
router.post('/addmatch', async (req, res) => {
    const {
        name, type, description, PricePerSeat, Time, Venue, TeamA, TeamB, imageurls, date
    } = req.body;

    // Check if all required fields are provided
    if (!name || !type || !description || !PricePerSeat || !Time || !Venue || !TeamA || !TeamB || !imageurls || !date) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Create a new match document
        const newMatch = new Match({
            name,
            type,
            description,
            PricePerSeat,
            Time,
            Venue,
            TeamA,
            TeamB,
            imageurls,
            date,
            currentbookings: [],  // Initialize empty array for bookings
        });

        // Save the new match to the database
        await newMatch.save();
        res.status(201).json({ message: 'Match added successfully', match: newMatch });
    } catch (error) {
        console.error('Error adding match:', error);
        res.status(500).json({ message: 'Error adding match', error: error.message });
    }
});

// Update match by ID
router.put('/updatematch/:id', async (req, res) => {
    const matchId = req.params.id;  // matchId from the URL parameter
    const updatedData = req.body;   // The updated match data

    // Log the received data for debugging
    console.log('Received matchId:', matchId);
    console.log('Received updatedData:', updatedData);

   
    try {
        const match = await Match.findByIdAndUpdate(matchId, updatedData, { new: true });
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        res.status(200).json({ message: 'Match updated successfully', match });
    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({ message: 'Error updating match', error: error.message });
    }
});


module.exports = router;
