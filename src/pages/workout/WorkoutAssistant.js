import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

function WorkoutAssistant() {
  const { currentWorkout } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWorkout) {
      console.log('No workout found');
      navigate('/dashboard');
      return;
    }
  }, [currentWorkout, navigate]);

  if (!currentWorkout) {
    return null; // Evita di renderizzare nulla se il workout non esiste
  }

  return (
    <Container>
      <Title>{currentWorkout.name}</Title>
      {/* <Date>
        {new Date(currentWorkout.date).toLocaleDateString()} -{' '}
        {new Date(currentWorkout.start).toLocaleTimeString()} a{' '}
        {new Date(currentWorkout.end).toLocaleTimeString()}
      </Date> */}
      <Notes>Note: {currentWorkout.notes}</Notes>

      <Sections>
        {currentWorkout.sections.map((section) => (
          <Section key={section._id.$oid}>
            <SectionTitle>{section.name}</SectionTitle>
            {section.exercises.map((exercise) => (
              <Exercise key={exercise._id.$oid}>
                <ExerciseTitle>{exercise.name}</ExerciseTitle>
                {exercise.notes && (
                  <ExerciseNotes>Note: {exercise.notes}</ExerciseNotes>
                )}
                <SetTable>
                  <thead>
                    <tr>
                      <th>Serie</th>
                      <th>Ripetizioni</th>
                      <th>Peso (kg)</th>
                      <th>Riposo (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.exerciseSets.map((set, index) => (
                      <tr key={set._id.$oid}>
                        <td>{index + 1}</td>
                        <td>{set.reps}</td>
                        <td>{set.weight}</td>
                        <td>{set.rest}</td>
                      </tr>
                    ))}
                  </tbody>
                </SetTable>
              </Exercise>
            ))}
          </Section>
        ))}
      </Sections>
    </Container>
  );
}

export default WorkoutAssistant;

// Styled Components
const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const Date = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 10px;
`;

const Notes = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
`;

const Sections = styled.div`
  margin-top: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #444;
  margin-bottom: 10px;
`;

const Exercise = styled.div`
  margin-bottom: 10px;
`;

const ExerciseTitle = styled.h3`
  font-size: 1.2rem;
  color: #555;
`;

const ExerciseNotes = styled.p`
  font-size: 0.9rem;
  color: #777;
`;

const SetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
`;
