-- Tablas para el sistema de asistencia y cuadrillas

-- 1. Tabla de Asistencia
CREATE TABLE IF NOT EXISTS asistencia (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    foto_url VARCHAR(255) NOT NULL,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    FOREIGN KEY (id_persona) REFERENCES persona(id_per) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabla de Cuadrillas
CREATE TABLE IF NOT EXISTS cuadrillas (
    id_cuadrilla INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    tipo ENUM('Normal', 'MMS', 'AEROLASER', 'BACKPACK') NOT NULL DEFAULT 'Normal',
    fecha DATE NOT NULL,
    id_supervisor INT NOT NULL,
    FOREIGN KEY (id_supervisor) REFERENCES persona(id_per) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla de Miembros de Cuadrilla (Asignaciones diarias)
CREATE TABLE IF NOT EXISTS cuadrilla_miembros (
    id_cuadrilla INT NOT NULL,
    id_persona INT NOT NULL,
    PRIMARY KEY (id_cuadrilla, id_persona),
    FOREIGN KEY (id_cuadrilla) REFERENCES cuadrillas(id_cuadrilla) ON DELETE CASCADE,
    FOREIGN KEY (id_persona) REFERENCES persona(id_per) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
