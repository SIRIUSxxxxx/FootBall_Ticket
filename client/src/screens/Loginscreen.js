//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

import React, { useState, useEffect } from "react";
import axios from "axios";
import Error from '../components/Error'; 
import Loader from '../components/Loader'; 
import { Input, Button, Checkbox, message } from 'antd';
import { useTranslation } from 'react-i18next';  // Import useTranslation

function Loginscreen() {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [rememberMe, setRememberMe] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for visibility toggle
    const { t } = useTranslation();  // Use the translation hook

    // Check if email is in localStorage when component mounts
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setemail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async () => {
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password,
            });

            // Successful login handling
            message.success('Login successful');
            localStorage.setItem('currentUser', JSON.stringify(response.data)); // Save user to localStorage

            window.location.href = "/home";  // Redirect to home after successful login

        } catch (error) {
            // If "Remember Me" is checked, save email to localStorage
            if (rememberMe) {
                setpassword('');
            } else {
                setemail('');
                setpassword('');
            }
            message.error('Invalid email or password');
            setError(true);  // Show error message if login fails
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading && (<Loader />)}
            <div className='row justify-content-center mt-5'>
                <div className="col-md-5 mt-5">
                    {error && (<Error message="Invalid Credentials" />)}
                    <div className='bs mb-3'>
                        <h2>{t('login')}</h2>

                        <div className="form-group mb-3">
                            <label htmlFor="email">{t('email')}</label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                                placeholder={t('EnterEmail')}
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="password">{t('password')}</label>
                            <Input
                                id="password"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                placeholder={t('EnterPassword')}
                                type={isPasswordVisible ? 'text' : 'password'} // Toggle type between 'text' and 'password'
                            />
                        </div>

                        {/* Password visibility toggle placed after the password field */}
                        <Button 
                            type="link" 
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            style={{ padding: 0 }}
                        >
                            {isPasswordVisible ? t('hidePassword') : t('showPassword')}
                        </Button>

                        <div className="form-group mb-3">
                            <Checkbox
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            >
                                {t('RememberMe')}
                            </Checkbox>
                        </div>

                        <Button
                            type="primary"
                            loading={loading}
                            onClick={handleLogin}
                            className="login-button"
                        >
                            {t('login')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loginscreen;
