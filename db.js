//22031515d Fok Luk Hang
const mongoose = require('mongoose');

// Connection URI (make sure your credentials and cluster details are correct)
const mongoURI = 'mongodb+srv://foklukhang:foklukhang@cluster0.ougwn.mongodb.net/football-match';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});

// Exporting the mongoose instance for use in other files
module.exports = mongoose;
