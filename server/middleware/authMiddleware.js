const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Recupera il token dall'intestazione della richiesta
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Accesso negato. Token mancante.' });
  }

  try {
    // Verifica il token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Aggiunge le informazioni dell'utente alla richiesta
    next(); // Procede al middleware successivo
  } catch (err) {
    res.status(400).json({ error: 'Token non valido.' });
  }
};

module.exports = authMiddleware;
