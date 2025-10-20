class Cliente {
    constructor(idCliente, nombre, apellido, telefono, email, direccion) {
        this.idCliente = idCliente;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
        this.direccion = direccion;
    }

    getNombreCompleto() {
        return `${this.nombre} ${this.apellido}`;
    }

    validarEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    toJSON() {
        return {
            idCliente: this.idCliente,
            nombre: this.nombre,
            apellido: this.apellido,
            nombreCompleto: this.getNombreCompleto(),
            telefono: this.telefono,
            email: this.email,
            direccion: this.direccion
        };
    }

    static fromDatabase(row) {
        return new Cliente(
            row.id_cliente,
            row.nombre,
            row.apellido,
            row.telefono,
            row.email,
            row.direccion
        );
    }
}

module.exports = Cliente;