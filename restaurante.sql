-- =============================================
-- BASE DE DATOS RESTAURANTE - VERSIÓN MEJORADA
-- =============================================

DROP DATABASE IF EXISTS restaurante;
CREATE DATABASE restaurante CHARACTER SET utf8mb4;
USE restaurante;

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

CREATE TABLE clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  direccion VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE mesas (
  id_mesa INT AUTO_INCREMENT PRIMARY KEY,
  numero_mesa INT NOT NULL UNIQUE,
  capacidad INT NOT NULL CHECK (capacidad > 0),
  estado ENUM('libre','ocupada','reservada','mantenimiento') DEFAULT 'libre',
  ubicacion VARCHAR(100)
);

CREATE TABLE empleados (
  id_empleado INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  cargo ENUM('mozo','chef','cajero','administrador') NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  sueldo DECIMAL(10,2) CHECK (sueldo >= 0),
  fecha_contratacion DATE,
  estado ENUM('activo','inactivo','vacaciones') DEFAULT 'activo'
);

-- =============================================
-- TABLA DE USUARIOS PARA LOGIN (NUEVA)
-- =============================================

CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  id_empleado INT UNIQUE,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin','mozo','chef','cajero') NOT NULL,
  estado ENUM('activo','inactivo') DEFAULT 'activo',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado) ON DELETE CASCADE
);

-- =============================================
-- TABLAS DE PRODUCTOS
-- =============================================

CREATE TABLE categorias_comida (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT
);

CREATE TABLE comidas (
  id_comida INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  id_categoria INT,
  tipo ENUM('entrada','principal','ensalada','sopa') NOT NULL,
  imagen VARCHAR(255),
  estado ENUM('disponible','no_disponible') DEFAULT 'disponible',
  tiempo_preparacion INT DEFAULT 15,
  FOREIGN KEY (id_categoria) REFERENCES categorias_comida(id_categoria)
);

CREATE TABLE postres (
  id_postre INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  imagen VARCHAR(255),
  estado ENUM('disponible','no_disponible') DEFAULT 'disponible'
);

CREATE TABLE bebidas (
  id_bebida INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  tamaño ENUM('chico','mediano','grande') DEFAULT 'mediano',
  tipo ENUM('alcoholica','no_alcoholica','gaseosa','jugo','agua') DEFAULT 'no_alcoholica',
  imagen VARCHAR(255),
  estado ENUM('disponible','no_disponible') DEFAULT 'disponible'
);

-- =============================================
-- TABLAS DE OPERACIONES
-- =============================================

CREATE TABLE reservas (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  id_mesa INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  cantidad_personas INT NOT NULL CHECK (cantidad_personas > 0),
  estado ENUM('confirmada','cancelada','pendiente','completada') DEFAULT 'pendiente',
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
  FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa)
);

CREATE TABLE pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT,
  id_mesa INT,
  id_empleado INT,
  fecha_hora DATETIME NOT NULL,
  estado ENUM('recibido','en_preparacion','listo','servido','pagado','cancelado') DEFAULT 'recibido',
  tipo ENUM('mesa','domicilio','recoger') DEFAULT 'mesa',
  observaciones TEXT,
  total DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
  FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa),
  FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

CREATE TABLE detalle_pedido (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_comida INT,
  id_postre INT,
  id_bebida INT,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  observaciones TEXT,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
  FOREIGN KEY (id_comida) REFERENCES comidas(id_comida),
  FOREIGN KEY (id_postre) REFERENCES postres(id_postre),
  FOREIGN KEY (id_bebida) REFERENCES bebidas(id_bebida),
  -- Asegurar que al menos un producto está seleccionado
  CONSTRAINT chk_al_menos_un_producto CHECK (
    (id_comida IS NOT NULL) OR 
    (id_postre IS NOT NULL) OR 
    (id_bebida IS NOT NULL)
  )
);

CREATE TABLE facturas (
  id_factura INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL UNIQUE,
  numero_factura VARCHAR(20) UNIQUE NOT NULL,
  monto_total DECIMAL(10,2) NOT NULL CHECK (monto_total >= 0),
  metodo_pago ENUM('efectivo','tarjeta_debito','tarjeta_credito','transferencia') NOT NULL,
  fecha DATETIME NOT NULL,
  iva DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);

-- =============================================
-- TABLAS DE INVENTARIO
-- =============================================

CREATE TABLE proveedores (
  id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion VARCHAR(150),
  contacto VARCHAR(100),
  estado ENUM('activo','inactivo') DEFAULT 'activo'
);

CREATE TABLE inventario (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad >= 0),
  cantidad_minima INT DEFAULT 0,
  descripcion TEXT,
  unidad_medida ENUM('kg','litros','unidades','gramos') NOT NULL,
  id_proveedor INT,
  precio_compra DECIMAL(10,2),
  fecha_ultima_compra DATE,
  fecha_caducidad DATE,
  estado ENUM('activo','inactivo','agotado') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
);

-- =============================================
-- DATOS DE PRUEBA ESENCIALES
-- =============================================

-- Insertar categorías de comida
INSERT INTO categorias_comida (nombre, descripcion) VALUES 
('Carnes', 'Cortes de carne y preparaciones'),
('Pastas', 'Pastas frescas y salsas'),
('Ensaladas', 'Ensaladas frescas y saludables'),
('Sopas', 'Sopas y cremas'),
('Especialidades', 'Platos especiales de la casa');

-- Insertar empleados
INSERT INTO empleados (nombre, apellido, cargo, telefono, email, sueldo, fecha_contratacion) VALUES 
('María', 'Gonzalez', 'administrador', '111111111', 'maria@restaurante.com', 50000.00, '2023-01-15'),
('Carlos', 'Lopez', 'mozo', '222222222', 'carlos@restaurante.com', 30000.00, '2023-02-01'),
('Ana', 'Martinez', 'chef', '333333333', 'ana@restaurante.com', 45000.00, '2023-01-20'),
('Pedro', 'Ramirez', 'cajero', '444444444', 'pedro@restaurante.com', 28000.00, '2023-03-10');

-- Insertar usuarios para login (password: 123456 - en producción usar bcrypt)
INSERT INTO usuarios (id_empleado, username, password, rol) VALUES 
(1, 'admin', '123456', 'admin'),
(2, 'carlos', '123456', 'mozo'),
(3, 'ana', '123456', 'chef'),
(4, 'pedro', '123456', 'cajero');

-- Insertar mesas
INSERT INTO mesas (numero_mesa, capacidad, ubicacion) VALUES 
(1, 4, 'Terraza'),
(2, 4, 'Terraza'),
(3, 6, 'Salón Principal'),
(4, 6, 'Salón Principal'),
(5, 2, 'Barra'),
(6, 8, 'Sala Privada');

-- Insertar comidas
INSERT INTO comidas (nombre, descripcion, precio, id_categoria, tipo) VALUES 
('Bife de Chorizo', 'Corte premium con papas fritas', 2500.00, 1, 'principal'),
('Lasagna Bolognesa', 'Lasagna casera con salsa bolognesa', 1800.00, 2, 'principal'),
('Ensalada César', 'Lechuga, crutones, parmesano y aderezo césar', 1200.00, 3, 'entrada'),
('Risotto de Hongos', 'Risotto cremoso con hongos silvestres', 2200.00, 5, 'principal'),
('Sopa del Día', 'Sopa casera según disponibilidad', 800.00, 4, 'entrada');

-- Insertar postres
INSERT INTO postres (nombre, descripcion, precio) VALUES 
('Tiramisú', 'Postre italiano con café y cacao', 900.00),
('Cheesecake de Frutos Rojos', 'Tarta de queso con salsa de frutos rojos', 950.00),
('Flan Casero', 'Flan con dulce de leche y crema', 700.00),
('Brownie con Helado', 'Brownie de chocolate con helado de vainilla', 1100.00);

-- Insertar bebidas
INSERT INTO bebidas (nombre, descripcion, precio, tamaño, tipo) VALUES 
('Coca Cola', 'Gaseosa cola 500ml', 500.00, 'mediano', 'gaseosa'),
('Agua Mineral', 'Agua sin gas 500ml', 300.00, 'mediano', 'agua'),
('Jugo de Naranja', 'Jugo natural exprimido', 600.00, 'mediano', 'jugo'),
('Cerveza Artesanal', 'Cerveza rubia 500ml', 800.00, 'mediano', 'alcoholica'),
('Vino Malbec', 'Copa de vino malbec reserva', 1200.00, 'mediano', 'alcoholica');

-- Insertar clientes de ejemplo
INSERT INTO clientes (nombre, apellido, telefono, email, direccion) VALUES 
('Laura', 'Diaz', '555555555', 'laura@email.com', 'Calle 123, Ciudad'),
('Roberto', 'Silva', '666666666', 'roberto@email.com', 'Avenida 456, Ciudad'),
('Sofia', 'Mendoza', '777777777', 'sofia@email.com', 'Boulevard 789, Ciudad');

-- Insertar proveedores
INSERT INTO proveedores (nombre, telefono, email, direccion, contacto) VALUES 
('Carnes Premium S.A.', '888888888', 'ventas@carnespremium.com', 'Ruta 10 km 25', 'Juan Pérez'),
('Verduras Frescas S.R.L.', '999999999', 'pedidos@verdurasfrescas.com', 'Zona Rural Norte', 'María García'),
('Bebidas del Valle', '101010101', 'distribucion@bebidasvalle.com', 'Polígono Industrial', 'Carlos Rodríguez');

-- Insertar productos en inventario
INSERT INTO inventario (nombre, cantidad, cantidad_minima, unidad_medida, id_proveedor, precio_compra) VALUES 
('Carne Vacuna', 50, 10, 'kg', 1, 1500.00),
('Lechuga', 20, 5, 'unidades', 2, 200.00),
('Tomate', 30, 8, 'kg', 2, 300.00),
('Coca Cola', 100, 20, 'unidades', 3, 350.00),
('Queso Parmesano', 15, 3, 'kg', 1, 1800.00);

-- =============================================
-- VISTAS ÚTILES
-- =============================================

CREATE VIEW vista_pedidos_detallados AS
SELECT 
    p.id_pedido,
    p.fecha_hora,
    CONCAT(c.nombre, ' ', c.apellido) as cliente,
    m.numero_mesa,
    CONCAT(e.nombre, ' ', e.apellido) as empleado,
    p.estado as estado_pedido,
    p.total
FROM pedidos p
LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
LEFT JOIN mesas m ON p.id_mesa = m.id_mesa
LEFT JOIN empleados e ON p.id_empleado = e.id_empleado;

CREATE VIEW vista_inventario_bajo_stock AS
SELECT 
    i.nombre,
    i.cantidad,
    i.cantidad_minima,
    i.unidad_medida,
    p.nombre as proveedor,
    p.telefono
FROM inventario i
JOIN proveedores p ON i.id_proveedor = p.id_proveedor
WHERE i.cantidad <= i.cantidad_minima;

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS
-- =============================================

DELIMITER //

CREATE PROCEDURE sp_actualizar_total_pedido(IN p_id_pedido INT)
BEGIN
    UPDATE pedidos p
    SET total = (
        SELECT COALESCE(SUM(subtotal), 0)
        FROM detalle_pedido 
        WHERE id_pedido = p_id_pedido
    )
    WHERE id_pedido = p_id_pedido;
END//

DELIMITER ;

-- =============================================
-- TRIGGERS
-- =============================================

DELIMITER //

CREATE TRIGGER tr_actualizar_subtotal_detalle
BEFORE INSERT ON detalle_pedido
FOR EACH ROW
BEGIN
    SET NEW.subtotal = NEW.cantidad * NEW.precio_unitario;
END//

CREATE TRIGGER tr_actualizar_total_pedido
AFTER INSERT ON detalle_pedido
FOR EACH ROW
BEGIN
    CALL sp_actualizar_total_pedido(NEW.id_pedido);
END//

DELIMITER ;

-- =============================================
-- ÍNDICES PARA MEJOR PERFORMANCE
-- =============================================

CREATE INDEX idx_pedidos_fecha ON pedidos(fecha_hora);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_reservas_fecha ON reservas(fecha);
CREATE INDEX idx_detalle_pedido_pedido ON detalle_pedido(id_pedido);
CREATE INDEX idx_usuarios_username ON usuarios(username);

-- =============================================
-- MENSAJE DE CONFIRMACIÓN
-- =============================================

SELECT '✅ BASE DE DATOS RESTAURANTE CREADA EXITOSAMENTE' as mensaje;
SELECT COUNT(*) as total_tablas FROM information_schema.tables 
WHERE table_schema = 'restaurante';