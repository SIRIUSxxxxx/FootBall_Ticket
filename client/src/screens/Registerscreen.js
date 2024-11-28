//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

import React, { useState } from "react";
import axios from "axios";
import Error from '../components/Error';
import Loader from '../components/Loader';
import Success from "../components/Success";

function Registerscreen() {
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState('');
    const [birthday, setBirthday] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [profileImage, setProfileImage] = useState('');

    // Password validation pattern
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    

    // Function to check if the userId already exists
    async function checkDuplicateUserId(userId) {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/checkuser/${userId}`);
            return response.data.exists;  // Assumes 'exists' field indicates user existence
        } catch (error) {
            console.error("Error checking user ID:", error);
            return false;
        }
    }

    async function register() {
        if (!name || !email || !password || !cpassword || !nickname || !gender || !birthday || !userId) {
            setError("All fields are required!");
            return;
        }

        if (userId === 'admin') {
            setError("Admin accounts cannot be created by this registration process.");
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!passwordPattern.test(password)) {
            setError("Password must be at least 8 characters long, include at least one letter, one number, and one special character.");
            return;
        }

        if (password !== cpassword) {
            setError("Passwords do not match!");
            return;
        }

        const userIdExists = await checkDuplicateUserId(userId);
        if (userIdExists) {
            setError("User ID is already taken!");
            return;
        }

        try {
            setLoading(true);

            

            const user = {
                userId,
                name,
                email,
                password,
                nickname,
                gender,
                birthday,
                profileImage  // Now just directly passing the URL
            };

            const response = await axios.post('http://localhost:5000/api/users/register', user);
            setLoading(false);
            setSuccess(true);

            // Clear form fields
            setUserId('');
            setName('');
            setEmail('');
            setPassword('');
            setCpassword('');
            setNickname('');
            setGender('');
            setBirthday('');
            setProfileImage('');

        } catch (error) {
            setLoading(false);
            setError("Registration failed");
        }
    }

    return (
        <div>
            {loading && <Loader />}
            {error && <Error message={error} />}
            <div className="row justify-content-center mt-5">
                <div className="col-md-5 mt-5">
                    {success && <Success message='Registration Success' />}
                    <div className="bs">
                        <h2>Register</h2>
                        <input 
                            type="text" 
                            className="form-control mb-3"
                            placeholder="User ID" 
                            value={userId} 
                            onChange={(e) => setUserId(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            className="form-control mb-3"
                            placeholder="Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                        <input 
                            type="email" 
                            className="form-control mb-3"
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        <input 
                            type="password" 
                            className="form-control mb-3"
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <input 
                            type="password" 
                            className="form-control mb-3"
                            placeholder="Confirm Password" 
                            value={cpassword} 
                            onChange={(e) => setCpassword(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            className="form-control mb-3"
                            placeholder="Nickname" 
                            value={nickname} 
                            onChange={(e) => setNickname(e.target.value)} 
                        />
                        <select 
                            className="form-control mb-3"
                            value={gender} 
                            onChange={(e) => setGender(e.target.value)} 
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <input 
                            type="date" 
                            className="form-control mb-3"
                            value={birthday} 
                            onChange={(e) => setBirthday(e.target.value)} 
                        />
                        <input 
                            type="url" 
                            className="form-control mb-3"
                            placeholder="Profile Image URL" 
                            value={profileImage} 
                            onChange={(e) => setProfileImage(e.target.value)} 
                        />
                        <button className="btn btn-primary mt-3" onClick={register}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registerscreen;
