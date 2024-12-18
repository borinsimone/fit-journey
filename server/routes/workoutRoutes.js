// routes/workoutRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // Importa il middleware di autenticazione
const workoutController = require('../controllers/workoutController');
const router = express.Router();

// Ottieni gli allenamenti dell'utente (rotte protette)
router.get(
  '/',
  authMiddleware, // Usa il tuo middleware personalizzato
  workoutController.getWorkouts
);

// Crea un nuovo allenamento (rotte protette)
router.post(
  '/',
  authMiddleware, // Usa il tuo middleware personalizzato
  workoutController.createWorkout
);

// Elimina un allenamento (rotte protette)
router.delete(
  '/:workoutId',
  authMiddleware, // Usa il tuo middleware per la protezione della route
  workoutController.deleteWorkout
);

// Modifica un allenamento (rotte protette)
router.put(
  '/:workoutId',
  authMiddleware, // Usa il tuo middleware personalizzato per la protezione
  workoutController.updateWorkout // Il controller che gestisce la logica per aggiornare l'allenamento
);

module.exports = router;
