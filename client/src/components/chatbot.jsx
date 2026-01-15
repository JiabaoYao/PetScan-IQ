import { useState } from "react";
import "./style.css"; 

// Backend API_URL
const API_URL = "http://127.0.0.1:8000/api/chat";

function Chatbot() {
    const [input, setInput] = useState('')
    const [msgs, setMsgs] = useState([{"sender": "Sam", "message": "Hello! How can I help?"}])

    const handleSend = async () => {
        if (input.trim() === "") return;
        
        const userMsg = {"sender": "User", "message": input}
        const currentInput = input

        // add user message
        setMsgs(prev => [...prev, userMsg])
        setInput('')

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({message: currentInput}),
            })

            // add robot reply
            const data = await response.json()
            setMsgs(prev => [...prev, {"sender": "Sam", "message": data.answer}])
            
        } catch(e) {
            console.error('Error:', e);
            setMsgs(prev => [...prev, {"sender": "System", "message": "Could not connect to the server."}])
        }
    };

    return (
            <div className="chatbox">
                <div className="chatbox__support">
                    <div className="chatbox__header">
                        <div className="chatbox__image--header">
                            <img src="https://img.icons8.com/color/1200/person-male.jpg" alt="Sam" />
                        </div>
                        <div className="chatbox__content--header">
                            <h4 className="chatbox__heading--header">Chat support</h4>
                        </div>
                    </div>

                    <div className="chatbox__messages">
                        {msgs.map((msg, index) => (
                            <div key={index} className={`messages__item messages__item--${msg.sender === "User" ? "visitor" : "operator"}`}>
                                <strong>{msg.sender}:</strong> {msg.message}
                            </div>
                        ))}
                    </div>

                    <div className="chatbox__footer">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            </div>
    );
}

export default Chatbot;
