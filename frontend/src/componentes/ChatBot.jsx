import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../css/ChatBot.css";

export default function ChatBotComponent() {
    const [messages, setMessages] = useState([
        { from: "bot", text: "¡Hola! Soy Help Oca 🤖. ¿En qué puedo ayudarte?" }
    ]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { from: "user", text: input }];
        setMessages(newMessages);

        try {
            const res = await axios.post("https://lidar-cush.onrender.com/api/chatbot/chat", {
                mensaje: input,
                ruta: window.location.pathname   // 👈 SE AGREGA LA RUTA ACTUAL
            });

            setMessages([
                ...newMessages,
                { from: "bot", text: res.data.respuesta }
            ]);

        } catch (error) {
            setMessages([
                ...newMessages,
                { from: "bot", text: "⚠️ Error al conectar con el servidor." }
            ]);
        }

        setInput("");
    };

    return (
        <>
            {/* Botón flotante */}
            <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
                ⁉︎
            </button>

            {/* Ventana del chat */}
            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        Help Oca 🤖
                        <button onClick={() => setIsOpen(false)}>✖</button>
                    </div>

                    <div className="chatbot-body">
                        {messages.map((msg, i) => (
                            <div key={i} className={`msg ${msg.from}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe tu mensaje..."
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button onClick={sendMessage}>Enviar</button>
                    </div>
                </div>
            )}
        </>
    );
}