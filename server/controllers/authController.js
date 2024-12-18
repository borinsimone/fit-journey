const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Verifica se l'utente esiste già
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email già in uso' });
    }

    // Non criptare la password, salvarla come tale
    const newUser = new User({
      name,
      email,
      password, // Password in chiaro
    });

    // Salva l'utente nel database
    const savedUser = await newUser.save();
    console.log('User saved:', savedUser);

    // Crea il payload per il JWT
    const payload = {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
    };

    // Crea il token JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Risponde con il token
    res.json({ token });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Errore server' });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user);

    if (!user) {
      return res.status(400).json({ error: 'Email o password errati' });
    }

    // Confronta la password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: 'Email o password errati' });
    }

    // Crea il payload per il JWT
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    // Crea il token JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ error: 'Errore server' });
  }
};
