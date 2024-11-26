//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    PricePerSeat: { type: Number, required: true },
    Time: { type: String, required: true },
    Venue: { type: String, required: true },
    TeamA: { type: String, required: true },
    TeamB: { type: String, required: true },
    imageurls: [{ type: String, required: true }],
    totalSeats: { type: Number, require: true }, // Default 200 seats
    date: { type: String, required: true },
    currentbookings: [{
        bookingid: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        fromdate: { type: String },
        todate: { type: String },
        userid: { type: String },
        status: { type: String },
        selectedSeats: [String],
    }],
}, { timestamps: true });

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;