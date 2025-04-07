import React from 'react';
import { FaInstagram, FaFacebook } from 'react-icons/fa'; // Instala react-icons: npm install react-icons

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-4 my-4 border-top" style={{ backgroundColor: '#3483cd' }}>
            <div className="col-md-6 d-flex align-items-center">
                <a href="/" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1" aria-label="Home">
                    {/* Puedes reemplazar esto con el logo de tu empresa */}
                    <span style={{ fontSize: '24px' }}></span>
                </a>
                <span className="mb-3 mb-md-0 text-body-secondary fw-bold -dark">© {currentYear} OCA GLOBAL</span>
            </div>
            
            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li className="ms-3">
                    <a className="text-body-secondary"  href="https://www.instagram.com/yourcompany" aria-label="Instagram">
                        <FaInstagram size={24} />
                    </a>
                </li>
                <li className="ms-3">
                    <a className="text-body-secondary" href="https://www.facebook.com/yourcompany" aria-label="Facebook">
                        <FaFacebook size={24} />
                    </a>
                </li>
            </ul>
        </footer>
    );
}