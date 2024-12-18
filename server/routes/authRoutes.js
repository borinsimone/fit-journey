const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController'); // Assicurati che il percorso sia corretto
const router = express.Router();

// Rotta di registrazione
router.post('/register', authController.register); // Assicurati che la funzione register sia presente

// Rotta di login
router.post('/login', authController.login); // Assicurati che la funzione login sia presente

module.exports = router;
