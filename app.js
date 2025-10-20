const express = require('express');
const cors = require('cors');
const path = require('path');

// Importamos nuestras rutas - RUTAS CORRECTAS
const authRoutes = require('../routes/authRoutes');
const clienteRoutes = require('../routes/clienteRoutes');
const productoRoutes = require('../routes/productoRoutes');
const pedidoRoutes = require('../routes/pedidoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (tu frontend)
app.use(express.static(path.join(__dirname, '..')));

// Configurar rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Ruta de prueba para verificar que el servidor funciona
app.get('/api/test', (req, res) => {
    res.json({ 
        message: '✅ Servidor funcionando con arquitectura POO',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Ruta para verificar que la BD funciona
app.get('/api/test-db', async (req, res) => {
    try {
        const Database = require('../config/database');
        const connection = await Database.getConnection();
        connection.release();
        
        res.json({ 
            success: true, 
            message: '✅ Conexión a BD exitosa' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: '❌ Error conectando a BD: ' + error.message 
        });
    }
});

// Ruta por defecto para servir tu página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Manejar rutas no encontradas
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta API no encontrada'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 SERVIDOR INICIADO CON ARQUITECTURA POO');
    console.log('='.repeat(50));
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🛣️  API: http://localhost:${PORT}/api/`);
    console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
    console.log(`🗄️  Test BD: http://localhost:${PORT}/api/test-db`);
    console.log(`🔐 Login: POST http://localhost:${PORT}/api/auth/login`);
    console.log(`👥 Clientes: GET http://localhost:${PORT}/api/clientes`);
    console.log(`📋 Pedidos: GET http://localhost:${PORT}/api/pedidos`);
    console.log('='.repeat(50));
});