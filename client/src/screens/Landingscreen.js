//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

import React, { useEffect } from "react";
import { Link } from 'react-router-dom';

function Landingscreen() {
    useEffect(() => {
        const textElements = document.querySelectorAll('.fade-in');
        textElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 1.5}s`; // Stagger the animation
            el.classList.add('fade-in-animation');
        });
    }, []);

    return (
        <div className='row landing'>
            <div className='col-md-12 text-center'>
                <h2 className="fade-in" style={{ color: 'white', fontSize: '30px' }}>"You have to fight to reach your dream."</h2>
                <h2 className="fade-in" style={{ color: 'white', fontSize: '30px' }}>"You have to sacrifice and work hard for it."</h2>
                <h1 className="fade-in" style={{ color: 'white', fontSize: '30px' }}>~ Lionel Messi ~</h1>
                <h1 className="fade-in" style={{ color: 'white', fontSize: '150px' }}>Welcome</h1>

                <Link to='/home'>
                    <button
                        className='btn btn-primary'
                        style={{
                            padding: '20px 50px',
                            fontSize: '1.8em',
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #FF512F, #DD2476)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(255, 81, 47, 0.6)',
                            transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.1)';
                            e.target.style.boxShadow = '0 6px 25px rgba(255, 81, 47, 0.8)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 4px 20px rgba(255, 81, 47, 0.6)';
                        }}
                        onClick={(e) => {
                            const ripple = document.createElement("span");
                            ripple.classList.add("ripple");
                            e.target.appendChild(ripple);

                            ripple.style.left = `${e.clientX - e.target.offsetLeft}px`;
                            ripple.style.top = `${e.clientY - e.target.offsetTop}px`;

                            setTimeout(() => ripple.remove(), 600);
                        }}
                    >
                        Get Started
                    </button>
                </Link>

                <style>{`
                    .btn-primary {
                        background: linear-gradient(45deg, #FF512F, #DD2476);
                        color: white;
                    }

                    .btn-primary:hover {
                        background: linear-gradient(45deg, #DD2476, #FF512F);
                    }

                    .btn-primary::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        border-radius: 50px;
                        opacity: 0;
                        transition: opacity 0.4s ease, transform 0.4s ease;
                        box-shadow: 0 0 20px 20px rgba(255, 81, 47, 0.3);
                        transform: scale(0.8);
                    }

                    .btn-primary:hover::after {
                        opacity: 1;
                        transform: scale(1.2);
                    }

                    .ripple {
                        position: absolute;
                        width: 150px;
                        height: 150px;
                        background: rgba(255, 255, 255, 0.4);
                        border-radius: 50%;
                        transform: scale(0);
                        animation: ripple-animation 0.6s linear;
                    }

                    @keyframes ripple-animation {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }

                    /* Fade-In effect */
                    @keyframes fadeInEffect {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .fade-in-animation {
                        animation: fadeInEffect 1.5s ease-out forwards;
                    }

                    .fade-in {
                        opacity: 0;
                    }
                `}</style>
            </div>
        </div>
    );
}

export default Landingscreen;
