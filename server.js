const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');  // Importamos axios para hacer solicitudes HTTP

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Base de Datos
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Crear Tabla de Usuarios
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`,
  (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table ready.');
    }
  }
);

// Crear Tabla de RFID
db.run(
  `CREATE TABLE IF NOT EXISTS rfid_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rfid_code TEXT UNIQUE NOT NULL,
    object_name TEXT NOT NULL
  )`,
  (err) => {
    if (err) {
      console.error('Error creating RFID table:', err.message);
    } else {
      console.log('RFID table ready.');
    }
  }
);

// Crear Tabla de Tareas
db.run(
  `CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_name TEXT NOT NULL,
    task_date TEXT NOT NULL,
    task_tags TEXT,
    task_color TEXT,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`,
  (err) => {
    if (err) {
      console.error('Error creating tasks table:', err.message);
    } else {
      console.log('Tasks table ready.');
    }
  }
);


// Ruta para Registrar Usuario
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
  db.run(query, [email, password], (err) => {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ message: 'Email already registered.' });
      }
      return res.status(500).json({ message: 'Error registering user.' });
    }
    res.status(201).json({ message: 'User registered successfully.' });
  });
});

// Ruta para Iniciar Sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(query, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking credentials.' });
    }
    if (row) {
      // Retornar el usuario y su id
      res.status(200).json({ message: 'Login successful.', userId: row.id });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  });
});

// Ruta para Leer Etiqueta RFID
app.post('/read-rfid', async (req, res) => {
  try {
    // Hacemos una solicitud GET a la API Flask
    const response = await axios.get('http://localhost:5000/read-rfid');
    
    // Si la respuesta tiene un código RFID
    const rfidCode = response.data.rfidCode;

    if (rfidCode) {
      // Enviar el código RFID detectado como respuesta
      res.status(200).json({ rfidCode });
    } else {
      // Si no se detectó ningún código RFID
      res.status(400).json({ message: 'No se detectó ningún código RFID.' });
    }
  } catch (error) {
    console.error('Error al leer la etiqueta RFID:', error.message);
    return res.status(500).json({ message: 'Error al leer la etiqueta RFID.', error: error.message });
  }
});

// Ruta para Asignar Objeto a una Etiqueta RFID
// Ruta para Asignar Objeto a una Etiqueta RFID
app.post('/assign-rfid', (req, res) => {
  const { rfidCode, objectName, userId } = req.body;
  console.log('Datos recibidos:', rfidCode, objectName, userId);

  if (!rfidCode || !objectName) {
    return res.status(400).json({ message: 'RFID, nombre del objeto y ID del usuario son requeridos.' });
  }

  const query = `INSERT INTO rfid_data (rfid_code, object_name, user_id) VALUES (?, ?, ?)`;
  db.run(query, [rfidCode, objectName, userId], (err) => {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ message: 'El código RFID ya está asignado a un objeto.' });
      }
      return res.status(500).json({ message: 'Error asignando RFID a un objeto.' });
    }
    res.status(201).json({ message: 'Objeto asignado al RFID exitosamente.' });
  });
});

// Ruta para obtener objetos asignados a un usuario específico
app.get('/get-objects/:userId', (req, res) => {

  const { userId } = req.params;  // Obtener el userId de la URL
  console.log('User ID recibido:', userId);  // Verifica si el userId se pasa correctamente

  const query = `SELECT rfid_code, object_name FROM rfid_data where user_id = ?`;
  console.log('Query:', query);

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error('Error obteniendo datos de RFID:', err.message);
      return res.status(500).json({ message: 'Error obteniendo objetos asignados.' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron objetos para este usuario.' });
    }

    res.status(200).json({ objects: rows });
    console.log('Objetos asignados para el usuario:', rows);
  });
});



// Ruta para eliminar un objeto usando su RFID
app.delete('/delete-object/:rfidCode', (req, res) => {
  const { rfidCode } = req.params;

  const query = `DELETE FROM rfid_data WHERE rfid_code = ?`;

  db.run(query, [rfidCode], function(err) {
    if (err) {
      console.error('Error eliminando el objeto:', err.message);
      return res.status(500).json({ message: 'Error eliminando el objeto.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Etiqueta no encontrada.' });
    }
    res.status(200).json({ message: 'Etiqueta eliminada correctamente.' });
  });
});

// Ruta para guardar una tarea
app.post('/save-task', (req, res) => {
  const { taskName, taskDate, taskTags, taskColor, userId } = req.body;

  // Validamos que se reciban los datos necesarios
  if (!taskName || !taskDate || !userId) {
    return res.status(400).json({ message: 'El nombre de la tarea, fecha y ID de usuario son requeridos.' });
  }

  const query = `INSERT INTO tasks (task_name, task_date, task_tags, task_color, user_id)
                 VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [taskName, taskDate, taskTags.join(','), taskColor, userId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error al guardar la tarea.' });
    }

    res.status(201).json({ message: 'Tarea guardada correctamente.' });
  });
});

// Ruta para obtener las tareas de un usuario específico
app.get('/get-tasks/:userId', (req, res) => {
  const { userId } = req.params;  // Obtener el userId de la URL
  console.log('User ID recibido para obtener tareas:', userId);

  const query = `SELECT id, task_name, task_date, task_tags, task_color FROM tasks where user_id = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error('Error obteniendo tareas:', err.message);
      return res.status(500).json({ message: 'Error obteniendo las tareas.' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron tareas para este usuario.' });
    }

    res.status(200).json({ tasks: rows });
    console.log('Tareas obtenidas para el usuario:', rows);
  });
});

// Ruta para eliminar una tarea
app.delete('/delete-task/:taskId', (req, res) => {
  const { taskId } = req.params;

  const query = `DELETE FROM tasks WHERE id = ?`;

  db.run(query, [taskId], function (err) {
    if (err) {
      console.error('Error eliminando la tarea:', err.message);
      return res.status(500).json({ message: 'Error eliminando la tarea.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }
    res.status(200).json({ message: 'Tarea eliminada correctamente.' });
  });
});


// Servidor Escuchando
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
