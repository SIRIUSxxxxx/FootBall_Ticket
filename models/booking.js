//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true }, 
    matchid: { type: String, required: true },
    userid: { type: String, required: true },
    fromdate: { type: String, required: true },
    todate: { type: String, required: true },
    totalamount: { type: Number, required: true },
    totalseats: { type: Number, required: true ,default: 200},
    transactionId: { type: String, required: true },
    status: { type: String, required: true, default: 'booked' },
    selectedSeats: { type: [String], required: true },  
}, { timestamps: true });

const model = mongoose.model('booking', bookingSchema);

module.exports = model;