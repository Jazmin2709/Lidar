import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
const RUTA_API = "https://lidar-cush.onrender.com/api";

export default function RoutePrivate({ requiredRole }) {
    const [isAuth, setIsAuth] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const validarToken = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                };
                const res = await axios.get(`${RUTA_API}/auth/validarToken`, config);
                if (res.status === 200) {
                    setIsAuth(true);
                }
                setUserRole(res.data.rol);
            } catch (err) {
                console.error(err);
                setIsAuth(false);
                localStorage.removeItem('token');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Su sesión ha expirado. Por favor, inicia sesión de nuevo.',
                })
            }
        };

        if (token) {
            validarToken();
        } else {
            setIsAuth(false);
        }
    }, [token]);

    if (isAuth === null) {
        return <div></div>;
    }

    console.log(userRole);

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/login" />;
    }

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};