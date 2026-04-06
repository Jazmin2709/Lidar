
// ────────────────────────────────────────────────
//               IMPORTACIONES PRINCIPALES
// ────────────────────────────────────────────────

// React y sus hooks más utilizados en este componente
import React, { useRef, useState, useEffect } from 'react';

// Librería para hacer peticiones HTTP al backend
import axios from 'axios';

// Librería para mostrar alertas bonitas y personalizables
import Swal from 'sweetalert2';

// Estilos específicos de esta página
import './../css/PagInicio.css';

// Componente de la barra de navegación superior (probablemente fija)
import BarraNavInicio from '../navigation/BarraNavInicio';

// Componente del pie de página (footer)
import Footer from '../componentes/Footer';

// ────────────────────────────────────────────────
//          CONFIGURACIÓN DE LA API (BACKEND)
// ────────────────────────────────────────────────

// URL base donde está corriendo el backend (en desarrollo)
// En producción esto debería venir de una variable de entorno:
// process.env.REACT_APP_API_URL || 'https://api.tudominio.com'
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// ────────────────────────────────────────────────
//              IMPORTACIÓN DE IMÁGENES
// ────────────────────────────────────────────────
// Todas las imágenes que se usan en la página se importan aquí
// Esto permite que Vite/Webpack las procese, optimice y genere las rutas correctas

import datosImagen         from '/src/assets/img/Datos.jpg';          // Probablemente usada en sección "Misión"
import grupo2Imagen        from '/src/assets/img/grupo2.jpg';         // Usada en sección "Quiénes somos" o "Visión"
import beneficiosImagen    from '/src/assets/img/Beneficios.jpg';     // Sección Beneficios del LIDAR
import herramientasImagen  from '/src/assets/img/Herramientas.jpg';   // Sección Tecnología y software
import lidarImagen         from '/src/assets/img/LIDAR.webp';         // Imagen explicativa de qué es LIDAR
import imagesImagen        from '/src/assets/img/images.png';         // Imagen representativa de la empresa OCA
import inspeccionImagen    from '/src/assets/img/inspeccion.png';     // Icono o foto de inspección
import certificacionImagen from '/src/assets/img/certificacion.jpg';  // Icono o foto de certificación
import comunicacionesImagen from '/src/assets/img/comunicaciones.jpg'; // Icono o foto relacionada con telecomunicaciones

export default function PagInicio() {
  // ────────────────────────────────────────────────
  //           REFERENCIAS A SECCIONES DE LA PÁGINA
  // ────────────────────────────────────────────────
  // Se usan useRef para poder acceder directamente al elemento DOM
  // de cada sección importante, principalmente para dos propósitos:
  // 1. Hacer scroll suave hacia esa sección desde la navbar
  // 2. Observarlas con IntersectionObserver para animaciones

  const misionRef       = useRef(null);     // → sección "Nuestra Misión"
  const quienesRef      = useRef(null);     // → sección "¿Quiénes Somos?"
  const visionRef       = useRef(null);     // → sección "Nuestra Visión"
  const lidarRef        = useRef(null);     // → sección "¿Qué es LIDAR?"
  const aplicacionesRef = useRef(null);     // → sección "Aplicaciones del Proyecto LIDAR"
  const beneficiosRef   = useRef(null);     // → sección "Beneficios del uso de LIDAR"
  const tecnologiaRef   = useRef(null);     // → sección "Tecnología y software utilizados"

  // ────────────────────────────────────────────────
  //       FUNCIÓN PARA SCROLL SUAVE CON OFFSET
  // ────────────────────────────────────────────────
  // Esta función es pasada a la barra de navegación (BarraNavInicio)
  // para que al hacer clic en un enlace del menú, la página baje suavemente
  // hasta la sección correspondiente, dejando espacio para la navbar fija

  const scrollTo = (ref) => {
    // Verificamos que la referencia exista y tenga un elemento DOM asociado
    if (ref && ref.current) {
      // Altura aproximada de la navbar fija (ajusta este valor según tu diseño)
      const navbarHeight = 80;           // en píxeles

      // Margen extra para que no quede pegado justo debajo de la navbar
      const yOffset = -navbarHeight - 30; // -80 - 30 = -110px

      // Calculamos la posición real de la sección respecto al documento
      // getBoundingClientRect().top → distancia desde la parte superior visible
      // window.pageYOffset → cuánto se ha hecho scroll hasta ahora
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;

      // Hacemos scroll suave hacia esa posición Y
      window.scrollTo({
        top: y,
        behavior: 'smooth'   // ← efecto suave nativo del navegador
      });
    }
  };

  // ────────────────────────────────────────────────
  //   OBSERVER PARA ANIMACIONES AL ENTRAR EN PANTALLA
  // ────────────────────────────────────────────────
  // useEffect sin dependencias → se ejecuta solo una vez al montar el componente

  useEffect(() => {
    // Creamos una instancia de IntersectionObserver
    // Este API observa cuándo los elementos entran/salen del viewport
    const observer = new IntersectionObserver(
      // Callback que se ejecuta cada vez que cambia la visibilidad
      (entries) => {
        entries.forEach((entry) => {
          // Si el elemento está visible (intersectando) al menos un 15%
          if (entry.isIntersecting) {
            // Agregamos la clase 'visible' → activa animaciones CSS
            // (fade-in, slide-up, etc. definidas en PagInicio.css)
            entry.target.classList.add('visible');
          }
          // Nota: aquí NO se quita la clase al salir.
          // Esto es intencional: la animación solo se reproduce una vez.
        });
      },
      {
        // Umbral: 15% del elemento debe estar visible para disparar
        threshold: 0.15,

        // Margen negativo abajo → la animación empieza un poco antes
        // de que el elemento llegue al borde inferior de la pantalla
        rootMargin: '0px 0px -10% 0px'
      }
    );

    // Array con todas las referencias a las secciones que queremos animar
    const sections = [
      misionRef.current,
      quienesRef.current,
      visionRef.current,
      lidarRef.current,
      aplicacionesRef.current,
      beneficiosRef.current,
      tecnologiaRef.current,
    ].filter(Boolean); // .filter(Boolean) elimina null/undefined

    // Empezamos a observar cada sección
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    // Cleanup: muy importante para evitar memory leaks
    // Cuando el componente se desmonta, dejamos de observar
    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);   // ← array vacío = solo al montar


// ──────────────────────────────────────────────────────────
//                          LOGIN 
// ──────────────────────────────────────────────────────────

// Estado que guarda los datos que el usuario escribe en el formulario de login
const [loginData, setLoginData] = useState({
  Documento: '',     // Número de documento (cédula, pasaporte, etc.)
  Contrasena: ''     // Contraseña
});

// Estado para mostrar/ocultar la contraseña en el campo (ícono de ojo)
const [showLoginPassword, setShowLoginPassword] = useState(false);


// Handler que se ejecuta cada vez que el usuario escribe en algún input del login
const handleLoginChange = (e) => {
  const { name, value } = e.target;

  let newValue = value;

  // Limpieza especial para el campo Documento: solo permite números
  // (evita que el usuario pegue letras o caracteres extraños)
  if (name === 'Documento') {
    newValue = newValue.replace(/\D/g, '');   // \D = cualquier cosa que NO sea dígito
  }

  // Actualizamos el estado con el nuevo valor
  setLoginData((prev) => ({ ...prev, [name]: newValue }));
};


// Handler principal: se ejecuta cuando el usuario hace clic en "Ingresar"
const handleLoginSubmit = async (e) => {
  e.preventDefault();   // Evita que la página se recargue (comportamiento por defecto de <form>)

  try {
    // Enviamos los datos al backend mediante POST
    const res = await axios.post(`${API_URL}/auth/ingresar`, loginData);

    // Si el servidor responde con status 200 → login exitoso
    if (res.status === 200) {
      // Guardamos la información importante en localStorage
      // (esto permite mantener la sesión aunque se recargue la página)
      localStorage.setItem('token', res.data.token);            // JWT o token de autenticación
      localStorage.setItem('userRol', String(res.data.rol));    // Rol numérico (1,2,3)
      localStorage.setItem('userName', res.data.usuario.nombre);// Nombre del usuario
      localStorage.setItem('userId', String(res.data.usuario.id)); // ID del usuario

      const rol = res.data.rol;

      // Mostramos alerta de éxito (desaparece sola después de 1.8 segundos)
      Swal.fire({
        icon: 'success',
        title: res.data.message,          // Ej: "Bienvenido Juan"
        timer: 1800,
        showConfirmButton: false,
      }).then(() => {
        // Después de que la alerta se cierre, manejamos el cierre del modal y redirección

        const modalEl = document.getElementById('loginModal');

        // Caso raro: si por alguna razón no encontramos el modal en el DOM
        if (!modalEl) {
          redirectByRole(rol);   // redirigimos directamente
          return;
        }

        // Obtenemos la instancia del modal de Bootstrap 5
        const modal = window.bootstrap.Modal.getInstance(modalEl);

        // Si no hay instancia activa (otro caso raro)
        if (!modal) {
          redirectByRole(rol);
          return;
        }

        // Definimos qué hacer cuando el modal termine de cerrarse completamente
        const onHidden = () => {
          // Limpieza manual/agresiva del backdrop y estado modal-open
          // (a veces Bootstrap 5 deja residuos si hay animaciones rápidas o errores)
          document.body.classList.remove('modal-open');
          document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

          // Ahora sí redirigimos según el rol
          redirectByRole(rol);

          // Eliminamos este listener para no acumularlos
          modalEl.removeEventListener('hidden.bs.modal', onHidden);
        };

        // Registramos el evento (solo una vez gracias a { once: true })
        modalEl.addEventListener('hidden.bs.modal', onHidden, { once: true });

        // Iniciamos el cierre animado del modal
        modal.hide();
      });
    }

  } catch (err) {
    // Manejo de errores (credenciales incorrectas, servidor caído, etc.)
    Swal.fire({
      icon: 'error',
      title: 'Error al ingresar',
      text: err.response?.data?.message || 'Credenciales inválidas',
    });
  }
};


// Función auxiliar que decide a qué página redirigir según el rol del usuario
// Se llama después de cerrar el modal o directamente si no hay modal
const redirectByRole = (rol) => {
  switch (rol) {
    case 1:
      window.location.href = '/supervisor/dashboard';   // Rol supervisor
      break;
    case 2:
      window.location.href = '/IndexEmpleado';          // Rol empleado
      break;
    case 3:
      window.location.href = '/admin/dashboard';        // Rol administrador
      break;
    default:
      window.location.href = '/';                       // Rol desconocido → home
      break;
  }
};

// ──────────────────────────────────────────────────────────
//                          REGISTRO
// ──────────────────────────────────────────────────────────


// Estado principal que contiene TODOS los campos del formulario de registro
const [registerData, setRegisterData] = useState({
  Nombres: '',
  Apellidos: '',
  Correo: '',
  Tipo_Doc: '',           // CC, PA, PP, etc.
  Cedula: '',
  Celular: '',
  Contrasena: '',
  ConfirmarContrasena: '',
  agreeTerms: false,      // Checkbox de aceptación de términos
});


// Estados para mostrar/ocultar las contraseñas (dos campos distintos)
const [showRegPassword, setShowRegPassword] = useState(false);
const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);


// Handler que se ejecuta cada vez que el usuario escribe o cambia algo en el form
const handleRegisterChange = (e) => {
  const { name, value, type, checked } = e.target;

  // Caso especial: el checkbox de términos
  if (type === 'checkbox') {
    setRegisterData((prev) => ({ ...prev, [name]: checked }));
    return;
  }

  let newValue = value;

  // Validaciones en tiempo real (mientras escribe) → evitan entradas inválidas
  // Si no pasa la validación → NO actualizamos el estado (el input se queda igual)

  // Nombres y Apellidos → solo letras (incluyendo acentos) y espacios
  if ((name === 'Nombres' || name === 'Apellidos') && 
      !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(newValue)) {
    return;
  }

  // Cédula → solo números, máximo 15 dígitos
  if (name === 'Cedula' && 
      (!/^\d*$/.test(newValue) || newValue.length > 15)) {
    return;
  }

  // Celular → solo números, máximo 10 dígitos
  if (name === 'Celular' && 
      (!/^\d*$/.test(newValue) || newValue.length > 10)) {
    return;
  }

  // Contraseñas → NO permiten espacios
  if ((name === 'Contrasena' || name === 'ConfirmarContrasena') && 
      /\s/.test(newValue)) {
    return;
  }

  // Si pasó todas las validaciones → actualizamos el estado
  setRegisterData((prev) => ({ ...prev, [name]: newValue }));
};


// Handler principal: se ejecuta al hacer clic en "Enviar Registro"
const handleRegisterSubmit = async (e) => {
  e.preventDefault();

  // Extraemos todos los valores para validación final
  const { Nombres, Apellidos, Correo, Tipo_Doc, Cedula, Celular, Contrasena, ConfirmarContrasena, agreeTerms } = registerData;

  // ── VALIDACIONES FINALES (más estrictas que las en tiempo real) ──

  const regexNombre    = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
  const regexCorreo    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;

  // Nombre y Apellido: mínimo 2 caracteres, solo letras y espacios
  if (!Nombres.trim() || Nombres.trim().length < 2 || !regexNombre.test(Nombres.trim())) {
    return Swal.fire('Error', 'El nombre debe tener al menos 2 letras y solo letras y espacios.', 'error');
  }
  if (!Apellidos.trim() || Apellidos.trim().length < 2 || !regexNombre.test(Apellidos.trim())) {
    return Swal.fire('Error', 'El apellido debe tener al menos 2 letras y solo letras y espacios.', 'error');
  }

  // Correo válido
  if (!regexCorreo.test(Correo.trim())) {
    return Swal.fire('Error', 'Correo inválido.', 'error');
  }

  // Cédula: entre 5 y 15 dígitos numéricos
  if (!/^\d{5,15}$/.test(Cedula.trim())) {
    return Swal.fire('Error', 'La cédula debe tener entre 5 y 15 números.', 'error');
  }

  // Celular: exactamente 10 dígitos (formato Colombia típico)
  if (!/^\d{10}$/.test(Celular.trim())) {
    return Swal.fire('Error', 'El celular debe tener 10 números.', 'error');
  }

  // Contraseña: mínimo 8 caracteres, mayúscula, minúscula, número y símbolo
  if (!regexContrasena.test(Contrasena)) {
    return Swal.fire('Error', 'La contraseña no cumple los requisitos.', 'error');
  }

  // Contraseñas coinciden
  if (Contrasena !== ConfirmarContrasena) {
    return Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
  }

  // Aceptó términos
  if (!agreeTerms) {
    return Swal.fire('Error', 'Debes aceptar los términos.', 'error');
  }

  try {
    // Enviamos los datos al backend
    const res = await axios.post(`${API_URL}/auth/registrar`, registerData);

    if (res.status === 200) {
      Swal.fire({
        icon: 'success',
        title: res.data.message,   // Ej: "Usuario registrado exitosamente"
      }).then(() => {
        // Cerramos el modal de registro
        const modal = window.bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        if (modal) modal.hide();

        // Limpiamos TODO el formulario para la próxima vez
        setRegisterData({
          Nombres: '', Apellidos: '', Correo: '', Tipo_Doc: '', Cedula: '', Celular: '',
          Contrasena: '', ConfirmarContrasena: '', agreeTerms: false,
        });
      });
    }
  } catch (err) {
    Swal.fire('Error', err.response?.data?.message || 'Error al registrar.', 'error');
  }
};


// ── useEffect 1: Abrir modal de login automáticamente desde URL ──
// Ejemplo: si entran con ?open=login → abre el modal de login
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('open') === 'login') {
    setTimeout(() => {
      const modal = new window.bootstrap.Modal(document.getElementById('loginModal'));
      modal.show();
      
      // Limpiamos la URL para que quede limpia (sin ?open=login)
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 300); // pequeño retraso para que el DOM esté listo
  }
}, []);  // solo al montar


// ── useEffect 2: Limpieza agresiva de backdrop y modal-open ──
// Soluciona problemas comunes de Bootstrap 5 cuando se abren/cierra varios modales rápido
useEffect(() => {
  let timeoutId;

  const cleanBackdrop = (event) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      // Solo limpiamos si NO hay NINGÚN modal abierto
      const openModals = document.querySelectorAll('.modal.show');
      
      if (openModals.length === 0) {
        document.body.classList.remove('modal-open');
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
      // Si hay modales abiertos → dejamos el backdrop (para el siguiente modal)
    }, 350); // 350ms → da tiempo a que termine la animación de cierre
  };

  // Escuchamos cada vez que un modal se cierra completamente
  document.addEventListener('hidden.bs.modal', cleanBackdrop);

  // Cleanup al desmontar el componente
  return () => {
    document.removeEventListener('hidden.bs.modal', cleanBackdrop);
    clearTimeout(timeoutId);
  };
}, []);

// ──────────────────────────────────────────────────────────
//                  RECUPERAR CONTRASEÑA
// ──────────────────────────────────────────────────────────

// Obtenemos el correo que quedó guardado en localStorage 
// (normalmente se guarda después de enviar el correo de recuperación en el paso anterior)
const correo = localStorage.getItem('correo');

// Estado que contiene los datos del formulario de recuperación
const [recoverData, setRecoverData] = useState({
  Correo: correo || '',           // Viene prellenado desde localStorage (o vacío)
  Codigo: '',                     // Código de 6 dígitos que llegó por email
  NuevaContrasena: '',
  ConfirmarContrasena: ''
});

// Estados para mostrar/ocultar las dos contraseñas (nueva y confirmar)
const [showNueva, setShowNueva] = useState(false);
const [showConfirmar, setShowConfirmar] = useState(false);


// Handler simple: actualiza el estado cada vez que el usuario escribe en cualquier campo
const handleRecoverChange = (e) => {
  const { name, value } = e.target;
  setRecoverData((prevState) => ({
    ...prevState,
    [name]: value,
  }));
};


// Handler principal: se ejecuta al enviar el formulario de recuperación
const handleRecoverSubmit = async (event) => {
  event.preventDefault();

  // Validación básica frontend: las dos contraseñas deben coincidir
  if (recoverData.NuevaContrasena !== recoverData.ConfirmarContrasena) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Las contraseñas no coinciden',
    });
    return;  // ← detenemos el envío si no coinciden
  }

  try {
    // Enviamos los 4 campos al backend
    const response = await axios.post(`${API_URL}/auth/recuperarContrasena`, recoverData);

    // Si todo salió bien (status 200)
    if (response.status === 200) {
      Swal.fire({
        icon: 'success',
        title: response.data.message,     // Ej: "Contraseña actualizada correctamente"
        timer: 2500,                      // Se cierra sola a los 2.5 segundos
        showConfirmButton: false,
      }).then(() => {
        // Limpiamos el correo guardado (ya no lo necesitamos)
        localStorage.removeItem('correo');

        // Cerramos el modal de recuperación
        const recoverModalEl = document.getElementById('recoverPasswordModal');
        const recoverModal = window.bootstrap.Modal.getInstance(recoverModalEl);
        if (recoverModal) recoverModal.hide();

        // Pequeño retraso para que termine la animación de cierre del modal
        // (evita que se abra el siguiente modal antes de que desaparezca el backdrop)
        setTimeout(() => {
          // Abrimos automáticamente el modal de login para que el usuario inicie sesión
          const loginModalEl = document.getElementById('loginModal');
          const loginModal = new window.bootstrap.Modal(loginModalEl);
          loginModal.show();
        }, 400);  // 400 ms → valor empírico, ajustable si ves problemas de timing
      });
    }
  } catch (error) {
    // Manejo de errores (código inválido, expirado, servidor caído, etc.)
    console.error('Error al recuperar contraseña:', error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Ocurrió un error inesperado',
    });
  }
};

// ──────────────────────────────────────────────────────────
//                       ENVIAR CORREO
// ──────────────────────────────────────────────────────────
// Este es el primer paso del proceso de recuperación de contraseña:
// El usuario ingresa su correo → el backend envía un código por email
// → se abre automáticamente el modal para ingresar el código

// Estado que guarda el correo que el usuario escribe en el modal
const [Usuario, setUsuario] = useState({ Correo: '' });

// Estados para manejar la interfaz durante el proceso
const [loading, setLoading]       = useState(false);     // → muestra spinner y deshabilita botón mientras se envía
const [bloqueado, setBloqueado]   = useState(false);     // → bloquea el botón si el backend detecta abuso (rate limit)
const [tiempoRestante, setTiempoRestante] = useState(0); // → contador en segundos para mostrar cuánto falta para desbloquear


// Handler muy simple: actualiza el estado cada vez que el usuario escribe en el input de correo
const handleInputChange = (event) => {
  setUsuario({
    ...Usuario,
    [event.target.name]: event.target.value,
  });
};


// useEffect que maneja el contador regresivo cuando hay tiempo de espera
// Se activa cada vez que cambia tiempoRestante
useEffect(() => {
  let intervalo;

  // Solo creamos el intervalo si hay tiempo restante > 0
  if (tiempoRestante > 0) {
    intervalo = setInterval(() => {
      setTiempoRestante(prev => {
        // Cuando llega a 1 o menos → terminamos
        if (prev <= 1) {
          clearInterval(intervalo);
          setBloqueado(false);   // ← desbloqueamos el botón
          return 0;
        }
        // Restamos 1 segundo
        return prev - 1;
      });
    }, 1000); // cada 1000 ms = 1 segundo
  }

  // Cleanup importante: evitamos que queden intervalos corriendo si el componente se desmonta
  // o si tiempoRestante cambia rápidamente
  return () => clearInterval(intervalo);
}, [tiempoRestante]); // dependencia → se re-ejecuta cuando tiempoRestante cambia


// Función auxiliar para convertir segundos a formato legible MM:SS
// Ejemplos: 125 → "2:05"    59 → "0:59"    360 → "6:00"
const formatoTiempo = (seg) => {
  const min = Math.floor(seg / 60);
  const sec = seg % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`; // agrega cero a la izquierda si segundos < 10
};


// Handler principal: se ejecuta al presionar "Enviar Correo" en el modal
const handleSendEmailSubmit = async (event) => {
  event.preventDefault();          // evita recarga de página
  setLoading(true);                // activa spinner + deshabilita botón

  try {
    // Enviamos el correo al endpoint del backend
    const response = await axios.post(`${API_URL}/auth/enviarCorreo`, Usuario);

    // Respuesta exitosa
    if (response.status === 200) {
      // Guardamos el correo en localStorage para prellenarlo en el siguiente modal
      localStorage.setItem('correo', response.data.correo);

      // Mostramos alerta de éxito (desaparece sola a los 3 segundos)
      Swal.fire({
        icon: 'success',
        title: response.data.message,   // Ej: "Código enviado correctamente"
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
        // Cerramos el modal actual (el de enviar correo)
        const modal = window.bootstrap.Modal.getInstance(document.getElementById('sendEmailModal'));
        if (modal) modal.hide();

        // Pequeño retraso para que termine la animación de cierre
        // y no queden problemas visuales con el backdrop
        setTimeout(() => {
          // Abrimos automáticamente el modal donde se ingresa el código + nueva contraseña
          const recoverModal = new window.bootstrap.Modal(document.getElementById('recoverPasswordModal'));
          recoverModal.show();
        }, 500); // 500 ms → valor común, ajustable si ves superposición de modales
      });
    }
  } catch (error) {
    // Capturamos el error y vemos qué tipo es

    const status = error.response?.status;
    const message = error.response?.data?.message || 'Error del servidor';

    // Caso especial: error 429 → Too Many Requests (rate limiting del backend)
    if (status === 429) {
      Swal.fire({
        icon: 'warning',
        title: 'Demasiadas solicitudes',
        text: message,   // Ej: "Espera 5 minutos antes de intentar de nuevo"
      });

      // Intentamos extraer los minutos del mensaje con regex
      const match = message.match(/espera\s+(\d+)/i);
      if (match && match[1]) {
        const minutos = parseInt(match[1]);
        const segundos = minutos * 60;
        setBloqueado(true);           // bloqueamos el botón
        setTiempoRestante(segundos);  // iniciamos el contador
      }
    } 
    // Otros errores genéricos (correo no existe, servidor caído, etc.)
    else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
    }
  } finally {
    // Siempre ejecutamos esto, pase lo que pase (éxito o error)
    setLoading(false);   // quitamos el spinner y habilitamos botón (si no está bloqueado)
  }
};

  
  return (
    <div className="inicio-page">
      {/* Barra de navegación */}
      <BarraNavInicio
        scrollTo={scrollTo}
        misionRef={misionRef}
        quienesRef={quienesRef}
        visionRef={visionRef}
        lidarRef={lidarRef}
        aplicacionesRef={aplicacionesRef}
        beneficiosRef={beneficiosRef}
        tecnologiaRef={tecnologiaRef}
      />

      <div style={{ paddingTop: '80px' }} />

      
      {/* Modal Iniciar Sesión - Estilo elegante + Recuperar contraseña */}

      <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header border-0 bg-gradient-primary text-white">
              <h5 className="modal-title fs-4 fw-bold" id="loginModalLabel">Iniciar Sesión</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-5">
              <form noValidate onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <label htmlFor="loginDocumento" className="form-label fw-semibold text-muted">Número de Documento</label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-pill shadow-sm border-0"
                    id="loginDocumento"
                    name="Documento"
                    value={loginData.Documento}
                    onChange={handleLoginChange}
                    minLength={6}
                    maxLength={10}
                    pattern="^[0-9]{6,10}$"
                    title="Solo números (6-10 dígitos)"
                    required
                    placeholder="Ej: 123456789"
                  />
                </div>

                <div className="mb-4 position-relative">
                  <label htmlFor="loginContrasena" className="form-label fw-semibold text-muted">Contraseña</label>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    className="form-control form-control-lg rounded-pill shadow-sm border-0 pe-5"
                    id="loginContrasena"
                    name="Contrasena"
                    value={loginData.Contrasena}
                    onChange={handleLoginChange}
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="btn position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{ fontSize: '1.5rem'  }}
                  >
                    {showLoginPassword ? '👀' : '🙈'}
                  </button>
                </div>

                
                <div className="text-end mb-4">
                  <button
                    type="button"
                    className="btn btn-link text-primary fw-semibold small p-0"
                    onClick={() => {
                      const loginEl = document.getElementById('loginModal');
                      const loginModal = window.bootstrap.Modal.getOrCreateInstance(loginEl); // getOrCreateInstance es más seguro en BS5

                      loginModal.hide();

                      loginEl.addEventListener('hidden.bs.modal', function handler() {
                        const sendEl = document.getElementById('sendEmailModal');
                        const sendModal = window.bootstrap.Modal.getOrCreateInstance(sendEl);
                        sendModal.show();
                        loginEl.removeEventListener('hidden.bs.modal', handler);
                      }, { once: true });
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill shadow-lg fw-bold">
                  Ingresar
                </button>
              </form>

              <div className="text-center mt-4 small">
                <p className="mb-0 text-muted">
                  ¿No tiene una cuenta?{' '}
                  <button
                    type="button"
                    className="btn btn-link text-primary fw-semibold p-0"
                    onClick={() => {
                      const loginEl = document.getElementById('loginModal');
                      const loginModal = window.bootstrap.Modal.getOrCreateInstance(loginEl);

                      loginModal.hide();

                      loginEl.addEventListener('hidden.bs.modal', function handler() {
                        const regEl = document.getElementById('registerModal');
                        const regModal = window.bootstrap.Modal.getOrCreateInstance(regEl);
                        regModal.show();
                        loginEl.removeEventListener('hidden.bs.modal', handler);
                      }, { once: true });
                    }}
                  >
                    Regístrese aquí
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Registrarse - Estilo elegante */}
      <div className="modal fade" id="registerModal" tabIndex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header border-0 bg-gradient-primary text-white">
              <h5 className="modal-title fs-4 fw-bold" id="registerModalLabel">Crear Cuenta</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-5">
              <form className="row g-4" noValidate onSubmit={handleRegisterSubmit}>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Nombres</label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-pill shadow-sm border-0"
                    name="Nombres"
                    value={registerData.Nombres}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Ej: Juan David"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Apellidos</label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-pill shadow-sm border-0"
                    name="Apellidos"
                    value={registerData.Apellidos}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Ej: Pérez Gómez"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Correo</label>
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-pill shadow-sm border-0"
                    name="Correo"
                    value={registerData.Correo}
                    onChange={handleRegisterChange}
                    required
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Tipo de Documento</label>
                  <select
                    className="form-select form-select-lg rounded-pill shadow-sm border-0"
                    name="Tipo_Doc"
                    value={registerData.Tipo_Doc}
                    onChange={handleRegisterChange}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="CC">Cédula</option>
                    <option value="PA">Pasaporte</option>
                    <option value="PP">Permiso de permanencia</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Número de Documento</label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-pill shadow-sm border-0"
                    name="Cedula"
                    value={registerData.Cedula}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Ej: 123456789"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Celular</label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-pill shadow-sm border-0"
                    name="Celular"
                    value={registerData.Celular}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Ej: 3001234567"
                  />
                </div>
                <div className="col-md-6 position-relative">
                  <label className="form-label fw-semibold text-muted">Contraseña</label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    className="form-control form-control-lg rounded-pill shadow-sm border-0 pe-5"
                    name="Contrasena"
                    value={registerData.Contrasena}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    className="btn position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{ fontSize: '1.5rem' }}
                  >
                    {showRegPassword ? '👀' : '🙈'}
                  </button>
                </div>
                <div className="col-md-6 position-relative">
                  <label className="form-label fw-semibold text-muted">Confirmar Contraseña</label>
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    className="form-control form-control-lg rounded-pill shadow-sm border-0 pe-5"
                    name="ConfirmarContrasena"
                    value={registerData.ConfirmarContrasena}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Repite tu contraseña"
                  />
                  <button
                    type="button"
                    className="btn position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    style={{ fontSize: '1.5rem' }}
                  >
                    {showRegConfirmPassword ? '👀' : '🙈'}
                  </button>
                </div>
                <div className="col-12 d-flex align-items-center mt-3">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    name="agreeTerms"
                    checked={registerData.agreeTerms}
                    onChange={handleRegisterChange}
                    id="agreeTerms"
                  />
                  <label className="form-check-label small text-muted" htmlFor="agreeTerms">
                    Acepto los <a href="#" className="text-primary">términos y condiciones</a>
                  </label>
                </div>
                <div className="col-12 text-center mt-4">
                  <button type="submit" className="btn btn-primary btn-lg px-5 rounded-pill shadow-lg fw-bold">
                    Enviar Registro
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Enviar Correo (para solicitar código de recuperación) */}
      <div className="modal fade" id="sendEmailModal" tabIndex="-1" aria-labelledby="sendEmailModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header border-0 bg-gradient-primary text-white">
              <h5 className="modal-title fs-4 fw-bold" id="sendEmailModalLabel">
                Enviar Código de Recuperación
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body px-5 pb-5">
              <p className="text-muted mb-4 text-center">
                Digite el correo electrónico registrado y le enviaremos un código para recuperar su contraseña.
              </p>

              <form className="d-flex flex-column align-items-center" noValidate onSubmit={handleSendEmailSubmit}>
                <div className="mb-4 w-100">
                  <label htmlFor="Correo" className="form-label fw-semibold text-muted">Correo Electrónico</label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-pill shadow-sm border-0 bg-light"
                    id="Correo"
                    name="Correo"
                    value={Usuario.Correo}
                    onChange={handleInputChange}
                    required
                    disabled={loading || bloqueado}
                    placeholder="ejemplo@correo.com"
                  />
                  {bloqueado && (
                    <small className="text-danger mt-1 d-block text-center">
                      Espere {formatoTiempo(tiempoRestante)} para volver a intentar
                    </small>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-pill shadow-lg fw-bold"
                  disabled={loading || bloqueado}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Enviando...
                    </>
                  ) : bloqueado ? (
                    `Espera ${formatoTiempo(tiempoRestante)}...`
                  ) : (
                    'Enviar Correo'
                  )}
                </button>
              </form>

              <div className="text-center mt-4 small">
                <button
                  type="button"
                  className="btn btn-link text-primary p-0"
                  onClick={() => {
                    // Cerramos el modal actual (enviar correo)
                    const sendModalEl = document.getElementById('sendEmailModal');
                    const sendModal = window.bootstrap.Modal.getInstance(sendModalEl);
                    if (sendModal) sendModal.hide();

                    // Esperamos a que termine de cerrarse completamente
                    sendModalEl.addEventListener('hidden.bs.modal', function handler() {
                      const loginModal = new window.bootstrap.Modal(document.getElementById('loginModal'));
                      loginModal.show();
                      sendModalEl.removeEventListener('hidden.bs.modal', handler);
                    }, { once: true });
                  }}
                >
                  Volver a iniciar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Recuperar Contraseña */}
      <div className="modal fade" id="recoverPasswordModal" tabIndex="-1" aria-labelledby="recoverPasswordModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header border-0 bg-gradient-primary text-white">
              <h5 className="modal-title fs-4 fw-bold" id="recoverPasswordModalLabel">
                Recuperar Contraseña
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body px-5 pb-5">
              <form className="d-flex flex-column align-items-center" noValidate onSubmit={handleRecoverSubmit}>
                {/* Correo */}
                <div className="mb-4 w-100">
                  <label htmlFor="recoverCorreo" className="form-label fw-semibold text-muted">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-pill shadow-sm border-0"
                    id="recoverCorreo"
                    name="Correo"
                    value={recoverData.Correo}
                    onChange={handleRecoverChange}
                    required
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                {/* Código */}
                <div className="mb-4 w-100">
                  <label htmlFor="recoverCodigo" className="form-label fw-semibold text-muted">Código recibido</label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-pill shadow-sm border-0"
                    id="recoverCodigo"
                    name="Codigo"
                    value={recoverData.Codigo}
                    onChange={handleRecoverChange}
                    required
                    placeholder="Ingresa el código que recibiste"
                  />
                </div>

                {/* Nueva Contraseña */}
                <div className="mb-4 position-relative w-100">
                  <label htmlFor="recoverNueva" className="form-label fw-semibold text-muted">Nueva Contraseña</label>
                  <input
                    type={showNueva ? "text" : "password"}
                    className="form-control form-control-lg rounded-pill shadow-sm border-0 pe-5"
                    id="recoverNueva"
                    name="NuevaContrasena"
                    value={recoverData.NuevaContrasena}
                    onChange={handleRecoverChange}
                    required
                    placeholder="Nueva contraseña"
                  />
                  <button
                    type="button"
                    className="btn position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                    onClick={() => setShowNueva(!showNueva)}
                    style={{ fontSize: '1.5rem' }}
                  >
                    {showNueva ? "👀" : "🙈"}
                  </button>
                </div>

                {/* Confirmar Contraseña */}
                <div className="mb-4 position-relative w-100">
                  <label htmlFor="recoverConfirmar" className="form-label fw-semibold text-muted">Confirmar Contraseña</label>
                  <input
                    type={showConfirmar ? "text" : "password"}
                    className="form-control form-control-lg rounded-pill shadow-sm border-0 pe-5"
                    id="recoverConfirmar"
                    name="ConfirmarContrasena"
                    value={recoverData.ConfirmarContrasena}
                    onChange={handleRecoverChange}
                    required
                    placeholder="Repite la nueva contraseña"
                  />
                  <button
                    type="button"
                    className="btn position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                    onClick={() => setShowConfirmar(!showConfirmar)}
                    style={{ fontSize: '1.5rem' }}
                  >
                    {showConfirmar ? "👀" : "🙈"}
                  </button>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill shadow-lg fw-bold">
                  Recuperar
                </button>
              </form>

              {/* Reenviar código */}
              <div className="text-center mt-4">
                <p className="small text-muted">
                  ¿No te llegó el correo?{' '}
                  <span
                    className="text-primary fw-semibold"
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                      localStorage.removeItem('correo');

                      // Cerramos el modal actual si está abierto
                      const recoverModal = window.bootstrap.Modal.getInstance(document.getElementById('recoverPasswordModal'));
                      if (recoverModal) recoverModal.hide();

                      // Abrimos el modal de enviar correo
                      setTimeout(() => {
                        const sendModal = new window.bootstrap.Modal(document.getElementById('sendEmailModal'));
                        sendModal.show();
                      }, 400);
                    }}
                  >
                    Reenviar código
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECCIONES ───────────────────────────────────────────────────── */}

      {/* 1. Misión - Centrada y equilibrada */}
      <section ref={misionRef} id="mision" className="min-vh-100 d-flex align-items-center bg-light py-5 animate-on-scroll">
        <div className="container">
          <div className="row align-items-center justify-content-center g-5">
            <div className="col-lg-5 text-center text-lg-start">
              <h1 className="display-4 fw-bold text-primary mb-4">Nuestra Misión</h1>
              <p className="lead text-dark mb-4">
                Nuestra misión es proporcionar servicios de levantamiento y modelado 3D de infraestructuras utilizando tecnología LIDAR de vanguardia,
                con el fin de generar gemelos digitales de alta precisión que permitan a nuestros clientes optimizar la gestión de sus activos,
                mejorar la eficiencia operativa y garantizar la seguridad en sus operaciones.
              </p>
              <p className="text-dark">
                Nos comprometemos a entregar datos geoespaciales confiables y actualizados,
                adaptándonos a las necesidades específicas de cada proyecto y contribuyendo al desarrollo de infraestructuras más inteligentes y sostenibles.
              </p>
            </div>
            <div className="col-lg-5">
              <img
                src={datosImagen}
                alt="Misión OCA Global"
                className="img-fluid rounded-4 shadow-lg w-100"
                style={{ maxHeight: '520px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quiénes Somos - Todo centrado donde corresponde */}
      <section ref={quienesRef} id="quienes" className="min-vh-100 d-flex align-items-center bg-white py-5 animate-on-scroll">
        <div className="container">
          <h1 className="display-4 fw-bold text-primary text-center mb-5">¿Quiénes Somos?</h1>

          <div className="row align-items-center justify-content-center g-5 mb-5">
            <div className="col-lg-5 order-lg-2 text-center text-lg-start">
              <h3 className="fw-bold mb-4">OCA Global Solutions & Dynamics</h3>
              <p className="lead text-dark mb-4">
                OCA Global es una empresa multinacional que ofrece una amplia gama de servicios en los ámbitos de inspección,
                certificación, ensayos, formación y consultoría.
              </p>
              <p className="text-dark">
                Su objetivo principal es aumentar el valor económico de los activos, proyectos, productos y sistemas de sus clientes,
                reduciendo riesgos y garantizando el cumplimiento de los estándares de calidad y seguridad.
              </p>
            </div>
            <div className="col-lg-5 order-lg-1">
              <img
                src={imagesImagen}
                alt="OCA Global"
                className="img-fluid rounded-4 shadow-lg mx-auto d-block"
                style={{ maxHeight: '520px', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Servicios - Centrados y del mismo tamaño */}
          <div className="mb-5">
            <h3 className="text-center fw-bold mb-4">Servicios que ofrece OCA</h3>
            <div className="row g-4 justify-content-center">
              {/* Tarjeta 1 */}
              <div className="col-md-5">
                <div className="bg-light p-4 rounded-3 shadow-sm h-100 d-flex flex-column">
                  <h5 className="fw-bold mb-3">Servicios de inspección</h5>
                  <ul className="list-unstyled mb-3">
                    <li className="mb-2">• Inspección reglamentaria</li>
                    <li className="mb-2">• Control de calidad y asistencia técnica</li>
                    <li>• Inspecciones marítimas y de materias primas</li>
                  </ul>
                  <h5 className="fw-bold mt-auto mb-3">Certificación</h5> {/* mt-auto empuja hacia abajo */}
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">• Certificación de sistemas de gestión (ISO)</li>
                    <li>• Certificación de productos</li>
                  </ul>
                </div>
              </div>

              {/* Tarjeta 2 */}
              <div className="col-md-5">
                <div className="bg-light p-4 rounded-3 shadow-sm h-100 d-flex flex-column">
                  <h5 className="fw-bold mb-3">Ensayos</h5>
                  <ul className="list-unstyled mb-3">
                    <li className="mb-2">• Ensayos de materiales</li>
                    <li>• Ensayos ambientales</li>
                  </ul>
                  <h5 className="fw-bold mt-4 mb-3">Formación</h5>
                  <ul className="list-unstyled mb-3">
                    <li className="mb-2">• Programas de formación en áreas técnicas y de gestión</li>
                  </ul>
                  <h5 className="fw-bold mt-auto mb-3">Consultoría</h5> {/* mt-auto para alinear al fondo */}
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">• Asesoramiento en ingeniería y construcción</li>
                    <li>• Gestión de riesgos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sectores */}
          <div className="text-center mb-5">
            <h3 className="fw-bold mb-4">Sectores de Actividad</h3>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {['Infraestructuras', 'Telecomunicaciones', 'Energía', 'Industria', 'Medio ambiente', 'Servicios Públicos'].map((sector) => (
                <span key={sector} className="badge bg-primary-subtle text-primary px-4 py-2 fs-6 rounded-pill">
                  {sector}
                </span>
              ))}
            </div>
          </div>

          {/* Imágenes de servicios - mismo tamaño */}
          <div className="row g-4 justify-content-center">
            <div className="col-md-4 col-sm-6">
              <img
                src={inspeccionImagen}
                alt="Inspección"
                className="img-fluid rounded-4 shadow w-100 service-img"
              />
            </div>
            <div className="col-md-4 col-sm-6">
              <img
                src={certificacionImagen}
                alt="Certificación"
                className="img-fluid rounded-4 shadow w-100 service-img"
              />
            </div>
            <div className="col-md-4 col-sm-6">
              <img
                src={comunicacionesImagen}
                alt="Comunicaciones"
                className="img-fluid rounded-4 shadow w-100 service-img"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Visión - Centrada */}
      <section ref={visionRef} id="vision" className="min-vh-100 d-flex align-items-center bg-light py-5 animate-on-scroll">
        <div className="container">
          <div className="row align-items-center justify-content-center g-5 flex-lg-row-reverse">
            <div className="col-lg-5 text-center text-lg-start">
              <h1 className="display-4 fw-bold text-primary mb-4">Nuestra Visión</h1>
              <p className="lead text-dark mb-4">
                Aspiramos a ser líderes en la prestación de servicios LIDAR en el ámbito de la inspección y modelado de infraestructuras,
                siendo reconocidos por nuestra excelencia técnica, la calidad de nuestros datos y nuestra capacidad de innovación.
              </p>
              <p className="text-dark">
                Buscamos ser el socio estratégico de nuestros clientes en la implementación de soluciones basadas en gemelos digitales,
                impulsando la transformación digital de sus operaciones y contribuyendo a la creación de un futuro más eficiente y seguro.
              </p>
            </div>
            <div className="col-lg-5">
              <img
                src={grupo2Imagen}
                alt="Visión OCA Global"
                className="img-fluid rounded-4 shadow-lg mx-auto d-block"
                style={{ maxHeight: '520px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. ¿Qué es LIDAR? - Centrada */}
      <section ref={lidarRef} id="lidar" className="min-vh-100 d-flex align-items-center bg-white py-5 animate-on-scroll">
        <div className="container">
          <div className="row align-items-center justify-content-center g-5">
            <div className="col-lg-5 text-center text-lg-start">
              <h1 className="display-4 fw-bold text-primary mb-4">¿Qué es LIDAR?</h1>
              <p className="lead text-dark mb-4">
                LIDAR (Light Detection and Ranging) es una tecnología de teledetección que utiliza pulsos láser para medir distancias y crear modelos 3D precisos del entorno.
              </p>
              <p className="text-dark">
                Funciona emitiendo pulsos de luz láser hacia un objeto o superficie y midiendo el tiempo que tarda la luz en regresar al sensor.
                Esta información permite generar nubes de puntos densas que representan la forma y estructura del terreno y otros objetos.
              </p>
            </div>
            <div className="col-lg-5">
              <img
                src={lidarImagen}
                alt="Tecnología LIDAR"
                className="img-fluid rounded-4 shadow-lg mx-auto d-block"
                style={{ maxHeight: '520px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Aplicaciones - Tarjetas centradas */}
      <section ref={aplicacionesRef} id="aplicaciones" className="bg-light py-5 animate-on-scroll">
        <div className="container">
          <h1 className="display-4 fw-bold text-primary text-center mb-5">Aplicaciones del Proyecto LIDAR</h1>
          <div className="row g-4 justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-lg border-0 mx-auto">
                <div className="card-body p-4 text-start">
                  <h5 className="card-title fw-bold text-primary mb-3">Topografía y Cartografía</h5>
                  <ul className="list-unstyled">
                    <li className="mb-3">Generación de modelos digitales del terreno (MDT) y de superficie (MDS)</li>
                    <li className="mb-3">Mapas topográficos precisos para ingeniería y construcción</li>
                    <li>Levantamientos de carreteras, ferrocarriles y líneas eléctricas</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-lg border-0 mx-auto">
                <div className="card-body p-4 text-start">
                  <h5 className="card-title fw-bold text-primary mb-3">Inspección de Infraestructuras</h5>
                  <ul className="list-unstyled">
                    <li className="mb-3">Detección de deformaciones y daños en puentes y estructuras</li>
                    <li className="mb-3">Modelado 3D de túneles y galerías</li>
                    <li>Monitoreo de líneas de transmisión y corredores</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-lg border-0 mx-auto">
                <div className="card-body p-4 text-start">
                  <h5 className="card-title fw-bold text-primary mb-3">Medio Ambiente y Agricultura</h5>
                  <ul className="list-unstyled">
                    <li className="mb-3">Modelos de vegetación y penetración de canopy</li>
                    <li className="mb-3">Análisis de erosión y volumen de cuencas</li>
                    <li>Monitoreo de cultivos y precisión agrícola</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Beneficios - Centrado */}
      <section ref={beneficiosRef} id="beneficios" className="min-vh-100 d-flex align-items-center bg-white py-5 animate-on-scroll">
        <div className="container">
          <div className="row align-items-center justify-content-center g-5">
            <div className="col-lg-5 text-center text-lg-start">
              <h1 className="display-4 fw-bold text-primary mb-4">Beneficios del uso de LIDAR</h1>
              <ul className="list-unstyled lead text-dark ps-0">
                <li className="mb-4"><strong>Alta precisión y densidad de datos</strong></li>
                <li className="mb-4"><strong>Penetración de vegetación para medir el terreno real</strong></li>
                <li className="mb-4"><strong>Rapidez en captura de datos a gran escala</strong></li>
                <li><strong>Modelos 3D extremadamente detallados y confiables</strong></li>
              </ul>
            </div>
            <div className="col-lg-5">
              <img
                src={beneficiosImagen}
                alt="Beneficios LIDAR"
                className="img-fluid rounded-4 shadow-lg mx-auto d-block"
                style={{ maxHeight: '520px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Tecnología - Centrada */}
      <section ref={tecnologiaRef} id="tecnologia" className="min-vh-100 d-flex align-items-center bg-light py-5 animate-on-scroll">
        <div className="container">
          <h1 className="display-4 fw-bold text-primary text-center mb-5">Tecnología y software utilizados</h1>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <p className="lead text-dark text-center mb-5">
                Utilizamos equipos LIDAR de última generación, tanto aéreos como terrestres, junto con software especializado para el procesamiento de datos,
                nubes de puntos, MDT/MDS, extracción de características y visualización 3D de alta calidad.
              </p>
              <div className="text-center">
                <img
                  src={herramientasImagen}
                  alt="Herramientas LIDAR"
                  className="img-fluid rounded-4 shadow-lg mx-auto d-block"
                  style={{ maxWidth: '80%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}