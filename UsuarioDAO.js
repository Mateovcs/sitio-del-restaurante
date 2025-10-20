const Database = require('../config/database');
const Usuario = require('../model/Usuario');

class UsuarioDAO {
    constructor() {
        this.db = Database;
    }

    async findByUsername(username) {
        try {
            const query = 'SELECT * FROM usuarios WHERE username = ?';
            const rows = await this.db.execute(query, [username]);
            
            if (rows.length > 0) {
                return Usuario.fromDatabase(rows[0]);
            }
            return null;
        } catch (error) {
            console.error('Error en UsuarioDAO.findByUsername:', error);
            throw error;
        }
    }

    async findById(idUsuario) {
        try {
            const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';
            const rows = await this.db.execute(query, [idUsuario]);
            
            if (rows.length > 0) {
                return Usuario.fromDatabase(rows[0]);
            }
            return null;
        } catch (error) {
            console.error('Error en UsuarioDAO.findById:', error);
            throw error;
        }
    }

    async findAll() {
        try {
            const query = 'SELECT * FROM usuarios ORDER BY username';
            const rows = await this.db.execute(query);
            
            return rows.map(row => Usuario.fromDatabase(row));
        } catch (error) {
            console.error('Error en UsuarioDAO.findAll:', error);
            throw error;
        }
    }

    async create(usuarioData) {
        try {
            const query = `
                INSERT INTO usuarios (username, password, rol, id_empleado) 
                VALUES (?, ?, ?, ?)
            `;
            const result = await this.db.execute(query, [
                usuarioData.username,
                usuarioData.password,
                usuarioData.rol,
                usuarioData.idEmpleado
            ]);
            
            return result.insertId;
        } catch (error) {
            console.error('Error en UsuarioDAO.create:', error);
            throw error;
        }
    }
}

module.exports = UsuarioDAO;