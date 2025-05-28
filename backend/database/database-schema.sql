-- Create database
CREATE DATABASE IF NOT EXISTS padel_store;
USE padel_store;

-- Create tables
CREATE TABLE IF NOT EXISTS marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca_id INT NOT NULL,
    categoria_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    precio_original DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255),
    es_nuevo BOOLEAN DEFAULT FALSE,
    en_oferta BOOLEAN DEFAULT FALSE,
    descuento INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (marca_id) REFERENCES marcas(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS paletas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    forma VARCHAR(50) NOT NULL,
    nucleo VARCHAR(50) NOT NULL,
    marco VARCHAR(100) NOT NULL,
    peso DECIMAL(4,2) NOT NULL,
    balance VARCHAR(20) NOT NULL,
    grosor DECIMAL(4,2) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS indumentaria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    talle VARCHAR(20) NOT NULL,
    material VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL,
    genero VARCHAR(20) NOT NULL,
    temporada VARCHAR(20) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS accesorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    material VARCHAR(100) NOT NULL,
    dimensiones VARCHAR(50),
    peso DECIMAL(6,2),
    color VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Modificar tablas existentes para agregar nuevas columnas
ALTER TABLE paletas
ADD COLUMN forma VARCHAR(50) NOT NULL AFTER product_id,
ADD COLUMN nucleo VARCHAR(50) NOT NULL AFTER forma,
ADD COLUMN marco VARCHAR(100) NOT NULL AFTER nucleo,
ADD COLUMN peso DECIMAL(4,2) NOT NULL AFTER marco,
ADD COLUMN balance VARCHAR(20) NOT NULL AFTER peso,
ADD COLUMN grosor DECIMAL(4,2) NOT NULL AFTER balance;

ALTER TABLE indumentaria
ADD COLUMN material VARCHAR(100) NOT NULL AFTER talle,
ADD COLUMN color VARCHAR(50) NOT NULL AFTER material,
ADD COLUMN genero VARCHAR(20) NOT NULL AFTER color,
ADD COLUMN temporada VARCHAR(20) NOT NULL AFTER genero;

ALTER TABLE accesorios
ADD COLUMN material VARCHAR(100) NOT NULL AFTER tipo,
ADD COLUMN dimensiones VARCHAR(50) AFTER material,
ADD COLUMN peso DECIMAL(4,2) AFTER dimensiones,
ADD COLUMN color VARCHAR(50) NOT NULL AFTER peso;

-- Insertar marcas
INSERT INTO marcas (nombre) VALUES
('Bullpadel'),
('Head'),
('Nox'),
('Adidas'),
('Babolat'),
('Wilson'),
('Dunlop'),
('Varlion'),
('Akkeron'),
('Siux'),
('Nike'),
('Asics'),
('Lacoste'),
('Under Armour'),
('Fila'),
('Ellesse'),
('Tourna'),
('Yonex');

-- Insertar categorías
INSERT INTO categorias (nombre) VALUES
('Paletas'),
('Indumentaria'),
('Accesorios');

-- Insertar productos de ejemplo
INSERT INTO products (marca_id, categoria_id, nombre, descripcion, precio, precio_original, stock, imagen, es_nuevo, en_oferta, descuento) VALUES
-- Paletas
(1, 1, 'Vertex 03', 'Forma diamante, núcleo EVA soft, marco 100% carbono', 299.99, 299.99, 15, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
(2, 1, 'Alpha Pro', 'Forma redonda, núcleo Foam, marco carbono y fibra de vidrio', 249.99, 249.99, 10, '/placeholder.svg?height=300&width=300', FALSE, TRUE, 15),
(4, 1, 'Metalbone', 'Forma diamante, núcleo EVA soft, marco 100% carbono', 289.99, 289.99, 8, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
(3, 1, 'AT10 Luxury', 'Forma lágrima, núcleo HR3, marco 100% carbono', 279.99, 279.99, 12, '/placeholder.svg?height=300&width=300', FALSE, TRUE, 10),
-- Indumentaria
(4, 2, 'Club Tennis', 'Tejido transpirable, tecnología Climalite', 49.99, 49.99, 20, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
(11, 2, 'Court Flex', 'Tejido elástico, bolsillos laterales', 39.99, 39.99, 15, '/placeholder.svg?height=300&width=300', FALSE, FALSE, 0),
(12, 2, 'Gel-Resolution 8', 'Amortiguación Gel, suela de alta durabilidad', 129.99, 129.99, 8, '/placeholder.svg?height=300&width=300', FALSE, TRUE, 20),
(2, 2, 'Pro Player', 'Tejido transpirable, ajuste trasero', 24.99, 24.99, 25, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
-- Accesorios
(5, 3, 'Pure Aero', 'Capacidad para 6 paletas, compartimentos térmicos', 89.99, 89.99, 10, '/placeholder.svg?height=300&width=300', FALSE, FALSE, 0),
(6, 3, 'Pro Overgrip', 'Pack de 3 unidades, máxima absorción', 14.99, 14.99, 30, '/placeholder.svg?height=300&width=300', FALSE, TRUE, 5),
(2, 3, 'Wristband', 'Pack de 2 unidades, tejido absorbente', 9.99, 9.99, 25, '/placeholder.svg?height=300&width=300', FALSE, FALSE, 0),
(1, 3, 'Frame Protector', 'Protector de marco transparente, alta durabilidad', 19.99, 19.99, 15, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
-- Más Paletas
(7, 1, 'SX 600', 'Forma redonda, núcleo EVA, marco carbono', 259.99, 259.99, 10, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
(8, 1, 'Air Veron', 'Forma diamante, núcleo HR3, marco carbono', 329.99, 329.99, 8, '/placeholder.svg?height=300&width=300', FALSE, TRUE, 20),
(9, 1, 'Absolute', 'Forma lágrima, núcleo EVA soft, marco carbono', 299.99, 299.99, 12, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
(10, 1, 'Atomik', 'Forma redonda, núcleo Foam, marco carbono', 279.99, 279.99, 15, '/placeholder.svg?height=300&width=300', FALSE, FALSE, 0),
-- Más Indumentaria
(13, 2, 'Polo Classic', 'Polo de algodón pima, cuello ribeteado', 59.99, 59.99, 20, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
(14, 2, 'HeatGear', 'Camiseta de compresión, tecnología anti-sudor', 45.99, 45.99, 25, '/placeholder.svg?height=300&width=300', FALSE, TRUE, 15),
(15, 2, 'Tennis Classic', 'Polo de punto, diseño retro', 69.99, 69.99, 15, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
(16, 2, 'Performance', 'Camiseta transpirable, tecnología DRY', 34.99, 34.99, 30, '/placeholder.svg?height=300&width=300', FALSE, FALSE, 0),
-- Más Accesorios
(17, 3, 'Tourna Grip', 'Pack de 3 overgrips, máxima absorción', 12.99, 12.99, 40, '/placeholder.svg?height=300&width=300', FALSE, FALSE, 0),
(18, 3, 'Pro Staff', 'Bolso para 2 paletas, compartimento térmico', 79.99, 79.99, 8, '/placeholder.svg?height=300&width=300', TRUE, FALSE, 0),
(5, 3, 'Vibram', 'Zapatillas de pádel, suela no marcante', 89.99, 89.99, 10, '/placeholder.svg?height=300&width=300', FALSE, TRUE, 10),
(6, 3, 'Pro Tour', 'Pack de 3 pelotas, alta durabilidad', 19.99, 19.99, 50, '/placeholder.svg?height=300&width=300', FALSE, FALSE, 0);

-- Insertar en tabla paletas
INSERT INTO paletas (product_id, forma, nucleo, marco, peso, balance, grosor) VALUES
(1, 'Diamante', 'EVA soft', '100% carbono', 365.00, 'Alto', 38.00),
(2, 'Redonda', 'Foam', 'Carbono y fibra de vidrio', 360.00, 'Bajo', 36.00),
(3, 'Diamante', 'EVA soft', '100% carbono', 370.00, 'Alto', 38.00),
(4, 'Lágrima', 'HR3', '100% carbono', 355.00, 'Medio', 37.00),
(13, 'Redonda', 'EVA', 'Carbono', 360.00, 'Bajo', 36.00),
(14, 'Diamante', 'HR3', 'Carbono', 375.00, 'Alto', 38.00),
(15, 'Lágrima', 'EVA soft', 'Carbono', 350.00, 'Medio', 37.00),
(16, 'Redonda', 'Foam', 'Carbono', 365.00, 'Bajo', 36.00);

-- Insertar en tabla indumentaria
INSERT INTO indumentaria (product_id, tipo, talle, material, color, genero, temporada) VALUES
(5, 'Remera', 'M', 'Poliester', 'Negro', 'Unisex', 'Verano'),
(6, 'Pantalón', 'L', 'Poliester', 'Azul', 'Masculino', 'Verano'),
(7, 'Zapatillas', '42', 'Malla sintética', 'Blanco', 'Unisex', 'Todo el año'),
(8, 'Camiseta', 'S', 'Algodón', 'Negro', 'Unisex', 'Verano'),
(17, 'Polo', 'L', 'Algodón pima', 'Blanco', 'Masculino', 'Verano'),
(18, 'Camiseta', 'M', 'Poliester', 'Negro', 'Unisex', 'Todo el año'),
(19, 'Polo', 'XL', 'Punto', 'Azul', 'Masculino', 'Verano'),
(20, 'Camiseta', 'S', 'Poliester', 'Rojo', 'Unisex', 'Todo el año');

-- Insertar en tabla accesorios
INSERT INTO accesorios (product_id, tipo, material, dimensiones, peso, color) VALUES
(9, 'Bolso', 'Poliester', '70x30x30', 850.00, 'Negro'),
(10, 'Overgrip', 'Algodón', NULL, 5.00, 'Blanco'),
(11, 'Muñequera', 'Algodón', NULL, 30.00, 'Negro'),
(12, 'Protector', 'PVC', NULL, 15.00, 'Transparente'),
(21, 'Overgrip', 'Algodón', NULL, 5.00, 'Blanco'),
(22, 'Bolso', 'Poliester', '60x25x25', 750.00, 'Azul'),
(23, 'Zapatillas', 'Cuero sintético', '42', 850.00, 'Blanco'),
(24, 'Pelotas', 'Caucho', NULL, 150.00, 'Amarillo');

-- Actualizar detalles específicos
UPDATE indumentaria SET 
    material = 'Poliester',
    color = 'Negro',
    genero = 'Unisex',
    temporada = 'Verano'
WHERE product_id = 5;

UPDATE indumentaria SET 
    material = 'Poliester',
    color = 'Azul',
    genero = 'Masculino',
    temporada = 'Verano'
WHERE product_id = 6;

UPDATE indumentaria SET 
    material = 'Malla sintética',
    color = 'Blanco',
    genero = 'Unisex',
    temporada = 'Todo el año'
WHERE product_id = 7;

UPDATE indumentaria SET 
    material = 'Algodón',
    color = 'Negro',
    genero = 'Unisex',
    temporada = 'Verano'
WHERE product_id = 8;

UPDATE accesorios SET 
    material = 'Poliester',
    dimensiones = '70x30x30',
    peso = 850.00,
    color = 'Negro'
WHERE product_id = 9;

UPDATE accesorios SET 
    material = 'Algodón',
    dimensiones = NULL,
    peso = 5.00,
    color = 'Blanco'
WHERE product_id = 10;

UPDATE accesorios SET 
    material = 'Algodón',
    dimensiones = NULL,
    peso = 30.00,
    color = 'Negro'
WHERE product_id = 11;

UPDATE accesorios SET 
    material = 'PVC',
    dimensiones = NULL,
    peso = 15.00,
    color = 'Transparente'
WHERE product_id = 12;

