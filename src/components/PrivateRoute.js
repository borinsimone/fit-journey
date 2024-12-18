// PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente che protegge le route
function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token'); // Verifica se il token è presente nel localStorage

  if (!isAuthenticated) {
    // Se l'utente non è autenticato, reindirizza alla pagina di login
    return <Navigate to='/login' />;
  }

  // Se l'utente è autenticato, rendi il componente (ad esempio, Dashboard)
  return children;
}

export default PrivateRoute;
