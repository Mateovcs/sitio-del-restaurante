const PedidoDAO = require('../dao/PedidoDAO');

class PedidoController {
    constructor() {
        this.pedidoDAO = new PedidoDAO();
    }

    // Obtener todos los pedidos
    async obtenerPedidos() {
        try {
            console.log('📋 Obteniendo lista de pedidos...');
            const pedidos = await this.pedidoDAO.findAll();

            console.log(`✅ Encontrados ${pedidos.length} pedidos`);
            return {
                success: true,
                pedidos: pedidos.map(pedido => pedido.toJSON()),
                total: pedidos.length
            };
        } catch (error) {
            console.error('💥 Error en PedidoController.obtenerPedidos:', error);
            return {
                success: false,
                message: 'Error al obtener pedidos'
            };
        }
    }

    // Obtener pedidos activos
    async obtenerPedidosActivos() {
        try {
            console.log('📋 Obteniendo pedidos activos...');
            const pedidos = await this.pedidoDAO.findActivos();

            console.log(`✅ Encontrados ${pedidos.length} pedidos activos`);
            return {
                success: true,
                pedidos: pedidos.map(pedido => pedido.toJSON()),
                total: pedidos.length
            };
        } catch (error) {
            console.error('💥 Error en PedidoController.obtenerPedidosActivos:', error);
            return {
                success: false,
                message: 'Error al obtener pedidos activos'
            };
        }
    }

    // Obtener pedido por ID
    async obtenerPedidoPorId(idPedido) {
        try {
            console.log(`🔍 Buscando pedido ID: ${idPedido}`);
            const pedido = await this.pedidoDAO.findById(idPedido);

            if (pedido) {
                console.log(`✅ Pedido encontrado: ${pedido.idPedido}`);
                return {
                    success: true,
                    pedido: pedido.toJSON()
                };
            } else {
                console.log('❌ Pedido no encontrado');
                return {
                    success: false,
                    message: 'Pedido no encontrado'
                };
            }
        } catch (error) {
            console.error('💥 Error en PedidoController.obtenerPedidoPorId:', error);
            return {
                success: false,
                message: 'Error al buscar pedido'
            };
        }
    }

    // Obtener pedidos por estado
    async obtenerPedidosPorEstado(estado) {
        try {
            console.log(`📋 Obteniendo pedidos con estado: ${estado}`);
            const pedidos = await this.pedidoDAO.findByEstado(estado);

            console.log(`✅ Encontrados ${pedidos.length} pedidos con estado ${estado}`);
            return {
                success: true,
                pedidos: pedidos.map(pedido => pedido.toJSON()),
                total: pedidos.length,
                estado: estado
            };
        } catch (error) {
            console.error('💥 Error en PedidoController.obtenerPedidosPorEstado:', error);
            return {
                success: false,
                message: 'Error al obtener pedidos por estado'
            };
        }
    }

    // Obtener pedidos por cliente
    async obtenerPedidosPorCliente(idCliente) {
        try {
            console.log(`📋 Obteniendo pedidos del cliente ID: ${idCliente}`);
            const pedidos = await this.pedidoDAO.findByCliente(idCliente);

            console.log(`✅ Encontrados ${pedidos.length} pedidos del cliente`);
            return {
                success: true,
                pedidos: pedidos.map(pedido => pedido.toJSON()),
                total: pedidos.length,
                idCliente: idCliente
            };
        } catch (error) {
            console.error('💥 Error en PedidoController.obtenerPedidosPorCliente:', error);
            return {
                success: false,
                message: 'Error al obtener pedidos del cliente'
            };
        }
    }

    // Crear nuevo pedido
    async crearPedido(pedidoData) {
        try {
            console.log('➕ Creando nuevo pedido');

            // Validaciones básicas
            if (!pedidoData.idCliente) {
                return {
                    success: false,
                    message: 'El ID del cliente es requerido'
                };
            }

            // Calcular total si no viene
            if (!pedidoData.total) {
                pedidoData.total = 0;
            }

            const nuevoPedidoId = await this.pedidoDAO.create(pedidoData);

            console.log(`✅ Pedido creado con ID: ${nuevoPedidoId}`);
            return {
                success: true,
                message: 'Pedido creado exitosamente',
                idPedido: nuevoPedidoId
            };
        } catch (error) {
            console.error('💥 Error en PedidoController.crearPedido:', error);
            return {
                success: false,
                message: 'Error al crear pedido'
            };
        }
    }

    // Actualizar pedido
    async actualizarPedido(idPedido, pedidoData) {
        try {
            console.log(`✏️ Actualizando pedido ID: ${idPedido}`);

            const actualizado = await this.pedidoDAO.update(idPedido, pedidoData);

            if (actualizado) {
                console.log(`✅ Pedido actualizado correctamente`);
                return {
                    success: true,
                    message: 'Pedido actualizado exitosamente'
                };
            } else {
                return {
                    success: false,
                    message: 'Pedido no encontrado'
                };
            }
        } catch (error) {
            console.error('💥 Error en PedidoController.actualizarPedido:', error);
            return {
                success: false,
                message: 'Error al actualizar pedido'
            };
        }
    }

    // Actualizar estado del pedido
    async actualizarEstadoPedido(idPedido, nuevoEstado) {
        try {
            console.log(`🔄 Actualizando estado del pedido ${idPedido} a: ${nuevoEstado}`);

            // Validar estado
            const estadosValidos = ['recibido', 'en_preparacion', 'listo', 'servido', 'pagado', 'cancelado'];
            if (!estadosValidos.includes(nuevoEstado)) {
                return {
                    success: false,
                    message: 'Estado no válido. Estados válidos: ' + estadosValidos.join(', ')
                };
            }

            const actualizado = await this.pedidoDAO.actualizarEstado(idPedido, nuevoEstado);

            if (actualizado) {
                console.log(`✅ Estado del pedido actualizado a: ${nuevoEstado}`);
                return {
                    success: true,
                    message: `Estado del pedido actualizado a: ${nuevoEstado}`
                };
            } else {
                return {
                    success: false,
                    message: 'Pedido no encontrado'
                };
            }
        } catch (error) {
            console.error('💥 Error en PedidoController.actualizarEstadoPedido:', error);
            return {
                success: false,
                message: 'Error al actualizar estado del pedido'
            };
        }
    }

    // Eliminar pedido
    async eliminarPedido(idPedido) {
        try {
            console.log(`🗑️ Eliminando pedido ID: ${idPedido}`);

            const eliminado = await this.pedidoDAO.delete(idPedido);

            if (eliminado) {
                console.log(`✅ Pedido eliminado correctamente`);
                return {
                    success: true,
                    message: 'Pedido eliminado exitosamente'
                };
            } else {
                return {
                    success: false,
                    message: 'Pedido no encontrado'
                };
            }
        } catch (error) {
            console.error('💥 Error en PedidoController.eliminarPedido:', error);
            return {
                success: false,
                message: 'Error al eliminar pedido'
            };
        }
    }

    // Obtener estadísticas
    async obtenerEstadisticas() {
        try {
            console.log('📊 Obteniendo estadísticas de pedidos');
            const estadisticas = await this.pedidoDAO.getEstadisticas();

            console.log('✅ Estadísticas obtenidas');
            return {
                success: true,
                estadisticas: estadisticas
            };
        } catch (error) {
            console.error('💥 Error en PedidoController.obtenerEstadisticas:', error);
            return {
                success: false,
                message: 'Error al obtener estadísticas'
            };
        }
    }
}

module.exports = PedidoController;
