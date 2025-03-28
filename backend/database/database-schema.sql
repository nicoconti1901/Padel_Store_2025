-- Create database
CREATE DATABASE IF NOT EXISTS padel_store;
USE padel_store;

-- Create tables
CREATE TABLE IF NOT EXISTS paletas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    caracteristicas TEXT,
    stock INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255),
    es_nuevo BOOLEAN DEFAULT FALSE,
    en_oferta BOOLEAN DEFAULT FALSE,
    descuento INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS indumentaria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    talle VARCHAR(20) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    caracteristicas TEXT,
    stock INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255),
    es_nuevo BOOLEAN DEFAULT FALSE,
    en_oferta BOOLEAN DEFAULT FALSE,
    descuento INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accesorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    caracteristicas TEXT,
    stock INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255),
    es_nuevo BOOLEAN DEFAULT FALSE,
    en_oferta BOOLEAN DEFAULT FALSE,
    descuento INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for paletas
INSERT INTO paletas (marca, modelo, precio, caracteristicas, stock, imagen, es_nuevo, en_oferta, descuento) VALUES
('Bullpadel', 'Vertex 03', 299.99, 'Forma diamante, núcleo EVA soft, marco 100% carbono', 15, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
('Head', 'Alpha Pro', 249.99, 'Forma redonda, núcleo Foam, marco carbono y fibra de vidrio', 10, '/placeholder.svg?height=300&width=300', FALSE, TRUE, 15),
('Adidas', 'Metalbone', 289.99, 'Forma diamante, núcleo EVA soft, marco 100% carbono', 8, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
('Nox', 'AT10 Luxury', 279.99, 'Forma lágrima, núcleo HR3, marco 100% carbono', 12, '/placeholder.svg?height=300&width=300', FALSE, TRUE, 10);

-- Sample data for indumentaria
INSERT INTO indumentaria (tipo, marca, modelo, talle, precio, caracteristicas, stock, imagen, es_nuevo, en_oferta, descuento) VALUES
('Remera', 'Adidas', 'Club Tennis', 'M', 49.99, 'Tejido transpirable, tecnología Climalite', 20, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
('Short', 'Nike', 'Court Flex', 'L', 39.99, 'Tejido elástico, bolsillos laterales', 15, '/placeholder.svg?height=300&width=300', FALSE, FALSE, 0),
('Zapatillas', 'Asics', 'Gel-Resolution 8', '42', 129.99, 'Amortiguación Gel, suela de alta durabilidad', 8, '/placeholder.svg?height=300&width=300', FALSE, TRUE, 20),
('Gorra', 'Head', 'Pro Player', 'Única', 24.99, 'Tejido transpirable, ajuste trasero', 25, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0);

-- Sample data for accesorios
INSERT INTO accesorios (tipo, marca, modelo, precio, caracteristicas, stock, imagen, es_nuevo, en_oferta, descuento) VALUES
('Bolso', 'Babolat', 'Pure Aero', 89.99, 'Capacidad para 6 paletas, compartimentos térmicos', 10, '/placeholder.svg?height=300&width=300', FALSE, FALSE, 0),
('Overgrip', 'Wilson', 'Pro Overgrip', 14.99, 'Pack de 3 unidades, máxima absorción', 30, '/placeholder.svg?height=300&width=300', FALSE, TRUE, 5),
('Muñequeras', 'Head', 'Wristband', 9.99, 'Pack de 2 unidades, tejido absorbente', 25, '/placeholder.svg?height=300&width=300', FALSE, FALSE, 0),
('Protector', 'Bullpadel', 'Frame Protector', 19.99, 'Protector de marco transparente, alta durabilidad', 15, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0);

