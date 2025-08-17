module.exports = {
  port: process.env.PORT || 3000,
  database: {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './ph_management.sqlite',
    logging: process.env.DB_LOGGING === 'true'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'ph_management_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || ''
    },
    from: process.env.EMAIL_FROM || 'info@phmanagement.com'
  }
};
