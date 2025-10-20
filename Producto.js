class Producto {
    constructor(id, nombre, descripcion, precio, tipo, categoria, imagen = null, estado = 'disponible') {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.tipo = tipo; // 'comida', 'postre', 'bebida'
        this.categoria = categoria;
        this.imagen = imagen;
        this.estado = estado;
    }

    // Método para formatear precio
    getPrecioFormateado() {
        return `$${this.precio.toFixed(2)}`;
    }

    // Método para verificar disponibilidad
    estaDisponible() {
        return this.estado === 'disponible';
    }

    // Método para cambiar estado
    cambiarEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }

    // Método para aplicar descuento
    aplicarDescuento(porcentaje) {
        this.precio = this.precio * (1 - porcentaje / 100);
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            descripcion: this.descripcion,
            precio: this.precio,
            precioFormateado: this.getPrecioFormateado(),
            tipo: this.tipo,
            categoria: this.categoria,
            imagen: this.imagen,
            estado: this.estado,
            disponible: this.estaDisponible()
        };
    }

    // Métodos estáticos para crear desde diferentes tablas
    static fromComida(row) {
        return new Producto(
            row.id_comida,
            row.nombre,
            row.descripcion,
            parseFloat(row.precio),
            'comida',
            row.tipo,
            row.imagen,
            row.estado
        );
    }

    static fromPostre(row) {
        return new Producto(
            row.id_postre,
            row.nombre,
            row.descripcion,
            parseFloat(row.precio),
            'postre',
            'postre',
            row.imagen,
            row.estado
        );
    }

    static fromBebida(row) {
        return new Producto(
            row.id_bebida,
            row.nombre,
            row.descripcion,
            parseFloat(row.precio),
            'bebida',
            row.tipo,
            row.imagen,
            row.estado
        );
    }
}

module.exports = Producto;