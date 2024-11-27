//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import LiveChat from './LiveChat'; // Import the LiveChat component

function Navbar() {
    const { t, i18n } = useTranslation();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [showChat, setShowChat] = useState(false);

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = "/login";
    }

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg">
                <a className="navbar-brand" href="/Home">
                    {t('home')}
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"><i className="fa fa-hamburger" style={{ color: 'white' }}></i></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav ml-auto d-flex align-items-center">
                        {/* Language Selector */}
                        <select onChange={(e) => changeLanguage(e.target.value)} className="form-select" style={{ maxWidth: '120px' }} defaultValue={i18n.language}>
                            <option value="en">English</option>
                            <option value="zh">簡體</option>
                            <option value="tc">繁體</option>
                        </select>

                        {/* Live Chat Button */}
                        <button
                            className="btn btn-light ms-3 p-2"
                            onClick={() => setShowChat(true)}
                            title={t('live_chat')}
                            style={{ borderRadius: "50%" }}
                        >
                            <i className="fa-solid fa-comments"></i>
                        </button>

                        {/* Conditional Rendering for User Login/Logout */}
                        {user ? (
                            <div className="dropdown ms-3">
                                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fa-solid fa-user me-2"></i> {user.name}
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="/profile">{t('profile')}</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={logout}>{t('logout')}</a></li>
                                    {user.isAdmin && (
                                        <li><a className="dropdown-item" href="/admin">{t('admin')}</a></li>
                                    )}
                                </ul>
                            </div>
                        ) : (
                            <div className="ms-3 d-flex align-items-center">
                                <a className="btn btn-primary me-2" href="/login">
                                    {t('login')}
                                </a>
                                <a className="btn btn-secondary" href="/register">
                                    {t('register')}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Live Chat */}
            {showChat && <LiveChat onClose={() => setShowChat(false)} />}
        </div>
    );
}

export default Navbar;
