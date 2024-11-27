//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

import React, { useState } from "react";
import { useTranslation } from 'react-i18next';

function LiveChat({ onClose }) {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([
        { sender: "bot", text: t('how_can_i_help') }
    ]);
    const [userInput, setUserInput] = useState("");

    // Function to handle bot responses
    const getBotResponse = (input) => {
        input = input.toLowerCase(); // Normalize input
        if (input.includes("match")) {
            return t('list_matches'); // Example response for matches
        } else if (input.includes("hi") || input.includes("hello")) {
            return t('hi_help');
        } else if (input.includes("booking")) {
            return t('booking_info');
        } else if (input.includes("cancel")) {
            return t('cancel_info');
        } else if ("Jeff"){
            return t('Jeff');
        } else {
            return t('default_reply');
        }
    };

    const handleSendMessage = () => {
        if (userInput.trim() === "") return;

        // Add user's message
        setMessages((prev) => [...prev, { sender: "user", text: userInput }]);

        // Add bot's reply
        setTimeout(() => {
            const botReply = getBotResponse(userInput);
            setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
        }, 1000);

        setUserInput(""); // Clear input
    };

    return (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{t('live_chat_support')}</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <div className="chatbox">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`d-flex mb-2 ${msg.sender === "user" ? "justify-content-end" : ""}`}
                                >
                                    <div
                                        className={`p-2 rounded ${
                                            msg.sender === "bot"
                                                ? "bg-light text-dark"
                                                : "bg-primary text-white"
                                        }`}
                                        style={{ maxWidth: "70%" }}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={t('type_message')}
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <button className="btn btn-primary" onClick={handleSendMessage}>
                            {t('send')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LiveChat;
