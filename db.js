//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit
//19/11/2024

const mongoose = require('mongoose');

// Connection URI
const mongoURI = 'mongodb+srv://foklukhang:foklukhang@cluster0.ougwn.mongodb.net/football-match';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});

module.exports = mongoose;
