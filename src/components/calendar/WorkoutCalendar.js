import React, { useState, useEffect } from 'react';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { useGlobalContext } from '../../context/GlobalContext';

import styled from 'styled-components';
import { MdTune } from 'react-icons/md';

// Funzione per ottenere il primo giorno del mese
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

// Funzione per ottenere il numero di giorni in un mese
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};
const getToday = () => {
  const today = new Date();
  return today.getDate(); // Restituisce il giorno del mese (1-31)
};
const WorkoutCalendar = () => {
  const { workouts } = useGlobalContext(); // Ottieni i workout dal contesto globale
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = getToday();
  // Ottieni il mese e l'anno correnti
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  // Giorni della settimana in italiano
  const daysOfWeek = ['d', 'l', 'm', 'm', 'g', 'v', 's'];

  // Primo giorno del mese corrente
  const firstDay = getFirstDayOfMonth(year, month);

  // Numero di giorni nel mese corrente
  const daysInMonth = getDaysInMonth(year, month);

  // Funzione per cambiare mese
  const changeMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  // Griglia dei giorni
  const generateCalendarDays = () => {
    const calendarDays = [];
    let dayCounter = 1;

    // Riempie i giorni precedenti se il mese non inizia di lunedì
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null); // Aggiungi giorni vuoti
    }

    // Aggiungi i giorni del mese corrente
    for (let i = firstDay; i < 7 && dayCounter <= daysInMonth; i++) {
      calendarDays.push(dayCounter);
      dayCounter++;
    }

    // Continua a riempire la griglia con più righe
    while (dayCounter <= daysInMonth) {
      for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
        calendarDays.push(dayCounter);
        dayCounter++;
      }
    }

    return calendarDays;
  };

  const calendarDays = generateCalendarDays();
  return (
    <Container>
      <button
        className='prev'
        onClick={() => changeMonth(-1)}
      >
        &lt;
      </button>
      <button
        className='next'
        onClick={() => changeMonth(1)}
      >
        &gt;
      </button>
      <div className='calendar'>
        <div className='calendar-header'>
          <span>
            {currentDate.toLocaleString('it-IT', {
              month: 'long',
            })}
          </span>
        </div>
        <div className='calendarBody'>
          <div className='calendar-weekdays'>
            {daysOfWeek.map((day, index) => (
              <div
                key={index}
                className='calendar-weekday'
              >
                {day}
              </div>
            ))}
          </div>
          <div className='calendar-days'>
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${day === today ? 'today' : ''}`}
              >
                {day || ''}
              </div>
            ))}
          </div>
        </div>
      </div>
      <MdTune className='settingIcon' />
    </Container>
  );
};

export default WorkoutCalendar;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  position: relative;
  color: #d9d9d9;
  background-color: #d9d9d910;
  border: 1px solid #00c6be;
  box-shadow: 0 0 30px #00000075;
  border-radius: 20px;
  .settingIcon {
    position: absolute;
    bottom: 10px;
    right: 10px;
    opacity: 70%;
    font-size: 20px;
  }
  .calendar {
    width: 300px;
    margin: 20px auto;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .prev {
    position: absolute;
    left: 10px;
    color: #d9d9d9;
  }
  .next {
    position: absolute;
    right: 10px;
    color: #d9d9d9;
  }
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 25px;
    span {
      text-transform: capitalize;
    }
  }

  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr); /* 7 colonne */
    text-align: center;
    opacity: 60%;
  }

  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr); /* 7 colonne */
    text-align: center;
    /* grid-gap: 5px; */
  }
  .today {
    background-color: #00c6be;
    border-radius: 50px;
  }

  .calendar-day {
    text-align: center;
    padding: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font-weight: 100 !important;
  }

  .calendar-day.today {
    /* background-color: yellow; */
    font-weight: bold;
  }

  .calendar-weekday {
    font-weight: bold;
  }
`;
