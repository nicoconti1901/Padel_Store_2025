const bcrypt = require('bcryptjs');

const password = 'nico1901'; // Reemplaza con la contraseña que quieras usar
bcrypt.hash(password, 10).then(hash => {
    console.log('Hash de la contraseña:', hash);
});