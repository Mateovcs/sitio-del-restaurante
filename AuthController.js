const UsuarioDAO = require('../dao/UsuarioDAO');

class AuthController {
    constructor() {
        this.usuarioDAO = new UsuarioDAO();
    }

    async login(username, password) {
        try {
            console.log(`🔐 Intentando login para usuario: ${username}`);
            
            const usuario = await this.usuarioDAO.findByUsername(username);
            
            if (!usuario) {
                console.log('❌ Usuario no encontrado');
                return { 
                    success: false, 
                    message: 'Usuario no encontrado' 
                };
            }

            if (!usuario.validarPassword(password)) {
                console.log('❌ Contraseña incorrecta');
                return { 
                    success: false, 
                    message: 'Contraseña incorrecta' 
                };
            }

            console.log(`✅ Login exitoso para: ${username} (${usuario.rol})`);
            
            return {
                success: true,
                message: 'Login exitoso',
                usuario: usuario.toJSON()
            };

        } catch (error) {
            console.error('💥 Error en AuthController.login:', error);
            return {
                success: false,
                message: 'Error del servidor'
            };
        }
    }

    async verificarUsuario(idUsuario) {
        try {
            const usuario = await this.usuarioDAO.findById(idUsuario);
            return usuario ? usuario.toJSON() : null;
        } catch (error) {
            console.error('Error en AuthController.verificarUsuario:', error);
            return null;
        }
    }

    async obtenerUsuarios() {
        try {
            const usuarios = await this.usuarioDAO.findAll();
            return usuarios.map(usuario => usuario.toJSON());
        } catch (error) {
            console.error('Error en AuthController.obtenerUsuarios:', error);
            throw error;
        }
    }
}

module.exports = AuthController;