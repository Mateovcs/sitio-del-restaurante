const Database = require('./config/database');

async function diagnosticar() {
    try {
        console.log('🔍 INICIANDO DIAGNÓSTICO...');
        
        // Probar conexión
        const connection = await Database.getConnection();
        console.log('✅ Conexión a BD exitosa');
        
        // Probar consulta de comidas
        console.log('📋 Probando consulta de comidas...');
        const comidasResult = await Database.execute('SELECT * FROM comidas WHERE estado = "disponible"');
        console.log('Tipo de comidasResult:', typeof comidasResult);
        console.log('Es array?', Array.isArray(comidasResult));
        console.log('Estructura:', comidasResult);
        
        if (Array.isArray(comidasResult) && comidasResult.length > 0) {
            console.log('Primer elemento:', comidasResult[0]);
            console.log('Tiene map?', typeof comidasResult[0].map);
        }
        
        // Probar consulta de postres
        console.log('📋 Probando consulta de postres...');
        const postresResult = await Database.execute('SELECT * FROM postres WHERE estado = "disponible"');
        console.log('Estructura postres:', postresResult);
        
        // Probar consulta de bebidas
        console.log('📋 Probando consulta de bebidas...');
        const bebidasResult = await Database.execute('SELECT * FROM bebidas WHERE estado = "disponible"');
        console.log('Estructura bebidas:', bebidasResult);
        
        connection.release();
        console.log('🎉 Diagnóstico completado');
        
    } catch (error) {
        console.error('💥 Error en diagnóstico:', error);
    }
}

diagnosticar();