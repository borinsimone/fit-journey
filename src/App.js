// App.js

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute'; // Importa il componente PrivateRoute
import { GlobalProvider } from './context/GlobalContext';
import SignUp from './pages/SignUp';
import WorkoutAssistant from './pages/workout/WorkoutAssistant';

function App() {
  const isAuthenticated = localStorage.getItem('token'); // Controlla se c'è un token

  return (
    <GlobalProvider>
      <Router>
        <Routes>
          {/* Se l'utente non è autenticato, lo reindirizziamo a login */}
          <Route
            path='/'
            element={
              isAuthenticated ? (
                <Navigate to='/dashboard' />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route
            path='/sign-up'
            element={<SignUp />}
          />
          {/* Verifica il percorso */}
          <Route
            path='/login'
            element={<Login />}
          />
          {/* Proteggi la rotta della dashboard con PrivateRoute */}
          <Route
            path='/dashboard'
            element={isAuthenticated ? <Dashboard /> : <Navigate to='/login' />}
          />
          <Route
            path='/:title'
            element={<WorkoutAssistant />}
          />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
