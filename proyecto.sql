-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-07-2025 a las 05:13:44
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
-- Base de datos: `proyecto`
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
  `Carnet` int(10) NOT NULL,
  `Nombre_id` varchar(30) NOT NULL,
  `TarjetaVida` varchar(10) NOT NULL,
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
(11, '12', '06:38:00', 'Excelente', 'Excelente', 0, '', 'Si', '2025-04-17', 'Inicio', 'Excelente', '', '', '', NULL, NULL, 0, 6),
(15, '10', '22:23:00', 'Malo', 'Malo', 0, '', 'Si', '2025-07-06', 'Finalizó', 'Malo', NULL, NULL, NULL, NULL, NULL, 0, 7),
(16, '10', '22:26:00', 'Malo', 'Malo', 0, '', 'Si', '2025-07-06', 'Finalizó', 'Malo', NULL, NULL, NULL, NULL, NULL, 3, 7),
(17, '14', '22:29:00', 'Malo', 'Malo', 0, '', 'Si', '2025-07-13', 'Finalizó', 'Malo', NULL, NULL, NULL, 'si', 'si', 2, 7),
(18, '16', '22:30:00', 'Malo', 'Malo', 0, '', 'Si', '2025-07-07', 'Finalizó', 'Malo', NULL, NULL, NULL, NULL, NULL, 1, 7);

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
  `codigo` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`id_per`, `Correo`, `Nombres`, `Apellidos`, `Cedula`, `Celular`, `Contrasena`, `Tipo_Doc`, `id_rol`, `agreeTerms`, `codigo`) VALUES
(2, 'usuario@ejemplo.com', 'camilo', 'rodriguez', 1023, '1312313', '$2b$10$q6zJd4rTQxYqF4eXcWuYxubllM1E5yd76VIx1Q76ZceLHnnJV6XTK', 'CC', 1, 0, 0),
(3, 'dilan@gmail.com', 'dilan', 'lopez', 9999, '1515115', '$2b$10$TQAN7DsIFNuxluvHhhCobezxYXIxNRuD0Qz2E2/CxxTSx8IDsyboC', 'CC', 1, 0, 0),
(6, 'cielojvargas@gmail.com', 'Cielo Jazmin', 'Vargas Peña', 1032797544, '3246351899', '$2b$10$Yfs7GuLkIjSx6ZqBvQBS.umNbJb6kqsI8g5h.i1Bq6cFaqfLdss1K', 'CC', 2, 0, 0),
(7, 'andres.romerp1473@gmail.com', 'camilo', 'rodriguez', 1023864182, '3173242675', '$2b$10$PiYSBwrNI5VZ5VKj6SY8cO7Us2keBgpcF0Up6ihh1RHvlX.VkNrk6', 'CC', 1, 0, 0);

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
  MODIFY `id_buddy1` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id_per` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- Filtros para la tabla `persona`
--
ALTER TABLE `persona`
  ADD CONSTRAINT `persona_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
