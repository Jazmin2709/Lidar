// src/componentes/ChatBot.jsx
import React, { useState } from 'react';

// Componente de ChatBot flotante
const ChatBotComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: '¡Hola! Soy tu asistente virtual 🤖. ¿En qué puedo ayudarte?' }
    ]);
    const [input, setInput] = useState('');

    // Manejar envío de mensajes
    const handleSend = () => {
        if (!input.trim()) return;

        // Agregar mensaje del usuario
        setMessages([...messages, { from: 'user', text: input }]);

        // Respuesta simple del bot
        setTimeout(() => {
            setMessages(prev => [...prev, { from: 'bot', text: 'Entendido ✅. Estoy procesando tu solicitud.' }]);
        }, 1000);

        setInput('');
    };

    return (
        <div>
            {/* Botón flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontSize: '24px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
            >
                💬
            </button>

            {/* Ventana del chat */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '90px',
                        right: '20px',
                        width: '300px',
                        height: '400px',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    {/* Encabezado */}
                    <div
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '10px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}
                    >
                        ChatBot
                    </div>

                    {/* Mensajes */}
                    <div
                        style={{
                            flex: 1,
                            padding: '10px',
                            overflowY: 'auto'
                        }}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '10px',
                                    textAlign: msg.from === 'user' ? 'right' : 'left'
                                }}
                            >
                                <span
                                    style={{
                                        display: 'inline-block',
                                        padding: '8px 12px',
                                        borderRadius: '15px',
                                        backgroundColor: msg.from === 'user' ? '#DCF8C6' : '#F1F0F0',
                                        maxWidth: '80%'
                                    }}
                                >
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div style={{ display: 'flex', borderTop: '1px solid #ccc' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            style={{
                                flex: 1,
                                border: 'none',
                                padding: '10px'
                            }}
                            placeholder="Escribe un mensaje..."
                        />
                        <button
                            onClick={handleSend}
                            style={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                padding: '10px 15px',
                                cursor: 'pointer'
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBotComponent;
