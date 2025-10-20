const ClienteDAO = require('../dao/ClienteDAO');

class ClienteController {
    constructor() {
        this.clienteDAO = new ClienteDAO();
    }

    async obtenerClientes() {
        try {
            console.log('📋 Obteniendo lista de clientes...');
            const clientes = await this.clienteDAO.findAll();
            
            console.log(`✅ Encontrados ${clientes.length} clientes`);
            return {
                success: true,
                clientes: clientes.map(cliente => cliente.toJSON()),
                total: clientes.length
            };
        } catch (error) {
            console.error('💥 Error en ClienteController.obtenerClientes:', error);
            return {
                success: false,
                message: 'Error al obtener clientes'
            };
        }
    }

    async obtenerClientePorId(idCliente) {
        try {
            console.log(`🔍 Buscando cliente ID: ${idCliente}`);
            const cliente = await this.clienteDAO.findById(idCliente);
            
            if (cliente) {
                console.log(`✅ Cliente encontrado: ${cliente.getNombreCompleto()}`);
                return {
                    success: true,
                    cliente: cliente.toJSON()
                };
            } else {
                console.log('❌ Cliente no encontrado');
                return {
                    success: false,
                    message: 'Cliente no encontrado'
                };
            }
        } catch (error) {
            console.error('💥 Error en ClienteController.obtenerClientePorId:', error);
            return {
                success: false,
                message: 'Error al buscar cliente'
            };
        }
    }

    async buscarClientesPorNombre(nombre) {
        try {
            console.log(`🔍 Buscando clientes por nombre: ${nombre}`);
            const clientes = await this.clienteDAO.findByNombre(nombre);
            
            console.log(`✅ Encontrados ${clientes.length} clientes`);
            return {
                success: true,
                clientes: clientes.map(cliente => cliente.toJSON()),
                total: clientes.length
            };
        } catch (error) {
            console.error('💥 Error en ClienteController.buscarClientesPorNombre:', error);
            return {
                success: false,
                message: 'Error al buscar clientes'
            };
        }
    }

    async crearCliente(clienteData) {
        try {
            console.log('➕ Creando nuevo cliente:', clienteData.nombre);
            
            if (!clienteData.nombre || !clienteData.apellido) {
                return {
                    success: false,
                    message: 'Nombre y apellido son requeridos'
                };
            }

            const nuevoClienteId = await this.clienteDAO.create(clienteData);
            
            console.log(`✅ Cliente creado con ID: ${nuevoClienteId}`);
            return {
                success: true,
                message: 'Cliente creado exitosamente',
                idCliente: nuevoClienteId
            };
        } catch (error) {
            console.error('💥 Error en ClienteController.crearCliente:', error);
            return {
                success: false,
                message: 'Error al crear cliente'
            };
        }
    }

    async actualizarCliente(idCliente, clienteData) {
        try {
            console.log(`✏️ Actualizando cliente ID: ${idCliente}`);
            
            const actualizado = await this.clienteDAO.update(idCliente, clienteData);
            
            if (actualizado) {
                console.log(`✅ Cliente actualizado correctamente`);
                return {
                    success: true,
                    message: 'Cliente actualizado exitosamente'
                };
            } else {
                return {
                    success: false,
                    message: 'Cliente no encontrado'
                };
            }
        } catch (error) {
            console.error('💥 Error en ClienteController.actualizarCliente:', error);
            return {
                success: false,
                message: 'Error al actualizar cliente'
            };
        }
    }

    async eliminarCliente(idCliente) {
        try {
            console.log(`🗑️ Eliminando cliente ID: ${idCliente}`);
            
            const eliminado = await this.clienteDAO.delete(idCliente);
            
            if (eliminado) {
                console.log(`✅ Cliente eliminado correctamente`);
                return {
                    success: true,
                    message: 'Cliente eliminado exitosamente'
                };
            } else {
                return {
                    success: false,
                    message: 'Cliente no encontrado'
                };
            }
        } catch (error) {
            console.error('💥 Error en ClienteController.eliminarCliente:', error);
            return {
                success: false,
                message: 'Error al eliminar cliente'
            };
        }
    }
}

module.exports = ClienteController;