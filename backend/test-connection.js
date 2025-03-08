require('dotenv').config({ path: __dirname + '/.env' });
const { Client } = require('pg');

// const PORT = 5433; // Forzar el puerto 5433

// Debug connection parameters
console.log('Connection parameters:', {
  host: 'localhost',
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: '********'
});

const client = new Client({
  host: 'localhost',
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

client.connect()
  .then(() => {
    console.log('✅ Successfully connected to PostgreSQL');
    return client.end();
  })
  .catch((err) => {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  });