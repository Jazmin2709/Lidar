import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../css/ChatBot.css";

export default function ChatBotComponent() {
    const [messages, setMessages] = useState([
        { from: "bot", text: "¡Hola! Soy tu asistente virtual 🤖. ¿En qué puedo ayudarte?" }
    ]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const messagesEndRef = useRef(null); // referencia al final del chat

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom(); // cada vez que cambien los mensajes, baja al final
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { from: "user", text: input }];
        setMessages(newMessages);

        try {
            const res = await axios.post("http://localhost:3000/api/chatbot/chat", {
                mensaje: input, // ✅ backend espera 'mensaje'
            });

            setMessages([
                ...newMessages,
                { from: "bot", text: res.data.respuesta } // ✅ backend devuelve 'respuesta'
            ]);
        } catch (error) {
            setMessages([
                ...newMessages,
                { from: "bot", text: "⚠️ Error al conectar con el servidor." },
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
                        {/* marcador invisible para hacer scroll */}
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
