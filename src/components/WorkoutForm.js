import React, { useState } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalContext';

const WorkoutForm = () => {
  const { addWorkout } = useGlobalContext();
  const [name, setName] = useState('');
  const [start, setStart] = useState(''); // Stato per l'inizio
  const [duration, setDuration] = useState(''); // Durata in minuti
  const [exercises, setExercises] = useState([
    { name: '', sets: '', reps: '' },
  ]);
  const [notes, setNotes] = useState(''); // Opzionale: per le note

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '' }]);
  };

  const handleRemoveExercise = (index) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se start è presente e duration è definito, calcoliamo automaticamente end
    const startDate = new Date(start);
    let endDate = null;

    if (start && duration) {
      const durationInMinutes = parseInt(duration, 10);
      endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + durationInMinutes);
    }

    const newWorkout = {
      name,
      start: startDate, // Imposta l'inizio
      end: endDate, // Calcolato in base alla durata
      exercises: exercises.map((exercise) => ({
        name: exercise.name,
        sets: parseInt(exercise.sets, 10),
        reps: parseInt(exercise.reps, 10),
      })),
      notes, // Aggiungi le note se fornite
    };

    try {
      // Aggiungi l'allenamento tramite il contesto (o una chiamata API)
      addWorkout(newWorkout);

      // Resetta i campi
      setName('');
      setStart('');
      setDuration('');
      setExercises([{ name: '', sets: '', reps: '' }]);
      setNotes('');
    } catch (error) {
      console.error("Errore durante l'aggiunta dell'allenamento:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Aggiungi un nuovo allenamento</h2>

      {/* Campo per il nome dell'allenamento */}
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome dell'allenamento"
        required
      />

      {/* Campo per la durata in minuti */}
      <input
        type='number'
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder='Durata in minuti'
        required
      />

      {/* Campo per la data di inizio */}
      <input
        type='datetime-local'
        value={start}
        onChange={(e) => setStart(e.target.value)}
        placeholder='Data e ora di inizio'
        required
      />

      {/* Campo per le note (opzionale) */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder='Note aggiuntive'
      />

      <div>
        <h3>Esercizi</h3>
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className='exercise'
          >
            <input
              type='text'
              value={exercise.name}
              onChange={(e) =>
                handleExerciseChange(index, 'name', e.target.value)
              }
              placeholder="Nome dell'esercizio"
              required
            />
            <input
              type='number'
              value={exercise.sets}
              onChange={(e) =>
                handleExerciseChange(index, 'sets', e.target.value)
              }
              placeholder='Set'
              required
            />
            <input
              type='number'
              value={exercise.reps}
              onChange={(e) =>
                handleExerciseChange(index, 'reps', e.target.value)
              }
              placeholder='Ripetizioni'
              required
            />
            <button
              type='button'
              onClick={() => handleRemoveExercise(index)}
            >
              Rimuovi esercizio
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={handleAddExercise}
        >
          Aggiungi esercizio
        </button>
      </div>

      <button type='submit'>Aggiungi</button>
    </form>
  );
};

export default WorkoutForm;
