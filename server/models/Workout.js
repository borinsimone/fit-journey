const mongoose = require('mongoose');

// Schema per i dettagli dei set
const set = new mongoose.Schema({
  reps: { type: Number, required: true }, // Numero di ripetizioni
  weight: { type: Number, default: 0 }, // Peso (default 0)
  rest: { type: Number, default: 0 }, // Tempo di riposo in secondi (default 0)
});

// Schema per i singoli esercizi
const exercise = new mongoose.Schema({
  name: { type: String, required: true }, // Nome dell'esercizio
  sets: { type: Number }, // Numero totale di set
  exerciseSets: [set], // Dettagli per ogni set
  notes: { type: String }, // Note opzionali per l'esercizio
});

// Schema per le aree di focus (categorie)
const section = new mongoose.Schema({
  name: { type: String, required: true }, // Nome dell'area (es. spalle, petto, riscaldamento)
  exercises: [exercise], // Esercizi all'interno di questa area
});

// Schema per l'intero workout
const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Riferimento all'utente
  name: { type: String, required: true }, // Nome del workout (es. "Full Body Workout")
  sections: [section], // Aree di focus (ad esempio: spalle, petto, etc.)
  date: { type: Date, default: Date.now }, // Data dell'allenamento (default è la data corrente)
  start: { type: Date, default: Date.now }, // Data dell'allenamento (default è la data corrente)
  end: {
    type: Date,
    default: function () {
      // Calcola il valore predefinito per `end` basandoti su `start`
      return new Date(this.start.getTime() + 60 * 60 * 1000); // Default: 1 ora dopo `start`
    },
  },
  notes: { type: String }, // Note opzionali per l'allenamento
});

// Esportiamo il modello del workout
module.exports = mongoose.model('Workout', workoutSchema);
