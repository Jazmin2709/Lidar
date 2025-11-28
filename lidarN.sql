-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-11-2025 a las 02:39:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `lidar`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `buddy`
--

CREATE TABLE `buddy` (
  `id_buddy1` int(10) NOT NULL,
  `num_cuadrilla` varchar(10) NOT NULL,
  `Hora_buddy` time NOT NULL,
  `Est_empl` varchar(10) NOT NULL,
  `Est_vehi` varchar(10) NOT NULL,
  `Carnet` tinyint(1) NOT NULL,
  `Nombre_id` varchar(30) NOT NULL,
  `TarjetaVida` tinyint(1) NOT NULL,
  `Fecha` date NOT NULL,
  `Est_etapa` varchar(10) NOT NULL,
  `Est_her` varchar(10) NOT NULL,
  `MotivoEmp` text DEFAULT NULL,
  `MotivoVeh` text DEFAULT NULL,
  `MotivoHer` text DEFAULT NULL,
  `Tablero` varchar(255) DEFAULT NULL,
  `Calentamiento` varchar(255) DEFAULT NULL,
  `Tipo` int(1) NOT NULL,
  `id_empleado` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `buddy`
--

INSERT INTO `buddy` (`id_buddy1`, `num_cuadrilla`, `Hora_buddy`, `Est_empl`, `Est_vehi`, `Carnet`, `Nombre_id`, `TarjetaVida`, `Fecha`, `Est_etapa`, `Est_her`, `MotivoEmp`, `MotivoVeh`, `MotivoHer`, `Tablero`, `Calentamiento`, `Tipo`, `id_empleado`) VALUES
(11, '12', '06:38:00', 'Excelente', 'Excelente', 0, '', 0, '2025-04-17', 'Inicio', 'Excelente', '', '', '', NULL, NULL, 0, 6),
(15, '10', '22:23:00', 'Malo', 'Malo', 0, '', 0, '2025-07-06', 'Finalizó', 'Malo', NULL, NULL, NULL, NULL, NULL, 0, 7),
(16, '10', '22:26:00', 'Malo', 'Malo', 0, '', 0, '2025-07-06', 'Finalizó', 'Malo', NULL, NULL, NULL, NULL, NULL, 3, 7),
(17, '14', '22:29:00', 'Malo', 'Malo', 0, '', 0, '2025-07-13', 'Finalizó', 'Malo', NULL, NULL, NULL, 'si', 'si', 2, 7),
(18, '16', '22:30:00', 'Malo', 'Malo', 0, '', 0, '2025-07-07', 'Finalizó', 'Malo', NULL, NULL, NULL, NULL, NULL, 1, 7),
(19, '3', '07:33:00', 'Excelente', 'Excelente', 0, '', 0, '2025-08-24', 'Inicio', 'Excelente', NULL, NULL, NULL, 'ko', 'ko', 2, 7),
(20, '2', '09:47:00', 'Excelente', 'Excelente', 0, '', 0, '2025-08-24', 'Inicio', 'Excelente', NULL, NULL, NULL, 'ko', 'ko', 2, 7),
(21, '6', '08:02:00', 'Excelente', 'Excelente', 1, '', 1, '2025-08-24', 'Inicio', 'Excelente', NULL, NULL, NULL, 'ko', 'ko', 2, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historico_empleados`
--

CREATE TABLE `historico_empleados` (
  `id_historial` int(11) NOT NULL,
  `id_empleado` int(11) DEFAULT NULL,
  `accion` enum('CREADO','EDITADO','DESHABILITADO','HABILITADO','ELIMINADO') DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `usuario_responsable` int(11) DEFAULT NULL,
  `datos_antes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_antes`)),
  `datos_despues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_despues`)),
  `ip_address` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historico_sesiones`
--

CREATE TABLE `historico_sesiones` (
  `id_sesion` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `accion` enum('LOGIN','LOGOUT') DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historico_sesiones`
--

INSERT INTO `historico_sesiones` (`id_sesion`, `id_usuario`, `accion`, `fecha`, `ip_address`, `user_agent`) VALUES
(1, 3, 'LOGIN', '2025-11-24 20:24:04', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'),
(2, 3, 'LOGIN', '2025-11-24 20:30:32', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'),
(3, 3, 'LOGIN', '2025-11-24 20:31:06', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'),
(4, 6, 'LOGIN', '2025-11-24 20:34:07', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'),
(5, 3, 'LOGIN', '2025-11-24 20:36:16', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `id_per` int(10) NOT NULL,
  `Correo` varchar(100) NOT NULL,
  `Nombres` varchar(30) NOT NULL,
  `Apellidos` varchar(30) NOT NULL,
  `Cedula` int(10) NOT NULL,
  `Celular` varchar(15) NOT NULL,
  `Contrasena` varchar(255) NOT NULL,
  `Tipo_Doc` varchar(40) NOT NULL,
  `id_rol` int(10) NOT NULL,
  `agreeTerms` tinyint(1) NOT NULL,
  `codigo` int(10) NOT NULL,
  `UltimoEnvio` datetime DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`id_per`, `Correo`, `Nombres`, `Apellidos`, `Cedula`, `Celular`, `Contrasena`, `Tipo_Doc`, `id_rol`, `agreeTerms`, `codigo`, `UltimoEnvio`, `activo`) VALUES
(2, 'usuario@ejemplo.com', 'camilo', 'rodriguez', 1023, '23232323', '$2b$10$/gO8dlR1BEJPb4rlRY5z8u8BdzjVCyDWHDUbmkk9ajPujesKwF.k6', 'CC', 2, 0, 0, NULL, 1),
(3, 'dilan@gmail.com', 'dilan', 'lopez', 9999, '1515115', '$2b$10$ut2eqRh/GKrMe0sNVuRo1.EYqU0IgU8M3F1WeQxpSbutfSwZ6FJAK', 'CC', 3, 0, 0, NULL, 1),
(6, 'cielojvargas@gmail.com', 'Cielo Jazmin', 'Vargas Peña', 1032797544, '3246351899', '$2b$10$IuYUdmvgSF/pKeFRSILmZe9FIG9f1GOn.NtIDvQsqMwUJEIxvHOVW', 'CC', 3, 0, 240083, '2025-10-28 18:43:20', 0),
(7, 'andres.romerp1473@gmail.com', 'camilo', 'rodriguez', 1023864182, '3173242675', '$2b$10$PyT8gKPEFrthd0R09jpxQeafgu.Vzy/n7TqvNQotIU9MhFOjX4HAe', 'CC', 3, 0, 330519, '2025-10-20 19:09:26', 1),
(8, 'paula@gmail.com', 'Paula', 'Carranza', 11223344, '3246598712', '$2b$10$3WKMDGo.QK/kGzt05KdzYe5f/6mB10q35i0loksBLoEG0HlDzFMBu', 'CC', 2, 1, 0, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(10) NOT NULL,
  `nombre` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre`) VALUES
(1, 'supervisor'),
(2, 'empleado'),
(3, 'Administrador');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `buddy`
--
ALTER TABLE `buddy`
  ADD PRIMARY KEY (`id_buddy1`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `historico_empleados`
--
ALTER TABLE `historico_empleados`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `id_empleado` (`id_empleado`),
  ADD KEY `usuario_responsable` (`usuario_responsable`);

--
-- Indices de la tabla `historico_sesiones`
--
ALTER TABLE `historico_sesiones`
  ADD PRIMARY KEY (`id_sesion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`id_per`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `buddy`
--
ALTER TABLE `buddy`
  MODIFY `id_buddy1` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `historico_empleados`
--
ALTER TABLE `historico_empleados`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `historico_sesiones`
--
ALTER TABLE `historico_sesiones`
  MODIFY `id_sesion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id_per` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `buddy`
--
ALTER TABLE `buddy`
  ADD CONSTRAINT `buddy_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `persona` (`id_per`);

--
-- Filtros para la tabla `historico_empleados`
--
ALTER TABLE `historico_empleados`
  ADD CONSTRAINT `historico_empleados_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `persona` (`id_per`),
  ADD CONSTRAINT `historico_empleados_ibfk_2` FOREIGN KEY (`usuario_responsable`) REFERENCES `persona` (`id_per`);

--
-- Filtros para la tabla `historico_sesiones`
--
ALTER TABLE `historico_sesiones`
  ADD CONSTRAINT `historico_sesiones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `persona` (`id_per`);

--
-- Filtros para la tabla `persona`
--
ALTER TABLE `persona`
  ADD CONSTRAINT `persona_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
