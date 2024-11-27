//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit
import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homescreen from './screens/Homescreen';
import BookingScreen from './screens/Bookingscreen';
import RegisterScreen from './screens/Registerscreen';
import Loginscreen from './screens/Loginscreen';
import Profilescreen from './screens/Profilescreen';
import Adminscreen from './screens/Adminscreen';
import Landingscreen from './screens/Landingscreen';
import UserDetailsPage from './screens/UserDetailPage';
import './i18n'; // Correct import of i18n.js

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/home' element={<Homescreen />} />
          <Route path="/book/:matchid/:fromdate/:todate" element={<BookingScreen />} />
          <Route path="/register" element={<RegisterScreen/>} />
          <Route path="/Login" element={<Loginscreen/>} />
          <Route path="/profile" element={<Profilescreen/>} />
          <Route path="/admin" element={<Adminscreen/>} />
          <Route path="/user/:userId" element={<UserDetailsPage />} />
          <Route path="/" element={<Landingscreen/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
