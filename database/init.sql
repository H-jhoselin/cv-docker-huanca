-- Script de inicialización automática de la base de datos
-- Se ejecuta desde /docker-entrypoint-initdb.d al crear el contenedor por primera vez

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS cv_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cv_db;

CREATE TABLE IF NOT EXISTS persona (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    nombre    VARCHAR(100) NOT NULL,
    apellido  VARCHAR(100) NOT NULL,
    ciudad    VARCHAR(100) NOT NULL,
    foto      VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS formacion (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    titulo       VARCHAR(150) NOT NULL,
    institucion  VARCHAR(150) NOT NULL,
    anio         VARCHAR(50)  NOT NULL,
    persona_id   INT NOT NULL,
    CONSTRAINT fk_formacion_persona FOREIGN KEY (persona_id) REFERENCES persona(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO persona (id, nombre, apellido, ciudad, foto) VALUES
    (1, 'Jhoselin', 'Huanca Torres', 'La Paz', '/foto.jpg');

INSERT INTO formacion (titulo, institucion, anio, persona_id) VALUES
    ('Título en Provisión Nacional', 'Ingeniería de Sistemas', '2019', 1),
    ('Diplomado en Business Intelligence', 'Univ. Privada Franz Tamayo', '2026 · certificación en proceso', 1),
    ('Diplomado en Ingeniería de Datos y SQL', 'Univ. SIGLO XX', '2025 · certificación en proceso', 1),
    ('Diplomado en Educación Superior', 'Univ. Privada Franz Tamayo', '2019', 1),
    ('Licenciatura en Ingeniería de Sistemas', 'Univ. Privada Franz Tamayo', '2011 – 2016', 1),
    ('Bachiller en Humanidades', 'Colegio "Los Andes", El Alto', '2010', 1);
