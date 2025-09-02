-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-05-2025 a las 18:42:09
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
-- Estructura de tabla para la tabla `buddy_1`
--

CREATE TABLE `buddy_1` (
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
  `id_empleado` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `buddy_1`
--

INSERT INTO `buddy_1` (`id_buddy1`, `num_cuadrilla`, `Hora_buddy`, `Est_empl`, `Est_vehi`, `Carnet`, `Nombre_id`, `TarjetaVida`, `Fecha`, `Est_etapa`, `Est_her`, `id_empleado`) VALUES
(11, '12', '06:38:00', 'Excelente', 'Excelente', 0, '', 'Si', '2025-04-17', 'Inicio', 'Excelente', 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `buddy_2`
--

CREATE TABLE `buddy_2` (
  `id_buddy2` int(10) NOT NULL,
  `Tablero` blob NOT NULL,
  `Calentamiento` blob NOT NULL,
  `id_buddy1` int(10) NOT NULL,
  `id_empleado` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `buddy_3`
--

CREATE TABLE `buddy_3` (
  `id_buddy3` int(10) NOT NULL,
  `Novedades` varchar(50) NOT NULL,
  `id_buddy1` int(10) NOT NULL,
  `id_empleado` int(10) NOT NULL,
  `id_sup` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `id_empleado` int(10) NOT NULL,
  `cargos` text NOT NULL,
  `ct_empleado` varchar(20) NOT NULL,
  `id_per` int(10) NOT NULL,
  `id_buddy1` int(10) NOT NULL,
  `id_buddy2` int(10) NOT NULL,
  `id_buddy3` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`id_empleado`, `cargos`, `ct_empleado`, `id_per`, `id_buddy1`, `id_buddy2`, `id_buddy3`) VALUES
(6, 'lider', '', 2, 0, 0, 0);

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
(5, 'andres.romerp1473@gmail.com', 'Andres Camilo ', 'Rodriguez Romero', 1023864182, '3173242675', '$2b$10$.U11YVdF3VSDhJZy1SnQ7O7R1OX0PJATHtAp4KrHTQF3UsVf.GCK6', 'CC', 1, 0, 989964),
(6, 'cielojvargas@gmail.com', 'Cielo Jazmin', 'Vargas Peña', 1032797544, '3246351899', '$2b$10$Yfs7GuLkIjSx6ZqBvQBS.umNbJb6kqsI8g5h.i1Bq6cFaqfLdss1K', 'CC', 2, 0, 0);

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
(2, 'empleado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `supervisor`
--

CREATE TABLE `supervisor` (
  `id_sup` int(10) NOT NULL,
  `Telefono` int(10) NOT NULL,
  `id_buddy1` int(10) NOT NULL,
  `id_cargo` int(10) NOT NULL,
  `id_per` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `buddy_1`
--
ALTER TABLE `buddy_1`
  ADD PRIMARY KEY (`id_buddy1`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `buddy_2`
--
ALTER TABLE `buddy_2`
  ADD PRIMARY KEY (`id_buddy2`),
  ADD KEY `id_buddy1` (`id_buddy1`,`id_empleado`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `buddy_3`
--
ALTER TABLE `buddy_3`
  ADD PRIMARY KEY (`id_buddy3`),
  ADD KEY `id_buddy1` (`id_buddy1`,`id_empleado`,`id_sup`),
  ADD KEY `id_sup` (`id_sup`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`id_empleado`),
  ADD KEY `id_per` (`id_per`,`id_buddy1`,`id_buddy2`,`id_buddy3`);

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
-- Indices de la tabla `supervisor`
--
ALTER TABLE `supervisor`
  ADD PRIMARY KEY (`id_sup`),
  ADD KEY `id_buddy1` (`id_buddy1`,`id_cargo`,`id_per`),
  ADD KEY `id_per` (`id_per`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `buddy_1`
--
ALTER TABLE `buddy_1`
  MODIFY `id_buddy1` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `buddy_2`
--
ALTER TABLE `buddy_2`
  MODIFY `id_buddy2` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `buddy_3`
--
ALTER TABLE `buddy_3`
  MODIFY `id_buddy3` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `id_empleado` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id_per` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `supervisor`
--
ALTER TABLE `supervisor`
  MODIFY `id_sup` int(10) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `buddy_1`
--
ALTER TABLE `buddy_1`
  ADD CONSTRAINT `buddy_1_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`);

--
-- Filtros para la tabla `buddy_2`
--
ALTER TABLE `buddy_2`
  ADD CONSTRAINT `buddy_2_ibfk_1` FOREIGN KEY (`id_buddy1`) REFERENCES `buddy_1` (`id_buddy1`),
  ADD CONSTRAINT `buddy_2_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`);

--
-- Filtros para la tabla `buddy_3`
--
ALTER TABLE `buddy_3`
  ADD CONSTRAINT `buddy_3_ibfk_1` FOREIGN KEY (`id_buddy1`) REFERENCES `buddy_1` (`id_buddy1`),
  ADD CONSTRAINT `buddy_3_ibfk_2` FOREIGN KEY (`id_sup`) REFERENCES `supervisor` (`id_sup`),
  ADD CONSTRAINT `buddy_3_ibfk_3` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`);

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `empleado_ibfk_1` FOREIGN KEY (`id_per`) REFERENCES `persona` (`id_per`);

--
-- Filtros para la tabla `persona`
--
ALTER TABLE `persona`
  ADD CONSTRAINT `persona_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);

--
-- Filtros para la tabla `supervisor`
--
ALTER TABLE `supervisor`
  ADD CONSTRAINT `supervisor_ibfk_1` FOREIGN KEY (`id_per`) REFERENCES `persona` (`id_per`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
