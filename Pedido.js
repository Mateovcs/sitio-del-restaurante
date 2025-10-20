class Pedido {
    constructor(idPedido, idCliente, idMesa, idEmpleado, fechaHora, estado, tipo, observaciones, total) {
        this.idPedido = idPedido;
        this.idCliente = idCliente;
        this.idMesa = idMesa;
        this.idEmpleado = idEmpleado;
        this.fechaHora = fechaHora;
        this.estado = estado; // 'recibido', 'en_preparacion', 'listo', 'servido', 'pagado', 'cancelado'
        this.tipo = tipo; // 'mesa', 'domicilio', 'recoger'
        this.observaciones = observaciones;
        this.total = total;
    }

    // Método para verificar si el pedido está activo
    estaActivo() {
        return ['recibido', 'en_preparacion', 'listo', 'servido'].includes(this.estado);
    }

    // Método para verificar si está pagado
    estaPagado() {
        return this.estado === 'pagado';
    }

    // Método para cambiar estado
    cambiarEstado(nuevoEstado) {
        const estadosValidos = ['recibido', 'en_preparacion', 'listo', 'servido', 'pagado', 'cancelado'];
        if (estadosValidos.includes(nuevoEstado)) {
            this.estado = nuevoEstado;
            return true;
        }
        return false;
    }

    // Método para formatear total
    getTotalFormateado() {
        return `$${this.total.toFixed(2)}`;
    }

    toJSON() {
        return {
            idPedido: this.idPedido,
            idCliente: this.idCliente,
            idMesa: this.idMesa,
            idEmpleado: this.idEmpleado,
            fechaHora: this.fechaHora,
            estado: this.estado,
            tipo: this.tipo,
            observaciones: this.observaciones,
            total: this.total,
            totalFormateado: this.getTotalFormateado(),
            activo: this.estaActivo(),
            pagado: this.estaPagado()
        };
    }

    // Método estático para crear desde BD
    static fromDatabase(row) {
        return new Pedido(
            row.id_pedido,
            row.id_cliente,
            row.id_mesa,
            row.id_empleado,
            row.fecha_hora,
            row.estado,
            row.tipo,
            row.observaciones,
            parseFloat(row.total)
        );
    }
}

module.exports = Pedido;
