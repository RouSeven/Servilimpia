const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware para CORS
app.use(cors());
app.use(express.json());

// Permitir solicitudes desde cualquier origen
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a base de datos
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'articulosdb'
});

conexion.connect((error) => {
    if (error) {
        throw error;
    } else {
        console.log("¡Conexión exitosa a la base de datos!");
    }
});

// Ruta principal que sirve index.html automáticamente desde /public
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener precios (puedes cambiar según tu lógica)
app.get('/api/precios', (req, res) => {
    res.json({
        PET: 6,
        VIDRIO: 2,
        PAPEL: 1,
        CHATARRA: 3,
        CARTON: 0.3,
        POLIESTIRENO: 5,
        ALUMINIO: 12
    });
});

// Puerto del servidor
const puerto = process.env.PORT || 3000;
app.listen(puerto, () => {
    console.log("Servidor corriendo en http://localhost:" + puerto);

});
