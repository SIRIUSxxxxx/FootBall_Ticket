// bookingSchema.js
//22031515d Fok Luk Hang
const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },  // Reference to the Match model
    matchid: { type: String, required: true },
    userid: { type: String, required: true },
    fromdate: { type: String, required: true },
    todate: { type: String, required: true },
    totalamount: { type: Number, required: true },
    totalseats: { type: Number, required: true },
    transactionId: { type: String, required: true },
    status: { type: String, required: true, default: 'booked' },
    selectedSeats: { type: [String], required: true },  // Array of seat identifiers
}, { timestamps: true });

const model = mongoose.model('booking', bookingSchema);

module.exports = model;