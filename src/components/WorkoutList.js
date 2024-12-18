import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WorkoutForm from './WorkoutForm';
import { useGlobalContext } from '../context/GlobalContext';

const WorkoutList = ({ workouts, setWorkouts }) => {
  // const [workouts, setWorkouts] = useState([]);
  const { loadingWorkouts, setLoadingWorkout, loading, deleteWorkout } =
    useGlobalContext();
  const [error, setError] = useState('');

  return (
    <div>
      {/* {error && <p>{error}</p>} */}

      {/* Passiamo la funzione di callback per aggiornare la lista degli allenamenti */}
      <WorkoutForm />
      <h1>Lista degli Allenamenti</h1>

      <ul>
        {loading ? (
          'Loading...'
        ) : Array.isArray(workouts) && workouts.length > 0 ? (
          workouts.map((workout) => (
            <li key={workout._id}>
              <p>
                <strong>{workout && workout.name}</strong>
              </p>
              {workout.exercises && workout.exercises.length > 0 ? (
                workout.exercises.map((exercise, i) => (
                  <p key={i}>
                    Es.{i + 1}: {exercise && exercise.name}
                  </p>
                ))
              ) : (
                <p>Nessun esercizio disponibile.</p>
              )}
              <p>Durata: {workout && workout.duration} minuti</p>
              <p>
                Data: {new Date(workout && workout.date).toLocaleDateString()}
              </p>
              <button onClick={() => deleteWorkout(workout._id)}>
                Elimina
              </button>
            </li>
          ))
        ) : (
          <p>Nessun allenamento trovato.</p>
        )}

        {/* {loadingWorkouts
          ? 'caricamento...'
          : workouts &&
            workouts.map((workout) => {
              'ciao';
            })} */}
      </ul>
    </div>
  );
};

export default WorkoutList;
