import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Typography, Spin, message, Alert, Space } from 'antd';
import { CameraOutlined, EnvironmentOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import moment from 'moment';

const { Title, Text } = Typography;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const RegistroAsistencia = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [fotoCapturada, setFotoCapturada] = useState(null);
    const [ubicacion, setUbicacion] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [yaMarcado, setYaMarcado] = useState(false);
    const [errorGPS, setErrorGPS] = useState(null);

    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        if (!userId) {
            message.error("Sesión inválida. Por favor inicia sesión.");
            return;
        }
        verificarAsistencia();
        iniciarCamara();
        obtenerUbicacion();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const verificarAsistencia = async () => {
        try {
            const res = await axios.get(`${API_URL}/asistencia/verificar/${userId}`);
            if (res.data.registrado) {
                setYaMarcado(true);
            }
        } catch (error) {
            console.error("Error al verificar asistencia", error);
        }
    };

    const iniciarCamara = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                // Asegurarse de que el video se reproduzca
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                };
            }
        } catch (err) {
            console.error("Error al acceder a la cámara:", err);
            message.error("No se pudo acceder a la cámara. Por favor permite los permisos.");
        }
    };

    const obtenerUbicacion = () => {
        if (!navigator.geolocation) {
            setErrorGPS("Tu navegador no soporta geolocalización");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log("Ubicación detectada con precisión de:", pos.coords.accuracy, "metros");
                setUbicacion({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    accuracy: pos.coords.accuracy
                });
                setErrorGPS(null);
            },
            (err) => {
                console.error("Error de GPS:", err);
                setErrorGPS("No se pudo obtener la ubicación exacta. Asegúrate de otorgar permisos y tener el GPS activado.");
            },
            { 
                enableHighAccuracy: true, 
                timeout: 15000, 
                maximumAge: 0 
            }
        );
    };

    const capturarFoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (video && canvas && video.readyState === 4) { // readyState 4 = HAVE_ENOUGH_DATA
            const context = canvas.getContext('2d');
            
            // Usar dimensiones reales del stream de video
            const width = video.videoWidth;
            const height = video.videoHeight;
            
            canvas.width = width;
            canvas.height = height;
            
            // Dibujar el frame actual del video en el canvas
            context.drawImage(video, 0, 0, width, height);
            
            // Convertir a blob
            canvas.toBlob((blob) => {
                if (blob) {
                    setFotoCapturada(blob);
                    // Detener cámara para ahorrar recursos tras capturar
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }
                }
            }, 'image/jpeg', 0.8);
        } else {
            message.warning("La cámara aún se está cargando, intenta de nuevo en un segundo.");
        }
    };

    const enviarRegistro = async () => {
        if (!fotoCapturada || !ubicacion) {
            message.warning("Debes capturar la foto y tener la ubicación activa.");
            return;
        }

        console.log("Iniciando envío de registro...", { userId, hasFoto: !!fotoCapturada, hasUbicacion: !!ubicacion });
        
        // Si la precisión es baja (ej: más de 100m), pedir confirmación extra
        if (ubicacion.accuracy > 100) {
            const result = await Swal.fire({
                title: 'Precisión baja detectada',
                text: `Tu señal de GPS tiene un margen de error de ±${Math.round(ubicacion.accuracy)} metros. ¿Deseas continuar con el registro de todas formas?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Intentar mejorar señal',
                confirmButtonColor: '#1a3c6d'
            });

            if (!result.isConfirmed) return; // Se detiene si el usuario decide mejorar la señal
        }

        setCargando(true);
        try {
            // 1. Subir imagen a Cloudinary
            console.log("Subiendo imagen a Cloudinary...");
            const formData = new FormData();
            formData.append('foto', fotoCapturada, 'asistencia.jpg');
            formData.append('upload_preset', 'asistencias_lidar');
            formData.append('public_id', `asistencia_${userId}_${moment().format('YYYYMMDD_HHmmss')}`);

            const uploadRes = await axios.post(`${API_URL}/imagenes/subir`, formData);
            console.log("Respuesta subida imagen:", uploadRes.data);
            const fotoUrl = uploadRes.data.url;

            // 2. Guardar en la base de datos
            console.log("Guardando datos en la base de datos local...");
            await axios.post(`${API_URL}/asistencia/registrar`, {
                id_persona: userId,
                foto_url: fotoUrl,
                latitud: ubicacion.lat,
                longitud: ubicacion.lng
            });

            console.log("Registro completado con éxito!");
            Swal.fire({
                icon: 'success',
                title: 'Asistencia registrada',
                text: 'Tu entrada ha sido guardada correctamente.',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                setYaMarcado(true);
            });
        } catch (error) {
            console.error("ERROR CRÍTICO AL REGISTRAR:", error);
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
            
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: `No se pudo completar el registro: ${errorMsg}`,
            });
        } finally {
            setCargando(false);
        }
    };

    if (yaMarcado) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', padding: '20px' }}>
                <Card style={{ maxWidth: 400, textAlign: 'center', borderRadius: 15, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                    <CheckCircleOutlined style={{ fontSize: 60, color: '#52c41a', marginBottom: 20 }} />
                    <Title level={3}>¡Asistencia al día!</Title>
                    <Text>Ya has registrado tu asistencia por hoy. Puedes ver tu cuadrilla asignada en la sección correspondiente.</Text>
                    <div style={{ marginTop: 20 }}>
                        <Button type="primary" size="large" onClick={() => window.location.href='/dashboard'}>
                            Ir al Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
            <Card 
                title={<Title level={4} style={{ margin: 0 }}>Registro de Asistencia Diaria</Title>}
                style={{ maxWidth: 600, width: '100%', borderRadius: 15, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 20, position: 'relative', background: '#000', borderRadius: 10, overflow: 'hidden', minHeight: 300 }}>
                        {!fotoCapturada ? (
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        ) : (
                            <img 
                                src={URL.createObjectURL(fotoCapturada)} 
                                alt="Foto capturada" 
                                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 10 }} 
                            />
                        )}
                        
                        {!fotoCapturada && (
                            <div style={{ position: 'absolute', bottom: 20, width: '100%' }}>
                                <Button 
                                    type="primary" 
                                    shape="circle" 
                                    icon={<CameraOutlined />} 
                                    size="large" 
                                    onClick={capturarFoto}
                                    style={{ width: 60, height: 60, fontSize: 24, backgroundColor: 'rgba(26, 60, 109, 0.8)' }}
                                />
                            </div>
                        )}
                    </div>

                    {fotoCapturada && (
                        <Button 
                            type="dashed" 
                            style={{ marginBottom: 20 }} 
                            onClick={() => { setFotoCapturada(null); iniciarCamara(); }}
                        >
                            Tomar otra foto
                        </Button>
                    )}

                    <div style={{ textAlign: 'left', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                            <EnvironmentOutlined style={{ color: '#1a3c6d', marginRight: 10, fontSize: 20 }} />
                            <div>
                                <Text strong>Ubicación: </Text>
                                {ubicacion ? (
                                    <Space direction="vertical" size={0}>
                                        <Text type="success">Detectada ({ubicacion.lat.toFixed(4)}, {ubicacion.lng.toFixed(4)})</Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>Margen de error: ±{Math.round(ubicacion.accuracy)} metros</Text>
                                        {ubicacion.accuracy > 500 && (
                                            <Text type="warning" style={{ fontSize: '11px', display: 'block' }}>
                                                ⚠️ Precisión baja. Si estás en interiores, intenta acercarte a una ventana.
                                            </Text>
                                        )}
                                    </Space>
                                ) : errorGPS ? (
                                    <Text type="danger">{errorGPS}</Text>
                                ) : (
                                    <Spin size="small" />
                                )}
                            </div>
                        </div>
                        <Alert 
                            message="Seguridad" 
                            description="Se requiere una foto en tiempo real y tu ubicación exacta para validar tu asistencia. El registro fallará si intentas usar fotos de galería o si el GPS está desactivado." 
                            type="info" 
                            showIcon 
                        />
                    </div>

                    <Button 
                        type="primary" 
                        size="large" 
                        block 
                        loading={cargando} 
                        disabled={!fotoCapturada || !ubicacion}
                        onClick={enviarRegistro}
                        style={{ height: 50, borderRadius: 8, fontSize: 18, fontWeight: 'bold' }}
                    >
                        {cargando ? 'Procesando...' : 'Confirmar Asistencia'}
                    </Button>
                </div>
            </Card>
            {/* Canvas oculto para procesar la imagen */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default RegistroAsistencia;
