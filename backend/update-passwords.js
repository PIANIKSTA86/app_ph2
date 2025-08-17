const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const config = require('config');

// Get database configuration
const dbConfig = config.get('database');
const dbPath = dbConfig.storage || './ph_management.sqlite';

async function updateUserPassword() {
  // Generate new hash for admin123
  const password = 'admin123';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log(`Updating user passwords with new hash: ${hash}`);
  
  // Connect to the database
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      process.exit(1);
    }
    console.log('Connected to the SQLite database.');
  });
  
  // Update admin user
  db.run(
    `UPDATE usuarios SET password = ? WHERE email = ?`,
    [hash, 'admin@sistema.com'],
    function(err) {
      if (err) {
        console.error('Error updating admin user:', err.message);
      } else {
        console.log(`Admin user updated. Rows affected: ${this.changes}`);
      }
      
      // Update contador user
      db.run(
        `UPDATE usuarios SET password = ? WHERE email = ?`,
        [hash, 'contador@sistema.com'],
        function(err) {
          if (err) {
            console.error('Error updating contador user:', err.message);
          } else {
            console.log(`Contador user updated. Rows affected: ${this.changes}`);
          }
          
          // Close the database connection
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err.message);
            } else {
              console.log('Database connection closed.');
            }
          });
        }
      );
    }
  );
}

// Run the update function
updateUserPassword();
