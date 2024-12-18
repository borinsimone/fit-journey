// controllers/workoutController.js
const Workout = require('../models/Workout');

// Ottieni gli allenamenti dell'utente
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({
      date: -1,
    }); // Ordina per data, dalla più recente
    res.json(workouts); // Ritorna gli allenamenti
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'Errore durante il recupero degli allenamenti' });
  }
};

// Crea un nuovo allenamento
exports.createWorkout = async (req, res) => {
  const { name, date, sections, duration, start, end, notes } = req.body;

  console.log('Dati ricevuti:', req.body); // Log dei dati ricevuti
  console.log(req.user); // Verifica che req.user contenga l'oggetto dell'utente
  console.log(req.user._id); // Verifica che contenga l'ID dell'utente
  try {
    const newWorkout = new Workout({
      userId: req.user.id,
      name,
      sections,
      duration,
      notes,
      date: date || Date.now(),
      start,
      end,
    });

    await newWorkout.save(); // Salva l'allenamento nel database

    res.status(201).json(newWorkout); // Rispondi con l'allenamento appena creato
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Errore durante la creazione dell'allenamento" });
  }
};

// Elimina un allenamento esistente
exports.deleteWorkout = async (req, res) => {
  const { workoutId } = req.params; // Estrai l'ID dell'allenamento dalla richiesta
  console.log("ID dell'allenamento:", workoutId); // Log per verificare l'ID

  try {
    const workout = await Workout.findById(workoutId); // Trova l'allenamento per ID
    if (!workout) {
      console.log('Allenamento non trovato'); // Log in caso di allenamento non trovato
      return res.status(404).json({ error: 'Allenamento non trovato' });
    }

    // Controlla se l'utente loggato è lo stesso che ha creato l'allenamento
    if (workout.userId.toString() !== req.user.id) {
      console.log("Utente non autorizzato a eliminare l'allenamento"); // Log per errore di permesso
      return res
        .status(403)
        .json({ error: 'Non hai permessi per eliminare questo allenamento' });
    }

    // Rimuovi l'allenamento dal database con il metodo deleteOne
    const deletedWorkout = await Workout.deleteOne({ _id: workoutId }); // Usa deleteOne

    if (deletedWorkout.deletedCount === 0) {
      return res
        .status(500)
        .json({ error: "Errore durante l'eliminazione dell'allenamento" });
    }

    console.log('Allenamento eliminato con successo'); // Log per successo
    res.status(200).json({ message: 'Allenamento eliminato con successo' });
  } catch (err) {
    console.error("Errore durante l'eliminazione dell'allenamento:", err); // Log completo dell'errore
    res
      .status(500)
      .json({ error: "Errore durante l'eliminazione dell'allenamento" });
  }
};

// Modifica un allenamento esistente
exports.updateWorkout = async (req, res) => {
  const { workoutId } = req.params;
  const { name, exercises, duration } = req.body; // Estrai i dati dal corpo della richiesta

  try {
    const workout = await Workout.findById(workoutId); // Trova l'allenamento per ID
    if (!workout) {
      return res.status(404).json({ error: 'Allenamento non trovato' });
    }

    // Controlla se l'utente loggato è lo stesso che ha creato l'allenamento
    if (workout.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Non hai permessi per modificare questo allenamento' });
    }

    // Modifica le proprietà dell'allenamento
    workout.name = name || workout.name;
    workout.exercises = exercises || workout.exercises;
    workout.duration = duration || workout.duration;

    await workout.save(); // Salva le modifiche nel database

    res.status(200).json(workout); // Risponde con l'allenamento aggiornato
  } catch (err) {
    console.error('Error updating workout:', err);
    res
      .status(500)
      .json({ error: "Errore durante l'aggiornamento dell'allenamento" });
  }
};
