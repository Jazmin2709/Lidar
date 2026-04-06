// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-primary text-white text-center py-5 mt-5">
            <div className="container">
                <p className="mb-2 fs-5">
                    © {new Date().getFullYear()} OCA Global - Todos los derechos reservados
                </p>
                <small className="opacity-75">
                    Tecnología LIDAR al servicio de infraestructuras más seguras y eficientes
                </small>
            </div>
        </footer>
    );
}