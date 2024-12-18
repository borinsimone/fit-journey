import React, { useEffect, useState } from 'react';
import '../../styles/calendarStyle.css';
import { useGlobalContext } from '../../context/GlobalContext';
import styled from 'styled-components';

const AddForm = ({ setFormOpen, start, end, events, setEvents }) => {
  const { addWorkout } = useGlobalContext();
  const [duration, setDuration] = useState(0); // Durata in minuti, di default 0

  // Log start quando il componente viene caricato
  useEffect(() => {
    console.log(start);
  }, []);
  // newWorkout
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    sections: [],
    date: start,
    start: start,
    end: end,
    notes: '',
  });

  // Aggiorna l'oggetto `newWorkout` ogni volta che `duration` cambia
  useEffect(() => {
    const calculatedEnd = end || new Date(start.getTime() + duration * 60000);
    setNewWorkout((prevWorkout) => ({
      ...prevWorkout,
      end: calculatedEnd,
    }));
  }, [duration, end, start]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Converte le date in formato Date prima di inviare a MongoDB
    const workoutToSave = {
      ...newWorkout,
      // start: new Date(newWorkout.start),
      end: new Date(newWorkout.end),
    };
    console.log(workoutToSave);

    addWorkout(workoutToSave); // Salva nel database
    setFormOpen(false); // Chiude il form
  };

  const handleChange = (e, sectionIndex, exerciseIndex, setIndex, field) => {
    const { name, value } = e.target;
    const updatedSections = [...newWorkout.sections];

    if (field === 'section') {
      updatedSections[sectionIndex][name] = value;
    } else if (field === 'exercise') {
      updatedSections[sectionIndex].exercises[exerciseIndex][name] = value;
    } else if (field === 'set') {
      updatedSections[sectionIndex].exercises[exerciseIndex].exerciseSets[
        setIndex
      ][name] = value;
    } else {
      setNewWorkout({ ...newWorkout, [name]: value });
      return;
    }

    setNewWorkout({ ...newWorkout, sections: updatedSections });
  };

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value, 10) || 0; // Converte la durata in numero, predefinito 0
    setDuration(newDuration);
  };

  const handleAddSection = () => {
    const newSection = {
      name: '',
      exercises: [],
    };
    setNewWorkout({
      ...newWorkout,
      sections: [...newWorkout.sections, newSection],
    });
  };

  const handleAddExercise = (sectionIndex) => {
    const newExercise = {
      name: '',
      sets: 0,
      exerciseSets: [{ reps: 0, weight: 0, rest: 0 }],
      notes: '',
    };
    const updatedSections = [...newWorkout.sections];
    updatedSections[sectionIndex].exercises.push(newExercise);
    setNewWorkout({
      ...newWorkout,
      sections: updatedSections,
    });
  };
  const handleAddSet = (sectionIndex, exerciseIndex) => {
    const updatedSections = [...newWorkout.sections];
    const exerciseSets =
      updatedSections[sectionIndex].exercises[exerciseIndex].exerciseSets;

    // Prendi i valori dell'ultimo set o usa i valori di default
    const lastSet = exerciseSets[exerciseSets.length - 1];
    const newSet = lastSet
      ? { ...lastSet } // Copia i valori dell'ultimo set
      : { reps: 0, weight: 0, rest: 0 }; // Valori di default

    // Aggiungi il nuovo set
    exerciseSets.push(newSet);

    // Aggiorna lo stato
    setNewWorkout({
      ...newWorkout,
      sections: updatedSections,
    });
  };

  useEffect(() => {
    console.log(newWorkout);
  }, [newWorkout]);
  // Rimuovi un set
  const handleRemoveSet = (sectionIndex, exerciseIndex, setIndex) => {
    newWorkout.sections[sectionIndex].exercises[
      exerciseIndex
    ].exerciseSets.splice(setIndex, 1); // Rimuovi il set dall'esercizio
    setNewWorkout({
      ...newWorkout,
      sections: [...newWorkout.sections], // Aggiorna le sezioni con il set rimosso
    });
  };
  // Rimuovi esercizo
  const handleRemoveExercise = (sectionIndex, exerciseIndex) => {
    newWorkout.sections[sectionIndex].exercises.splice(exerciseIndex, 1); // Rimuovi l'esercizio
    setNewWorkout({
      ...newWorkout,
      sections: [...newWorkout.sections], // Aggiorna le sezioni con l'esercizio rimosso
    });
  };
  // Rimuovi sezione
  const handleRemoveSection = (sectionIndex) => {
    newWorkout.sections.splice(sectionIndex, 1); // Rimuovi la sezione
    setNewWorkout({
      ...newWorkout,
      sections: [...newWorkout.sections], // Aggiorna lo stato con il nuovo array di sezioni
    });
  };
  return (
    <Container>
      <CloseBtn
        onClick={() => {
          setFormOpen(false);
        }}
      >
        x
      </CloseBtn>
      <Form onSubmit={handleSubmit}>
        <h2>Crea un nuovo allenamento</h2>
        <div className='fieldContainer'>
          <label>Nome Workout:</label>
          <input
            type='text'
            name='name'
            value={newWorkout.name}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <HourContainer>
          <label>Orario:</label>
          <input
            type='time'
            name='start'
            value={new Date(newWorkout.start).toLocaleTimeString('it-IT', {
              hour: '2-digit',
              minute: '2-digit',
            })} // Formatta per visualizzare solo l'orario locale
            onChange={(e) => handleChange(e)}
          />
          -{' '}
          <div>
            <input
              type='time'
              name='end'
              value={new Date(newWorkout.end).toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit',
              })} // Formatta per visualizzare solo l'orario locale
              onChange={(e) => handleChange(e)}
            />
          </div>
        </HourContainer>

        <h3>Sezioni</h3>
        {newWorkout.sections.map((section, sectionIndex) => (
          <SectionContainer key={sectionIndex}>
            <RemoveButton
              type='button'
              onClick={() => handleRemoveSection(sectionIndex)}
            >
              Elimina Sezione
            </RemoveButton>
            <FieldContainer>
              <label>Nome Sezione:</label>
              <input
                type='text'
                name='name'
                value={section.name}
                onChange={(e) =>
                  handleChange(e, sectionIndex, null, null, 'section')
                }
                placeholder='Nome sezione'
              />
            </FieldContainer>

            <h4>Esercizi</h4>
            {section.exercises.map((exercise, exerciseIndex) => (
              <ExerciseContainer key={exerciseIndex}>
                <RemoveButton
                  type='button'
                  onClick={() =>
                    handleRemoveExercise(sectionIndex, exerciseIndex)
                  }
                >
                  Elimina Esercizio
                </RemoveButton>
                <label>Nome Esercizio:</label>
                <input
                  type='text'
                  name='name'
                  value={exercise.name}
                  onChange={(e) =>
                    handleChange(
                      e,
                      sectionIndex,
                      exerciseIndex,
                      null,
                      'exercise'
                    )
                  }
                  placeholder='Nome esercizio'
                />

                <label>Set: {exercise.exerciseSets.length}</label>
                {exercise.exerciseSets.map((set, setIndex) => (
                  <SetContainer
                    key={setIndex}
                    className='setsContainer'
                    style={{ display: 'flex' }}
                  >
                    <RemoveButton
                      className='deleteBtn'
                      type='button'
                      onClick={() =>
                        handleRemoveSet(sectionIndex, exerciseIndex, setIndex)
                      }
                    >
                      X
                    </RemoveButton>
                    <div className='exReps exField'>
                      <label>Ripetizioni:</label>
                      <input
                        type='number'
                        name='reps'
                        value={set.reps}
                        onChange={(e) =>
                          handleChange(
                            e,
                            sectionIndex,
                            exerciseIndex,
                            setIndex,
                            'set'
                          )
                        }
                        placeholder='Ripetizioni'
                      />
                    </div>
                    <div className='exWeight exField'>
                      <label>Peso:</label>
                      <input
                        type='number'
                        name='weight'
                        value={set.weight}
                        onChange={(e) =>
                          handleChange(
                            e,
                            sectionIndex,
                            exerciseIndex,
                            setIndex,
                            'set'
                          )
                        }
                        placeholder='Peso'
                      />
                    </div>
                    <div className='exRest exField'>
                      <label>Riposo:</label>
                      <input
                        type='number'
                        name='rest'
                        value={set.rest}
                        onChange={(e) =>
                          handleChange(
                            e,
                            sectionIndex,
                            exerciseIndex,
                            setIndex,
                            'set'
                          )
                        }
                        placeholder='Riposo (in secondi)'
                      />
                    </div>
                  </SetContainer>
                ))}

                <AddButton
                  type='button'
                  onClick={() => handleAddSet(sectionIndex, exerciseIndex)}
                >
                  Aggiungi Set
                </AddButton>
                <div>
                  <label>Note Esercizio:</label>
                  <textarea
                    name='notes'
                    value={exercise.notes}
                    onChange={(e) =>
                      handleChange(
                        e,
                        sectionIndex,
                        exerciseIndex,
                        null,
                        'exercise'
                      )
                    }
                    placeholder="Aggiungi note per l'esercizio"
                  />
                </div>
              </ExerciseContainer>
            ))}
            <AddButton
              type='button'
              onClick={() => handleAddExercise(sectionIndex)}
            >
              Aggiungi Esercizio
            </AddButton>
          </SectionContainer>
        ))}

        <AddButton
          type='button'
          onClick={handleAddSection}
        >
          Aggiungi Sezione
        </AddButton>

        <div>
          <label>Note:</label>
          <textarea
            name='notes'
            value={newWorkout.notes}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <SaveBtn type='submit'>Salva</SaveBtn>
      </Form>
    </Container>
  );
};

export default AddForm;
const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 80%;
  max-width: 500px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 40;
  padding: 20px;
  overflow-y: auto;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CloseBtn = styled.button`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  color: white;
  background-color: red;
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  h2 {
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
  }
`;

const FieldContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  label {
    flex: 1;
    font-size: 16px;
    color: #2c3e50;
  }

  input,
  textarea {
    flex: 2;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
    }
  }

  textarea {
    resize: none;
  }
`;

const HourContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  input {
    padding: 2px 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: #3498db;
    }
  }
`;

const SectionContainer = styled.div`
  position: relative;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #f1f1f1;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
`;

const ExerciseContainer = styled.div`
  position: relative;
  margin: 15px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #ffffff;

  label {
    display: block;
    font-size: 14px;

    color: #2c3e50;
  }

  input,
  textarea {
    width: 100%;
    padding: 8px;

    border: 1px solid #ddd;
    border-radius: 5px;

    &:focus {
      outline: none;
      border-color: #3498db;
    }
  }
`;

const SetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  position: relative;
  .exField {
    flex: 1;

    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 5px;

      &:focus {
        outline: none;
        border-color: #3498db;
      }
    }
  }
`;

const AddButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;
const SaveBtn = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;
