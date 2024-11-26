//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/booking');  
const Match = require('../models/match');
const stripe = require('stripe')('sk_test_51QILyAH6tWSiTP1CET68YwbqOeaQAm6jE1zTszM2yV0D3l7wIn1X5Q0oEHWcLKBEP5pCeCYIo9cNfMquHoV418i100DBfOBV0u')
const { v4: uuidv4 } = require('uuid');

// Calculate the total days between fromdate and todate
const calculateTotalDays = (fromdate, todate) => {
    const from = new Date(fromdate);
    const to = new Date(todate);
    const timeDiff = to - from;
    return timeDiff / (1000 * 3600 * 24); 
};

router.put('/api/match/updatematch', async (req, res) => {
    const { matchId, name, type, date, venue, time, pricePerSeat, teamA, teamB, imageUrls } = req.body;
  
    if (!matchId) {
      return res.status(400).json({ message: 'Match ID is required.' });
    }
  
    try {
      const match = await Match.findById(matchId);
  
      if (!match) {
        return res.status(404).json({ message: 'Match not found.' });
      }
  
      // Update the match details
      match.name = name || match.name;
      match.type = type || match.type;
      match.date = date || match.date;
      match.venue = venue || match.venue;
      match.time = time || match.time;
      match.pricePerSeat = pricePerSeat || match.pricePerSeat;
      match.teamA = teamA || match.teamA;
      match.teamB = teamB || match.teamB;
      match.imageurls = imageUrls || match.imageurls;
  
      // Save the updated match
      await match.save();
      res.status(200).json({ message: 'Match updated successfully.' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating match details.' });
    }
  });

  router.get('/getbookingbyseat/:seatIndex', async (req, res) => {
    const { seatIndex } = req.params;
    
    try {
        const booking = await Booking.findOne({ selectedSeats: seatIndex });
        if (booking) {
            res.json(booking); // Send the booking info
        } else {
            res.status(404).json({ error: 'No booking found for this seat' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching booking by seat' });
    }
});
  

// Book a match
router.post('/bookmatch', async (req, res) => {
    console.log('Received booking data:', req.body);

    const { match, matchid, userid, fromdate, todate, totalamount, totalseats, token, selectedSeats } = req.body;

    if (!match || !matchid || !userid || !fromdate || !todate || !totalamount || !totalseats || !token || !selectedSeats) {
        return res.status(400).json({ message: 'Missing required data' });
    }

    try {
        // Retrieve the match document to get TeamA and TeamB
        const matchDetails = await Match.findById(matchid);
        if (!matchDetails) {
            return res.status(404).json({ message: 'Match not found' });
        }
        
        const { TeamA, TeamB } = matchDetails;

        // Stripe payment processing
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        });

        const payment = await stripe.charges.create({
            amount: totalamount * 100,
            currency: 'hkd',
            customer: customer.id,
            receipt_email: customer.email,
            description: 'Booking for a match',
        }, {
            idempotencyKey: uuidv4(),
        });

        if (!payment) {
            return res.status(500).json({ error: 'Payment failed', message: 'Payment not processed' });
        }

        // Calculate total days for the booking
        const totaldays = calculateTotalDays(fromdate, todate);

        // Create the new booking document, including TeamA and TeamB if required
        const newBooking = new Booking({
            match: matchDetails._id,
            matchid: matchDetails._id,
            userid,
            fromdate,
            todate,
            totalamount,
            totalseats,
            totaldays,
            transactionId: payment.id,
            selectedSeats,
            TeamA,  
            TeamB
        });

        await newBooking.save();

        // Update the match with the new booking
        matchDetails.currentbookings.push({
            bookingid: newBooking._id,
            fromdate,
            todate,
            userid,
            status: 'Booked',
            selectedSeats,
        });

        await matchDetails.save();
        return res.status(201).json({ message: 'Booking successful', booking: newBooking });

    } catch (error) {
        console.error('Error during booking:', error);
        return res.status(500).json({ message: 'Error booking match', error: error.message });
    }
});

// Get bookings by user ID
router.post("/getbookingsbyuserid", async (req, res) => {
    const { userid } = req.body;
    try {
        const bookings = await Booking.find({ userid }).populate('match');  
        res.send(bookings);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

// Cancel (delete) booking
router.delete('/cancelbooking', async (req, res) => {
    const { bookingId } = req.body;

    try {
        // Find and delete the booking
        const booking = await Booking.findByIdAndDelete(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        const match = await Match.findById(booking.matchid);
        if (match) {
            match.currentbookings = match.currentbookings.filter(b => b.bookingid.toString() !== bookingId);
            await match.save();
        }

        res.status(200).json({ message: 'Booking canceled successfully' });
    } catch (error) {
        console.error('Error canceling booking:', error);
        res.status(500).json({ error: 'Error canceling booking' });
    }
});

// Get all bookings
router.get("/getallbookings", async (req, res) => {
    try {
        const bookings = await Booking.find().populate('match');  
        res.send(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

module.exports = router;
