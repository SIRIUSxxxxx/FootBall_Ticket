//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

const express = require('express');
const mongoose = require('./db'); 
const matchRoute = require('./routes/matchRoute');
const cors = require('cors'); 
const usersRoute = require('./routes/userRoute');
const bookingRoutes = require('./routes/bookingsRoute'); 
const matchesRouter = require('./routes/matchRoute'); 

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/match', matchRoute);  // This will handle all /api/match routes
app.use('/api/users', usersRoute);  
app.use('/api/bookings', bookingRoutes);  // This will append /bookmatch to /api/bookings
app.use('/api/matches', matchesRouter);  // This makes '/getallmatch' available at '/api/matches/getallmatch'


const port = process.env.PORT || 5000;

mongoose.connection.once('open', () => {
  console.log("Database connection established.");
  
  app.listen(port, () => {
    console.log(`Node Server started on port ${port}`);
  });
});