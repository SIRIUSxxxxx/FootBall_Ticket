//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function UserDetailsPage() {
  const { userId } = useParams(); // Get userId from URL
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/getuserbyid/${userId}`)
      .then(response => {
        setUserDetails(response.data); // Set user details from response
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }, [userId]);

  if (!userDetails) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <h1>User Details</h1>
      <p><strong>Name:</strong> {userDetails.name}</p>
      <p><strong>Email:</strong> {userDetails.email}</p>
      <p><strong>Gender:</strong> {userDetails.gender}</p>
    </div>
  );
}

export default UserDetailsPage;
