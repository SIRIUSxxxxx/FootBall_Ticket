//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

import React, { useState } from "react"; 
import HashLoader from "react-spinners/HashLoader";
import { css } from '@emotion/react'; 

function Loader() {
    console.log("Loader is rendering"); // Log to see if the component is mounted
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");

    // Style for centering the loader
    const loaderStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        backgroundColor: '#f0f0f0' // Optional: background color
    };

    return (
        <div style={{marginTop : '150px'}}>


            <div style={loaderStyle}>
                <HashLoader color="#000" loading={loading} size={150} />
            </div>
        </div>
    );
}

export default Loader;
