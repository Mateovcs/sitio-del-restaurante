const Database = require('../config/database');
const Pedido = require('../model/Pedido');

class PedidoDAO {
    constructor() {
        this.db = Database;
    }

    // Obtener todos los pedidos
    async findAll() {
        try {
            const query = `
                SELECT p.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                       m.numero_mesa, e.nombre as empleado_nombre, e.apellido as empleado_apellido
                FROM pedidos p
                LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
                LEFT JOIN mesas m ON p.id_mesa = m.id_mesa
                LEFT JOIN empleados e ON p.id_empleado = e.id_empleado
                ORDER BY p.fecha_hora DESC
            `;
            const rows = await this.db.execute(query);

            return rows.map(row => Pedido.fromDatabase(row));
        } catch (error) {
            console.error('Error en PedidoDAO.findAll:', error);
            throw error;
        }
    }

    // Obtener pedido por ID
    async findById(idPedido) {
        try {
            const query = `
                SELECT p.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                       m.numero_mesa, e.nombre as empleado_nombre, e.apellido as empleado_apellido
                FROM pedidos p
                LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
                LEFT JOIN mesas m ON p.id_mesa = m.id_mesa
                LEFT JOIN empleados e ON p.id_empleado = e.id_empleado
                WHERE p.id_pedido = ?
            `;
            const rows = await this.db.execute(query, [idPedido]);

            if (rows.length > 0) {
                return Pedido.fromDatabase(rows[0]);
            }
            return null;
        } catch (error) {
            console.error('Error en PedidoDAO.findById:', error);
            throw error;
        }
    }

    // Obtener pedidos por estado
    async findByEstado(estado) {
        try {
            const query = `
                SELECT p.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                       m.numero_mesa, e.nombre as empleado_nombre, e.apellido as empleado_apellido
                FROM pedidos p
                LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
                LEFT JOIN mesas m ON p.id_mesa = m.id_mesa
                LEFT JOIN empleados e ON p.id_empleado = e.id_empleado
                WHERE p.estado = ?
                ORDER BY p.fecha_hora DESC
            `;
            const rows = await this.db.execute(query, [estado]);

            return rows.map(row => Pedido.fromDatabase(row));
        } catch (error) {
            console.error('Error en PedidoDAO.findByEstado:', error);
            throw error;
        }
    }

    // Obtener pedidos por cliente
    async findByCliente(idCliente) {
        try {
            const query = `
                SELECT p.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                       m.numero_mesa, e.nombre as empleado_nombre, e.apellido as empleado_apellido
                FROM pedidos p
                LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
                LEFT JOIN mesas m ON p.id_mesa = m.id_mesa
                LEFT JOIN empleados e ON p.id_empleado = e.id_empleado
                WHERE p.id_cliente = ?
                ORDER BY p.fecha_hora DESC
            `;
            const rows = await this.db.execute(query, [idCliente]);

            return rows.map(row => Pedido.fromDatabase(row));
        } catch (error) {
            console.error('Error en PedidoDAO.findByCliente:', error);
            throw error;
        }
    }

    // Crear nuevo pedido
    async create(pedidoData) {
        try {
            const query = `
                INSERT INTO pedidos (id_cliente, id_mesa, id_empleado, fecha_hora, estado, tipo, observaciones, total)
                VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)
            `;
            const result = await this.db.execute(query, [
                pedidoData.idCliente,
                pedidoData.idMesa,
                pedidoData.idEmpleado,
                pedidoData.estado || 'recibido',
                pedidoData.tipo || 'mesa',
                pedidoData.observaciones,
                pedidoData.total || 0
            ]);

            return result.insertId;
        } catch (error) {
            console.error('Error en PedidoDAO.create:', error);
            throw error;
        }
    }

    // Actualizar pedido
    async update(idPedido, pedidoData) {
        try {
            const query = `
                UPDATE pedidos
                SET id_cliente = ?, id_mesa = ?, id_empleado = ?, estado = ?, tipo = ?, observaciones = ?, total = ?
                WHERE id_pedido = ?
            `;
            const result = await this.db.execute(query, [
                pedidoData.idCliente,
                pedidoData.idMesa,
                pedidoData.idEmpleado,
                pedidoData.estado,
                pedidoData.tipo,
                pedidoData.observaciones,
                pedidoData.total,
                idPedido
            ]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en PedidoDAO.update:', error);
            throw error;
        }
    }

    // Actualizar estado del pedido
    async actualizarEstado(idPedido, nuevoEstado) {
        try {
            const query = 'UPDATE pedidos SET estado = ? WHERE id_pedido = ?';
            const result = await this.db.execute(query, [nuevoEstado, idPedido]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en PedidoDAO.actualizarEstado:', error);
            throw error;
        }
    }

    // Eliminar pedido
    async delete(idPedido) {
        try {
            const query = 'DELETE FROM pedidos WHERE id_pedido = ?';
            const result = await this.db.execute(query, [idPedido]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en PedidoDAO.delete:', error);
            throw error;
        }
    }

    // Obtener pedidos activos (no pagados ni cancelados)
    async findActivos() {
        try {
            const query = `
                SELECT p.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                       m.numero_mesa, e.nombre as empleado_nombre, e.apellido as empleado_apellido
                FROM pedidos p
                LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
                LEFT JOIN mesas m ON p.id_mesa = m.id_mesa
                LEFT JOIN empleados e ON p.id_empleado = e.id_empleado
                WHERE p.estado IN ('recibido', 'en_preparacion', 'listo', 'servido')
                ORDER BY p.fecha_hora DESC
            `;
            const rows = await this.db.execute(query);

            return rows.map(row => Pedido.fromDatabase(row));
        } catch (error) {
            console.error('Error en PedidoDAO.findActivos:', error);
            throw error;
        }
    }

    // Obtener estadísticas básicas
    async getEstadisticas() {
        try {
            const query = `
                SELECT
                    COUNT(*) as total_pedidos,
                    SUM(CASE WHEN estado = 'pagado' THEN 1 ELSE 0 END) as pedidos_pagados,
                    SUM(CASE WHEN estado IN ('recibido', 'en_preparacion', 'listo', 'servido') THEN 1 ELSE 0 END) as pedidos_activos,
                    SUM(CASE WHEN estado = 'cancelado' THEN 1 ELSE 0 END) as pedidos_cancelados,
                    SUM(CASE WHEN estado = 'pagado' THEN total ELSE 0 END) as total_ventas
                FROM pedidos
            `;
            const rows = await this.db.execute(query);

            return rows[0];
        } catch (error) {
            console.error('Error en PedidoDAO.getEstadisticas:', error);
            throw error;
        }
    }
}

module.exports = PedidoDAO;
