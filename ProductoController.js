const ProductoDAO = require('../dao/ProductoDAO');

class ProductoController {
    constructor() {
        this.productoDAO = new ProductoDAO();
    }

    // Obtener todos los productos
    async obtenerProductos() {
        try {
            console.log('📦 Obteniendo todos los productos...');
            const productos = await this.productoDAO.findAll();
            
            return {
                success: true,
                productos: productos.map(producto => producto.toJSON()),
                total: productos.length,
                porTipo: this.contarPorTipo(productos)
            };
        } catch (error) {
            console.error('💥 Error en ProductoController.obtenerProductos:', error);
            return {
                success: false,
                message: 'Error al obtener productos'
            };
        }
    }

    // Obtener productos por tipo
    async obtenerProductosPorTipo(tipo) {
        try {
            console.log(`📦 Obteniendo productos de tipo: ${tipo}`);
            const productos = await this.productoDAO.findByTipo(tipo);
            
            return {
                success: true,
                productos: productos.map(producto => producto.toJSON()),
                total: productos.length,
                tipo: tipo
            };
        } catch (error) {
            console.error('💥 Error en ProductoController.obtenerProductosPorTipo:', error);
            return {
                success: false,
                message: 'Error al obtener productos por tipo'
            };
        }
    }

    // Obtener productos por categoría
    async obtenerProductosPorCategoria(categoria) {
        try {
            console.log(`📦 Obteniendo productos por categoría: ${categoria}`);
            const productos = await this.productoDAO.findByCategoria(categoria);
            
            return {
                success: true,
                productos: productos.map(producto => producto.toJSON()),
                total: productos.length,
                categoria: categoria
            };
        } catch (error) {
            console.error('💥 Error en ProductoController.obtenerProductosPorCategoria:', error);
            return {
                success: false,
                message: 'Error al obtener productos por categoría'
            };
        }
    }

    // Buscar productos por nombre
    async buscarProductos(nombre) {
        try {
            console.log(`🔍 Buscando productos por nombre: ${nombre}`);
            const productos = await this.productoDAO.findByNombre(nombre);
            
            return {
                success: true,
                productos: productos.map(producto => producto.toJSON()),
                total: productos.length,
                busqueda: nombre
            };
        } catch (error) {
            console.error('💥 Error en ProductoController.buscarProductos:', error);
            return {
                success: false,
                message: 'Error al buscar productos'
            };
        }
    }

    // Obtener producto específico
    async obtenerProducto(id, tipo) {
        try {
            console.log(`🔍 Obteniendo producto ID: ${id}, tipo: ${tipo}`);
            const producto = await this.productoDAO.findById(id, tipo);
            
            if (producto) {
                return {
                    success: true,
                    producto: producto.toJSON()
                };
            } else {
                return {
                    success: false,
                    message: 'Producto no encontrado'
                };
            }
        } catch (error) {
            console.error('💥 Error en ProductoController.obtenerProducto:', error);
            return {
                success: false,
                message: 'Error al obtener producto'
            };
        }
    }

    // Actualizar estado de producto
    async actualizarEstadoProducto(id, tipo, estado) {
        try {
            console.log(`✏️ Actualizando estado del producto ${id} (${tipo}) a: ${estado}`);
            
            const estadosValidos = ['disponible', 'no_disponible'];
            if (!estadosValidos.includes(estado)) {
                return {
                    success: false,
                    message: 'Estado no válido. Use: disponible o no_disponible'
                };
            }

            const actualizado = await this.productoDAO.actualizarEstado(id, tipo, estado);
            
            if (actualizado) {
                return {
                    success: true,
                    message: `Estado del producto actualizado a: ${estado}`
                };
            } else {
                return {
                    success: false,
                    message: 'Producto no encontrado'
                };
            }
        } catch (error) {
            console.error('💥 Error en ProductoController.actualizarEstadoProducto:', error);
            return {
                success: false,
                message: 'Error al actualizar estado del producto'
            };
        }
    }

    // Método auxiliar para contar productos por tipo
    contarPorTipo(productos) {
        const conteo = {
            comida: 0,
            postre: 0,
            bebida: 0,
            total: productos.length
        };

        productos.forEach(producto => {
            if (conteo.hasOwnProperty(producto.tipo)) {
                conteo[producto.tipo]++;
            }
        });

        return conteo;
    }

    // Obtener categorías disponibles
    async obtenerCategorias() {
        try {
            console.log('🏷️ Obteniendo categorías disponibles...');
            const productos = await this.productoDAO.findAll();
            
            const categorias = {};
            productos.forEach(producto => {
                if (!categorias[producto.tipo]) {
                    categorias[producto.tipo] = new Set();
                }
                categorias[producto.tipo].add(producto.categoria);
            });

            // Convertir Sets a Arrays
            const categoriasFormateadas = {};
            Object.keys(categorias).forEach(tipo => {
                categoriasFormateadas[tipo] = Array.from(categorias[tipo]);
            });

            return {
                success: true,
                categorias: categoriasFormateadas
            };
        } catch (error) {
            console.error('💥 Error en ProductoController.obtenerCategorias:', error);
            return {
                success: false,
                message: 'Error al obtener categorías'
            };
        }
    }
}

module.exports = ProductoController;