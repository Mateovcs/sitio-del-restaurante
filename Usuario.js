class Usuario {
    constructor(idUsuario, username, password, rol, idEmpleado = null) {
        this.idUsuario = idUsuario;
        this.username = username;
        this.password = password;
        this.rol = rol;
        this.idEmpleado = idEmpleado;
    }

    esAdministrador() {
        return this.rol === 'admin';
    }

    esMozo() {
        return this.rol === 'mozo';
    }

    validarPassword(password) {
        return this.password === password;
    }

    toJSON() {
        return {
            idUsuario: this.idUsuario,
            username: this.username,
            rol: this.rol,
            idEmpleado: this.idEmpleado
        };
    }

    static fromDatabase(row) {
        return new Usuario(
            row.id_usuario,
            row.username,
            row.password,
            row.rol,
            row.id_empleado
        );
    }
}

module.exports = Usuario;