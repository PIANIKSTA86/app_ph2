const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const config = require('config');

// Get database configuration
const dbConfig = config.get('database');
const dbPath = dbConfig.storage || './ph_management.sqlite';

// Check if the directory exists, if not, create it
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create a new database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

// Read SQL file
const sqlFile = path.join(__dirname, 'core', 'migracion_usuarios_sqlite.sql');
const migration = fs.readFileSync(sqlFile, 'utf8');

// Execute SQL statements
console.log('Initializing database...');

// Split by semicolon to get individual queries
const queries = migration.split(';').filter(query => query.trim());

// Execute each query
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
  
  // Enable journal mode WAL
  db.run('PRAGMA journal_mode = WAL');
  
  // Begin transaction
  db.run('BEGIN TRANSACTION');

  queries.forEach((query) => {
    if (query.trim()) {
      db.run(query, (err) => {
        if (err) {
          console.error('Error executing query:', err.message);
          console.error('Query:', query);
        }
      });
    }
  });

  // Commit transaction
  db.run('COMMIT', (err) => {
    if (err) {
      console.error('Error committing transaction:', err.message);
      return;
    }
    console.log('Database initialization completed successfully.');
    
    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
        return;
      }
      console.log('Database connection closed.');
    });
  });
});
