import bcrypt from 'bcryptjs';

const password = 'nico1901'; // La contraseña que quieres usar

bcrypt.hash(password, 10).then(hash => {
    console.log('Contraseña:', password);
    console.log('Hash generado:', hash);
    
    // Verificar el hash
    bcrypt.compare(password, hash).then(isMatch => {
        console.log('¿El hash coincide con la contraseña?', isMatch);
    });
}); 