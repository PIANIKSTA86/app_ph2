const bcrypt = require('bcrypt');

// Hash para admin123 generado previamente
const storedHash = '$2b$10$KV1XWWpzGY9jXmf0oZJGVe5U95nh2O9DYpiH.QBsCvl.nhVgakeTm';

// Probemos con distintas contraseñas para ver qué sucede
async function probarPasswordsBcrypt() {
  try {
    console.log('===== TEST DE CONTRASEÑAS =====');
    
    // Prueba con la contraseña correcta
    const resultadoAdmin123 = await bcrypt.compare('admin123', storedHash);
    console.log('admin123 coincide?', resultadoAdmin123);
    
    // Prueba con algunas variaciones
    const resultadoAdmin = await bcrypt.compare('admin', storedHash);
    console.log('admin coincide?', resultadoAdmin);
    
    const resultadoAdmin1234 = await bcrypt.compare('admin1234', storedHash);
    console.log('admin1234 coincide?', resultadoAdmin1234);
    
    const resultadoAdminMayuscula = await bcrypt.compare('Admin123', storedHash);
    console.log('Admin123 coincide?', resultadoAdminMayuscula);
    
    // Generar un nuevo hash para verificar que bcrypt funciona correctamente
    const nuevoHash = await bcrypt.hash('admin123', 10);
    console.log('\nHash almacenado:', storedHash);
    console.log('Nuevo hash para admin123:', nuevoHash);
    
    // Verificar el nuevo hash
    const validacionNuevoHash = await bcrypt.compare('admin123', nuevoHash);
    console.log('¿El nuevo hash valida admin123?', validacionNuevoHash);
    
    // Vamos a crear un hash específico para comparar
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    console.log('\nSalt generado:', salt);
    
    const hashControlado = await bcrypt.hash('admin123', salt);
    console.log('Hash con salt controlado:', hashControlado);
    
    // Verificar el hash controlado
    const validacionHashControlado = await bcrypt.compare('admin123', hashControlado);
    console.log('¿El hash controlado valida admin123?', validacionHashControlado);
    
  } catch (error) {
    console.error('Error en las pruebas:', error);
  }
}

probarPasswordsBcrypt();
