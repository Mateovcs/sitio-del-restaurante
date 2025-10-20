const Database = require('../config/database');
const Producto = require('../model/Producto');

class ProductoDAO {
    constructor() {
        this.db = Database;
    }

    // Obtener todos los productos (unificando comidas, postres y bebidas)
    async findAll() {
        try {
            console.log('🛍️ Obteniendo todos los productos...');

            // Consultar todas las tablas de productos - FORMA CORRECTA
            const comidasResult = await this.db.execute('SELECT * FROM comidas WHERE estado = "disponible"');
            const postresResult = await this.db.execute('SELECT * FROM postres WHERE estado = "disponible"');
            const bebidasResult = await this.db.execute('SELECT * FROM bebidas WHERE estado = "disponible"');

            // this.db.execute devuelve las rows directamente
            const comidas = comidasResult || [];
            const postres = postresResult || [];
            const bebidas = bebidasResult || [];

            // Convertir a objetos Producto
            const productosComidas = comidas.map(row => Producto.fromComida(row));
            const productosPostres = postres.map(row => Producto.fromPostre(row));
            const productosBebidas = bebidas.map(row => Producto.fromBebida(row));

            // Combinar todos los productos
            const todosProductos = [
                ...productosComidas,
                ...productosPostres,
                ...productosBebidas
            ];

            console.log(`✅ Encontrados ${todosProductos.length} productos`);
            return todosProductos;

        } catch (error) {
            console.error('💥 Error en ProductoDAO.findAll:', error);
            throw error;
        }
    }

    async findByTipo(tipo) {
        try {
            console.log(`🔍 Buscando productos de tipo: ${tipo}`);

            let query, mapper;

            switch (tipo) {
                case 'comida':
                    query = 'SELECT * FROM comidas WHERE estado = "disponible"';
                    mapper = Producto.fromComida;
                    break;
                case 'postre':
                    query = 'SELECT * FROM postres WHERE estado = "disponible"';
                    mapper = Producto.fromPostre;
                    break;
                case 'bebida':
                    query = 'SELECT * FROM bebidas WHERE estado = "disponible"';
                    mapper = Producto.fromBebida;
                    break;
                default:
                    throw new Error('Tipo de producto no válido');
            }

            const result = await this.db.execute(query);
            const rows = result[0] || []; // Tomar solo las filas
            const productos = rows.map(row => mapper(row));

            console.log(`✅ Encontrados ${productos.length} productos de tipo ${tipo}`);
            return productos;

        } catch (error) {
            console.error('💥 Error en ProductoDAO.findByTipo:', error);
            throw error;
        }
    }

    // Obtener productos por categoría
    async findByCategoria(categoria) {
        try {
            console.log(`🔍 Buscando productos por categoría: ${categoria}`);
            
            // Buscar en comidas por categoría/tipo
            const [comidas] = await this.db.execute(
                'SELECT * FROM comidas WHERE tipo = ? AND estado = "disponible"', 
                [categoria]
            );
            
            const productos = comidas.map(row => Producto.fromComida(row));
            
            console.log(`✅ Encontrados ${productos.length} productos en categoría ${categoria}`);
            return productos;
            
        } catch (error) {
            console.error('💥 Error en ProductoDAO.findByCategoria:', error);
            throw error;
        }
    }

    // Buscar productos por nombre
    async findByNombre(nombre) {
        try {
            console.log(`🔍 Buscando productos por nombre: ${nombre}`);
            
            // Buscar en todas las tablas
            const [comidas] = await this.db.execute(
                'SELECT * FROM comidas WHERE nombre LIKE ? AND estado = "disponible"', 
                [`%${nombre}%`]
            );
            const [postres] = await this.db.execute(
                'SELECT * FROM postres WHERE nombre LIKE ? AND estado = "disponible"', 
                [`%${nombre}%`]
            );
            const [bebidas] = await this.db.execute(
                'SELECT * FROM bebidas WHERE nombre LIKE ? AND estado = "disponible"', 
                [`%${nombre}%`]
            );
            
            const productos = [
                ...comidas.map(row => Producto.fromComida(row)),
                ...postres.map(row => Producto.fromPostre(row)),
                ...bebidas.map(row => Producto.fromBebida(row))
            ];
            
            console.log(`✅ Encontrados ${productos.length} productos con nombre "${nombre}"`);
            return productos;
            
        } catch (error) {
            console.error('💥 Error en ProductoDAO.findByNombre:', error);
            throw error;
        }
    }

    // Obtener producto por ID y tipo
    async findById(id, tipo) {
        try {
            console.log(`🔍 Buscando producto ID: ${id}, tipo: ${tipo}`);
            
            let query, mapper;
            
            switch (tipo) {
                case 'comida':
                    query = 'SELECT * FROM comidas WHERE id_comida = ?';
                    mapper = Producto.fromComida;
                    break;
                case 'postre':
                    query = 'SELECT * FROM postres WHERE id_postre = ?';
                    mapper = Producto.fromPostre;
                    break;
                case 'bebida':
                    query = 'SELECT * FROM bebidas WHERE id_bebida = ?';
                    mapper = Producto.fromBebida;
                    break;
                default:
                    throw new Error('Tipo de producto no válido');
            }
            
            const [rows] = await this.db.execute(query, [id]);
            
            if (rows.length > 0) {
                const producto = mapper(rows[0]);
                console.log(`✅ Producto encontrado: ${producto.nombre}`);
                return producto;
            }
            
            console.log('❌ Producto no encontrado');
            return null;
            
        } catch (error) {
            console.error('💥 Error en ProductoDAO.findById:', error);
            throw error;
        }
    }

    // Actualizar estado de producto
    async actualizarEstado(id, tipo, nuevoEstado) {
        try {
            console.log(`✏️ Actualizando estado de producto ${id} (${tipo}) a: ${nuevoEstado}`);
            
            let tabla;
            switch (tipo) {
                case 'comida': tabla = 'comidas'; break;
                case 'postre': tabla = 'postres'; break;
                case 'bebida': tabla = 'bebidas'; break;
                default: throw new Error('Tipo de producto no válido');
            }
            
            const query = `UPDATE ${tabla} SET estado = ? WHERE id_${tabla.slice(0, -1)} = ?`;
            const result = await this.db.execute(query, [nuevoEstado, id]);
            
            const actualizado = result.affectedRows > 0;
            console.log(actualizado ? '✅ Estado actualizado' : '❌ Producto no encontrado');
            return actualizado;
            
        } catch (error) {
            console.error('💥 Error en ProductoDAO.actualizarEstado:', error);
            throw error;
        }
    }
}

module.exports = ProductoDAO;