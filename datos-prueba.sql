-- =============================================
-- DATOS DE PRUEBA PARA SISTEMA RESTAURANTE
-- =============================================

USE restaurante;

-- =============================================
-- DATOS DE PRUEBA - CLIENTES
-- =============================================

INSERT INTO clientes (nombre, apellido, telefono, email, direccion) VALUES
('Juan', 'Pérez', '555-0101', 'juan.perez@email.com', 'Calle Principal 123'),
('María', 'García', '555-0102', 'maria.garcia@email.com', 'Avenida Central 456'),
('Carlos', 'Rodríguez', '555-0103', 'carlos.rodriguez@email.com', 'Plaza Mayor 789'),
('Ana', 'López', '555-0104', 'ana.lopez@email.com', 'Calle Secundaria 321'),
('Pedro', 'Martínez', '555-0105', 'pedro.martinez@email.com', 'Boulevard Norte 654');

-- =============================================
-- DATOS DE PRUEBA - EMPLEADOS
-- =============================================

INSERT INTO empleados (nombre, apellido, cargo, telefono, email, sueldo, fecha_contratacion) VALUES
('Roberto', 'Sánchez', 'chef', '555-0201', 'roberto.sanchez@restaurante.com', 2500.00, '2023-01-15'),
('Laura', 'Fernández', 'mozo', '555-0202', 'laura.fernandez@restaurante.com', 1800.00, '2023-02-01'),
('Miguel', 'Torres', 'cajero', '555-0203', 'miguel.torres@restaurante.com', 1600.00, '2023-03-10'),
('Carmen', 'Ruiz', 'administrador', '555-0204', 'carmen.ruiz@restaurante.com', 3000.00, '2022-12-01'),
('David', 'Jiménez', 'mozo', '555-0205', 'david.jimenez@restaurante.com', 1750.00, '2023-04-15');

-- =============================================
-- DATOS DE PRUEBA - USUARIOS PARA LOGIN
-- =============================================

INSERT INTO usuarios (id_empleado, username, password, rol) VALUES
(4, 'admin', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0D2E4F6G8H0I2J4K6L8M0N2O4P6Q8R0S2T4', 'admin'),
(1, 'chef', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0D2E4F6G8H0I2J4K6L8M0N2O4P6Q8R0S2T4', 'chef'),
(2, 'mozo1', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0D2E4F6G8H0I2J4K6L8M0N2O4P6Q8R0S2T4', 'mozo'),
(3, 'cajero', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0D2E4F6G8H0I2J4K6L8M0N2O4P6Q8R0S2T4', 'cajero');

-- =============================================
-- DATOS DE PRUEBA - MESAS
-- =============================================

INSERT INTO mesas (numero_mesa, capacidad, ubicacion) VALUES
(1, 2, 'Ventana'),
(2, 4, 'Centro'),
(3, 6, 'Terraza'),
(4, 2, 'Bar'),
(5, 8, 'Privado'),
(6, 4, 'Centro'),
(7, 2, 'Ventana'),
(8, 6, 'Terraza');

-- =============================================
-- DATOS DE PRUEBA - PRODUCTOS
-- =============================================

-- COMIDAS
INSERT INTO comidas (nombre, descripcion, precio, id_categoria, tipo, estado) VALUES
('Hamburguesa Clásica', 'Hamburguesa con queso, lechuga y tomate', 12.50, 1, 'principal', 'disponible'),
('Pizza Margherita', 'Pizza con mozzarella, tomate y albahaca', 15.00, 1, 'principal', 'disponible'),
('Ensalada César', 'Ensalada con pollo, crutones y aderezo césar', 10.00, 1, 'entrada', 'disponible'),
('Pasta Carbonara', 'Pasta con salsa carbonara y panceta', 14.00, 1, 'principal', 'disponible'),
('Sushi Variado', 'Selección de sushi fresco', 18.00, 2, 'principal', 'disponible'),
('Tacos Mexicanos', 'Tacos con carne, cebolla y cilantro', 11.00, 3, 'principal', 'disponible');

-- POSTRES
INSERT INTO postres (nombre, descripcion, precio, estado) VALUES
('Tiramisú', 'Postre italiano con café y mascarpone', 6.50, 'disponible'),
('Helado de Vainilla', 'Helado artesanal con toppings', 4.50, 'disponible'),
('Brownie con Helado', 'Brownie de chocolate con helado', 7.00, 'disponible'),
('Frutas de Temporada', 'Selección de frutas frescas', 5.50, 'disponible');

-- BEBIDAS
INSERT INTO bebidas (nombre, descripcion, precio, tipo, estado) VALUES
('Coca Cola', 'Refresco de cola', 2.50, 'refresco', 'disponible'),
('Agua Mineral', 'Agua con gas', 2.00, 'agua', 'disponible'),
('Cerveza Nacional', 'Cerveza rubia local', 3.50, 'cerveza', 'disponible'),
('Vino Tinto', 'Vino tinto de la casa', 8.00, 'vino', 'disponible'),
('Café Espresso', 'Café italiano fuerte', 2.50, 'cafe', 'disponible'),
('Jugo de Naranja', 'Jugo natural exprimido', 3.00, 'jugo', 'disponible');

-- =============================================
-- DATOS DE PRUEBA - PEDIDOS
-- =============================================

INSERT INTO pedidos (id_cliente, id_mesa, id_empleado, estado, total) VALUES
(1, 1, 2, 'completado', 28.50),
(2, 2, 2, 'preparando', 42.00),
(3, 3, 5, 'pendiente', 31.50),
(4, 4, 2, 'entregado', 19.00),
(5, 5, 5, 'cancelado', 15.50),
(1, 6, 2, 'preparando', 35.00),
(2, 7, 5, 'pendiente', 22.50),
(3, 8, 2, 'completado', 45.00);

-- =============================================
-- DATOS DE PRUEBA - DETALLE DE PEDIDOS
-- =============================================

-- Pedido 1: Hamburguesa + Coca Cola + Tiramisú
INSERT INTO detalle_pedido (id_pedido, tipo_producto, id_producto, cantidad, precio_unitario) VALUES
(1, 'comida', 1, 1, 12.50),
(1, 'bebida', 1, 1, 2.50),
(1, 'postre', 1, 1, 6.50);

-- Pedido 2: Pizza + Cerveza + Helado
INSERT INTO detalle_pedido (id_pedido, tipo_producto, id_producto, cantidad, precio_unitario) VALUES
(2, 'comida', 2, 1, 15.00),
(2, 'bebida', 3, 2, 3.50),
(2, 'postre', 2, 1, 4.50);

-- Pedido 3: Ensalada + Agua + Frutas
INSERT INTO detalle_pedido (id_pedido, tipo_producto, id_producto, cantidad, precio_unitario) VALUES
(3, 'comida', 3, 1, 10.00),
(3, 'bebida', 2, 1, 2.00),
(3, 'postre', 4, 1, 5.50);

-- Pedido 4: Pasta + Vino
INSERT INTO detalle_pedido (id_pedido, tipo_producto, id_producto, cantidad, precio_unitario) VALUES
(4, 'comida', 4, 1, 14.00),
(4, 'bebida', 4, 1, 8.00);

-- Pedido 5: Sushi + Café (cancelado)
INSERT INTO detalle_pedido (id_pedido, tipo_producto, id_producto, cantidad, precio_unitario) VALUES
(5, 'comida', 5, 1, 18.00),
(5, 'bebida', 5, 1, 2.50);

-- Pedido 6: Tacos + Jugo + Brownie
INSERT INTO detalle_pedido (id_pedido, tipo_producto, id_producto, cantidad, precio_unitario) VALUES
(6, 'comida', 6, 2, 11.00),
(6, 'bebida', 6, 1, 3.00),
(6, 'postre', 3, 1, 7.00);

-- Pedido 7: Hamburguesa + Coca Cola
INSERT INTO detalle_pedido (id_pedido, tipo_producto, id_producto, cantidad, precio_unitario) VALUES
(7, 'comida', 1, 1, 12.50),
(7, 'bebida', 1, 1, 2.50);

-- Pedido 8: Pizza + Ensalada + Cerveza + Tiramisú
INSERT INTO detalle_pedido (id_pedido, tipo_producto, id_producto, cantidad, precio_unitario) VALUES
(8, 'comida', 2, 1, 15.00),
(8, 'comida', 3, 1, 10.00),
(8, 'bebida', 3, 2, 3.50),
(8, 'postre', 1, 1, 6.50);

-- =============================================
-- MENSAJE DE CONFIRMACIÓN
-- =============================================

SELECT '✅ DATOS DE PRUEBA INSERTADOS EXITOSAMENTE' as mensaje;
SELECT
    (SELECT COUNT(*) FROM clientes) as clientes,
    (SELECT COUNT(*) FROM empleados) as empleados,
    (SELECT COUNT(*) FROM mesas) as mesas,
    (SELECT COUNT(*) FROM comidas) as comidas,
    (SELECT COUNT(*) FROM postres) as postres,
    (SELECT COUNT(*) FROM bebidas) as bebidas,
    (SELECT COUNT(*) FROM pedidos) as pedidos,
    (SELECT COUNT(*) FROM detalle_pedido) as detalle_pedidos;
