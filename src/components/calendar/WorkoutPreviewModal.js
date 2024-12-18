import { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

const WorkoutPreviewModal = ({ event, setModalOpen, setEvents }) => {
  const { editWorkout, deleteWorkout, setCurrentWorkout } = useGlobalContext();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(event.title);
  const [duration, setDuration] = useState(event.duration || '');
  const [exercises, setExercises] = useState(event.exercises || []);
  const [notes, setNotes] = useState(event.notes || '');
  const [expandedSections, setExpandedSections] = useState({}); // Stato per sezioni
  const [expandedExercises, setExpandedExercises] = useState({}); // Stato per esercizi

  const navigate = useNavigate();
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => {
      const isSectionOpen = prev[sectionId];

      // Se la sezione si sta chiudendo, chiudi anche tutti gli esercizi al suo interno
      if (isSectionOpen) {
        const updatedExercises = { ...expandedExercises };
        event.sections
          .find((section) => section._id === sectionId)
          .exercises.forEach((exercise) => {
            delete updatedExercises[exercise._id];
          });
        setExpandedExercises(updatedExercises);
      }

      return {
        ...prev,
        [sectionId]: !isSectionOpen,
      };
    });
  };

  const toggleExercise = (exerciseId) => {
    setExpandedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  return (
    <ModalContainer>
      <button
        className='closebtn'
        onClick={() => setModalOpen(false)}
      >
        Close
      </button>
      <div className='workout-preview-modal'>
        <div className='modal-header'>
          <h2>{event.title}</h2>
        </div>
        <div className='modal-content'>
          <div className='workout-info'>
            <p>
              <strong>Data:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Orario:</strong>{' '}
              {new Date(event.start).toLocaleTimeString()} -{' '}
              {new Date(event.end).toLocaleTimeString()}
            </p>
            <p>
              <strong>Note:</strong> {event.notes}
            </p>
          </div>
          <div className='workout-sections'>
            <h3>Sezioni</h3>
            {event.sections.map((section) => (
              <div
                className='section'
                key={section._id}
              >
                <h4 onClick={() => toggleSection(section._id)}>
                  {section.name} {expandedSections[section._id] ? '▲' : '▼'}
                </h4>
                <Collapsible expanded={expandedSections[section._id]}>
                  <ul className='exercises'>
                    {section.exercises.map((exercise) => (
                      <li
                        key={exercise._id}
                        className='exercise'
                        onClick={() => toggleExercise(exercise._id)}
                      >
                        <div className='exercise-name'>
                          {exercise.name}{' '}
                          {expandedExercises[exercise._id] ? '▲' : '▼'}
                        </div>
                        <Collapsible expanded={expandedExercises[exercise._id]}>
                          <div className='exercise-details'>
                            <p>
                              <strong>Set:</strong>{' '}
                              {exercise.exerciseSets.length}
                            </p>
                            {exercise.exerciseSets.map((set, index) => (
                              <div
                                key={set._id}
                                className='exercise-set'
                              >
                                {set.reps > 0 && (
                                  <p>
                                    <strong>Reps:</strong> {set.reps}
                                  </p>
                                )}
                                {set.weight > 0 && (
                                  <p>
                                    <strong>Weight:</strong> {set.weight} kg
                                  </p>
                                )}
                                {set.rest > 0 && (
                                  <p>
                                    <strong>Rest:</strong> {set.rest} sec
                                  </p>
                                )}
                              </div>
                            ))}
                            <p>
                              <strong>Note:</strong> {exercise.notes}
                            </p>
                          </div>
                        </Collapsible>
                      </li>
                    ))}
                  </ul>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='btnContainer'>
        <div className='leftBtn'>
          <button onClick={() => setEditing(true)}>Modifica</button>
          <button
            onClick={() => {
              deleteWorkout(event._id);
              console.log(event._id);

              setModalOpen(false);
            }}
          >
            Elimina
          </button>
        </div>
        <button
          onClick={() => {
            setModalOpen(false);
            setCurrentWorkout(event);
            navigate(`/${event.title}`);
          }}
        >
          Iniza Allenamento
        </button>
      </div>
    </ModalContainer>
  );
};

const Collapsible = ({ expanded, children }) => (
  <div
    className='collapsible'
    style={{
      display: 'grid',
      height: expanded ? 'auto' : '0',
      gridTemplateRows: '0fr',
      overflow: 'hidden',
      transition: 'height 0.3s ease',
    }}
  >
    {children}
  </div>
);

export default WorkoutPreviewModal;
const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  max-width: 90vw;
  background: #fdfdfd; /* Colore simile alla carta */
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
  border: 2px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* Aggiungi "fori" sul lato sinistro */
  &:before {
    content: '';
    position: absolute;
    top: 10px;
    left: 0px;
    height: calc(100% - 20px);
    width: 15px;
    background: repeating-linear-gradient(
      #fdfdfd 0,
      #fdfdfd 8px,
      transparent 8px,
      transparent 16px
    );
    z-index: 20;
  }
  .collapsible {
  }
  .workout-preview-modal {
    display: flex;
    flex-direction: column;

    .modal-header {
      text-align: center;
      margin-bottom: 15px;

      h2 {
        font-size: 1.8rem;
        color: #333;
      }
    }

    .modal-content {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .workout-info {
        background: #f9f9f9;
        border: 1px solid #ddd;
        padding: 5px 15px;
        border-radius: 10px;

        p {
          margin: 5px 0;
          font-size: 0.95rem;

          strong {
            color: #555;
          }
        }
      }

      .workout-sections {
        background: #fffdf9;
        border: 1px solid #ddd;
        padding: 5px 15px;

        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;

        h3 {
          /* margin-bottom: 10px; */
          color: #555;
          font-size: 1.2rem;
          border-bottom: 1px dashed #ccc;
          /* padding-bottom: 5px; */
        }

        .section {
          /* margin-bottom: 15px; */

          h4 {
            font-size: 1.1rem;
            color: #444;
            /* margin-bottom: 8px; */
          }

          .exercises {
            list-style: none;
            padding: 0;

            .exercise {
              background: #f7f7f7;
              border: 1px solid #ddd;
              padding: 10px;
              border-radius: 5px;
              margin-bottom: 10px;

              .exercise-name {
                font-weight: bold;
                margin-bottom: 5px;
                color: #333;
              }

              .exercise-details {
                p {
                  margin: 5px 0;
                  font-size: 0.9rem;

                  strong {
                    color: #555;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  button {
    padding: 10px 15px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #0056b3;
    }

    &.delete-btn {
      background: #dc3545;

      &:hover {
        background: #a71d2a;
      }
    }

    &.edit-btn {
      background: #ffc107;
      color: black;

      &:hover {
        background: #e0a800;
      }
    }
  }
  .closebtn {
    margin: 0;
    margin-left: auto;
  }

  textarea {
    padding: 10px;
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid #ccc;
    resize: vertical;
    font-family: 'Arial', sans-serif;
  }

  .exercise-set {
    display: flex;
    flex-direction: row;
    gap: 10px;

    p {
      font-size: 0.9rem;
    }
  }
  .section h4,
  .exercise .exercise-name {
    cursor: pointer;
    user-select: none;
  }
  .btnContainer {
    display: flex;
    gap: 5px;
    .leftBtn {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 5px;
    }
  }
`;
