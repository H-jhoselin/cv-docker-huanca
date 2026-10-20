const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'database',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'cv_user',
  password: process.env.DB_PASSWORD || 'cv_password',
  database: process.env.DB_NAME || 'cv_db',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
});

const app = express();
app.use(cors());

// Endpoint principal: datos personales + formación académica
app.get('/cv', async (req, res) => {
  try {
    const [personas] = await pool.query(
      'SELECT id, nombre, apellido, ciudad, foto FROM persona ORDER BY id LIMIT 1'
    );
    if (personas.length === 0) {
      return res.status(404).json({ error: 'No hay datos de persona' });
    }
    const persona = personas[0];
    const [formacion] = await pool.query(
      'SELECT id, titulo, institucion, anio FROM formacion WHERE persona_id = ? ORDER BY id',
      [persona.id]
    );
    res.json({ persona, formacion });
  } catch (err) {
    console.error('Error consultando MySQL:', err.message);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

// Verifica la conexión a MySQL antes de aceptar peticiones.
// Si falla, el proceso termina y "restart: always" reinicia el contenedor.
async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('Conectado a MySQL');
    app.listen(PORT, () => console.log(`Backend escuchando en el puerto ${PORT}`));
  } catch (err) {
    console.error('No se pudo conectar a MySQL:', err.message);
    process.exit(1);
  }
}

start();
