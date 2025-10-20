const Database = require('../config/database');
const Cliente = require('../model/Cliente');

class ClienteDAO {
    constructor() {
        this.db = Database;
    }

    async findAll() {
        try {
            const query = 'SELECT * FROM clientes ORDER BY nombre, apellido';
            const rows = await this.db.execute(query);
            
            return rows.map(row => Cliente.fromDatabase(row));
        } catch (error) {
            console.error('Error en ClienteDAO.findAll:', error);
            throw error;
        }
    }

    async findById(idCliente) {
        try {
            const query = 'SELECT * FROM clientes WHERE id_cliente = ?';
            const rows = await this.db.execute(query, [idCliente]);
            
            if (rows.length > 0) {
                return Cliente.fromDatabase(rows[0]);
            }
            return null;
        } catch (error) {
            console.error('Error en ClienteDAO.findById:', error);
            throw error;
        }
    }

    async findByNombre(nombre) {
        try {
            const query = 'SELECT * FROM clientes WHERE nombre LIKE ? OR apellido LIKE ?';
            const rows = await this.db.execute(query, [`%${nombre}%`, `%${nombre}%`]);
            
            return rows.map(row => Cliente.fromDatabase(row));
        } catch (error) {
            console.error('Error en ClienteDAO.findByNombre:', error);
            throw error;
        }
    }

    async create(clienteData) {
        try {
            const query = `
                INSERT INTO clientes (nombre, apellido, telefono, email, direccion) 
                VALUES (?, ?, ?, ?, ?)
            `;
            const result = await this.db.execute(query, [
                clienteData.nombre,
                clienteData.apellido,
                clienteData.telefono,
                clienteData.email,
                clienteData.direccion
            ]);
            
            return result.insertId;
        } catch (error) {
            console.error('Error en ClienteDAO.create:', error);
            throw error;
        }
    }

    async update(idCliente, clienteData) {
        try {
            const query = `
                UPDATE clientes 
                SET nombre = ?, apellido = ?, telefono = ?, email = ?, direccion = ?
                WHERE id_cliente = ?
            `;
            const result = await this.db.execute(query, [
                clienteData.nombre,
                clienteData.apellido,
                clienteData.telefono,
                clienteData.email,
                clienteData.direccion,
                idCliente
            ]);
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en ClienteDAO.update:', error);
            throw error;
        }
    }

    async delete(idCliente) {
        try {
            const query = 'DELETE FROM clientes WHERE id_cliente = ?';
            const result = await this.db.execute(query, [idCliente]);
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en ClienteDAO.delete:', error);
            throw error;
        }
    }
}

module.exports = ClienteDAO;