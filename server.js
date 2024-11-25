const express = require('express');
const mongoose = require('./db'); // Import the mongoose instance, which connects to MongoDB
const matchRoute = require('./routes/matchRoute');
const cors = require('cors'); // Import cors
const usersRoute = require('./routes/userRoute');
const bookingRoutes = require('./routes/bookingsRoute');  // Adjust path as necessary
const matchesRouter = require('./routes/matchRoute'); // Adjust path as necessary

const app = express();

app.use(express.json());
app.use(cors());

// Use the match route
app.use('/api/match', matchRoute);  // This will handle all /api/match routes
app.use('/api/users', usersRoute);  // Ensure this is correct and points to the right path
app.use('/api/bookings', bookingRoutes);  // This will append /bookmatch to /api/bookings
app.use('/api/matches', matchesRouter);  // This makes '/getallmatch' available at '/api/matches/getallmatch'


const port = process.env.PORT || 5000;

mongoose.connection.once('open', () => {
  console.log("Database connection established.");
  
  app.listen(port, () => {
    console.log(`Node Server started on port ${port}`);
  });
});