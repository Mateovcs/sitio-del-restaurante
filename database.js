const mysql = require('mysql2/promise');

class Database {
    constructor() {
        this.config = {
            host: 'localhost',
            user: 'root',
            password: '', // tu password de MySQL
            database: 'restaurante',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        };
        this.pool = mysql.createPool(this.config);
    }

    async getConnection() {
        try {
            const connection = await this.pool.getConnection();
            console.log('✅ Conexión a BD exitosa');
            return connection;
        } catch (error) {
            console.error('❌ Error conectando a BD:', error);
            throw error;
        }
    }

    // Método para ejecutar queries simples
    async execute(query, params = []) {
        try {
            const [rows] = await this.pool.execute(query, params);
            return rows;
        } catch (error) {
            console.error('❌ Error en query:', error);
            throw error;
        }
    }
}

// Exportamos una instancia única (Singleton)
module.exports = new Database();