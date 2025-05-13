-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de marcas
CREATE TABLE IF NOT EXISTS marcas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    precio_original DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(255),
    en_oferta BOOLEAN DEFAULT FALSE,
    descuento DECIMAL(5,2) DEFAULT 0,
    es_nuevo BOOLEAN DEFAULT TRUE,
    marca_id INT NOT NULL,
    categoria_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (marca_id) REFERENCES marcas(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Insertar categorías por defecto
INSERT IGNORE INTO categorias (nombre) VALUES 
('paletas'),
('indumentaria'),
('accesorios');

-- Insertar algunas marcas de ejemplo
INSERT IGNORE INTO marcas (nombre) VALUES 
('Head'),
('Babolat'),
('Wilson'),
('Adidas'),
('Nike'),
('Asics'); 