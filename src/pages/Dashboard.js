// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import WorkoutList from '../components/WorkoutList';
import { useGlobalContext } from '../context/GlobalContext';
import styled from 'styled-components';
import Navbar from '../components/general/Navbar';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import BottomBar from '../components/general/BottomBar';
import axios from 'axios';
import WorkoutCalendar from '../components/calendar/WorkoutCalendar';
import WorkoutAssistant from './workout/WorkoutAssistant';
import { MdTune } from 'react-icons/md';

const Dashboard = () => {
  const {
    workouts,
    setWorkouts,
    loading,
    setLoading,
    user,
    setUser,
    updateWorkouts,
  } = useGlobalContext();
  const navigate = useNavigate();
  // Call all'API inizale per reperire la lista workout e user e impostarla a state workout e user

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/workouts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);

          setWorkouts(data);
          console.log(workouts);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      try {
        const decodedToken = jwtDecode(token); // Decodifica il token
        setUser(decodedToken); // Salva i dati nel state
      } catch (error) {
        console.error('Errore nella decodifica del token', error);
      }
    };

    fetchWorkouts();
  }, [navigate]);

  // Ottieni l'allenamento programmato per oggi

  // console.log(JSON.stringify(workouts, null, 2));
  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // "2024-11-18" (data di oggi senza orario)

  const todayWorkout = workouts.find((workout) => {
    const workoutDate = new Date(workout.date);

    // Controlla se la data è valida
    if (isNaN(workoutDate)) {
      console.error('Data non valida:', workout.date);
      return false; // Se la data non è valida, ignora questo workout
    }

    const workoutDateString = workoutDate.toISOString().split('T')[0]; // "2024-11-18"
    return workoutDateString === todayString;
  });

  const handleStartWorkout = () => {
    if (todayWorkout) {
      navigate(`/workout/${todayWorkout.id}`); // Cambia con il percorso che corrisponde alla tua pagina di allenamento
    }
  };
  function getFormattedDate() {
    const giorniSettimana = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const mesi = [
      'Gen',
      'Feb',
      'Mar',
      'Apr',
      'Mag',
      'Giu',
      'Lug',
      'Ago',
      'Set',
      'Ott',
      'Nov',
      'Dic',
    ];

    const oggi = new Date();

    const giornoSettimana = giorniSettimana[oggi.getDay()]; // Ottieni giorno della settimana
    const giornoMese = oggi.getDate(); // Giorno del mese
    const mese = mesi[oggi.getMonth()]; // Mese corrente

    return `${giornoSettimana} ${giornoMese} ${mese}`;
  }

  return (
    <Container>
      <Navbar user={user} />
      {/* <div onClick={() => updateWorkouts()}>update</div> */}
      <div
        onClick={async (e) => {
          e.preventDefault();
          const newWorkout = {
            name: 'Full Body Workout',
            sections: [
              {
                name: 'Riscaldamento',
                exercises: [
                  {
                    name: 'Jumping Jacks',
                    sets: 2,

                    exerciseSets: [
                      { reps: 30, weight: 0, rest: 30 },
                      { reps: 30, weight: 0, rest: 30 },
                    ],
                    notes: 'Attivazione generale.',
                  },
                ],
              },
              {
                name: 'verticale',
                exercises: [
                  {
                    name: 'tenute',
                    sets: 2,

                    exerciseSets: [
                      { reps: 30, weight: 0, rest: 30 },
                      { reps: 30, weight: 0, rest: 30 },
                    ],
                    notes: 'Attivazione generale.',
                  },
                ],
              },
            ],
            date: new Date().toISOString(), // Usa la data corrente
            start: new Date().toISOString(),
            notes: 'Sessione mattutina.',
          };
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              console.error('Token non trovato. Accedi per continuare.');
              return;
            }
            const response = await axios.post(
              'http://localhost:5001/workouts',
              newWorkout,
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Aggiunge il token all'header Authorization
                },
              }
            );
            if (response) {
              updateWorkouts();
              console.log('workout aggiunto:');
              console.log(workouts);
            }
          } catch (error) {
            console.error("Errore durante l'aggiunta dell'allenamento", error);
          }
        }}
      >
        update
      </div>

      {/* <WorkoutList
        workouts={workouts}
        setWorkouts={setWorkouts}
      /> */}

      {/* {todayWorkout ? (
        <div>
          <h2
            onClick={() => {
              console.log(todayWorkout);
            }}
          >
            Allenamento di oggi: {todayWorkout.name}{' '}
            {new Date(todayWorkout.start).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            -{' '}
            {new Date(todayWorkout.end).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </h2>
          <button
            onClick={() => {
              navigate(`/${todayWorkout.name}`);
            }}
          >
            Inizia Allenamento
          </button>
        </div>
      ) : (
        <p>Nessun allenamento programmato per oggi.</p>
      )} */}
      <WidgetContainer>
        <TodayWidget
          onClick={() => {
            console.log(todayWorkout);
          }}
        >
          <MdTune className='settingIcon' />
          <div className='todayDate'>{getFormattedDate()}</div>
          <div className='workoutName'>{todayWorkout?.name}</div>

          <WorkoutTime>
            Allenamento programmato per le:{' '}
            {new Date(todayWorkout?.start).toLocaleTimeString('it-IT', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </WorkoutTime>
        </TodayWidget>
        <SupplementWidget
          onClick={() => {
            console.log(todayWorkout);
          }}
        >
          <MdTune className='settingIcon' />
        </SupplementWidget>
        <WorkoutCalendar />
      </WidgetContainer>

      <BottomBar />
    </Container>
  );
};

export default Dashboard;
const Container = styled.div`
  height: 100vh;
  height: 100svh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  /* flex-wrap: wrap; */
  padding: 20px 10px;
  position: relative;
  background-color: #16181f;
`;
const WidgetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  row-gap: 20px;
  width: 100%;
`;

const TodayWidget = styled.div`
  position: relative;
  color: #d9d9d9;
  background-color: #d9d9d910;
  border: 1px solid #00c6be;
  box-shadow: 0 0 30px #00000075;
  border-radius: 20px;
  width: 45%;
  aspect-ratio: 1;
  padding: 20px;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  /* align-items: center; */
  .todayDate {
    margin-bottom: 8px;
  }
  .workoutName {
    margin-bottom: 2px;
  }
  .settingIcon {
    position: absolute;
    font-size: 20px;
    top: 10px;
    right: 10px;
    opacity: 0.7;
  }
`;
const WorkoutTime = styled.div`
  font-weight: lighter;
  opacity: 0.4;
  font-size: 0.8em;
`;

const SupplementWidget = styled.div`
  position: relative;
  color: #d9d9d9;
  background-color: #d9d9d910;
  border: 1px solid #00c6be;
  box-shadow: 0 0 30px #00000075;
  border-radius: 20px;
  width: 45%;
  aspect-ratio: 1;
  padding: 20px;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  /* justify-content: end; */
  .settingIcon {
    position: absolute;
    font-size: 20px;
    top: 10px;
    right: 10px;
    opacity: 0.7;
  }
`;
