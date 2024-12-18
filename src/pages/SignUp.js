import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import bg from '../assets/login/bg.png';
import logo from '../assets/login/logo.png';
function SignUp() {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null); // Per controllare se le password coincidono
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Controllo lato client: verifica che le password corrispondano
    if (credentials.password !== credentials.confirmPassword) {
      setPasswordError('Le password non coincidono');
      return;
    }

    setPasswordError(null); // Resetta eventuali errori precedenti

    try {
      // Chiamata al backend per la registrazione
      const response = await fetch('http://localhost:5001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Una volta che la registrazione è andata a buon fine, facciamo il login
        const loginResponse = await fetch('http://localhost:5001/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          // Salva il token nel localStorage
          localStorage.setItem('token', loginData.token);

          // Reindirizza alla dashboard
          navigate('/dashboard');
        } else {
          setError(loginData.error || 'Errore durante il login');
        }
      } else {
        setError(data.error || 'Errore durante la registrazione');
      }
    } catch (err) {
      setError('Errore di rete');
      console.error('Registrazione o login error:', err);
    }
  };

  return (
    <Container>
      <Bg src={bg} />

      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Nome'
            value={credentials.name}
            onChange={(e) =>
              setCredentials({ ...credentials, name: e.target.value })
            }
          />
          <input
            type='email'
            placeholder='Email'
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <input
            type='password'
            placeholder='Password'
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          <input
            type='password'
            placeholder='Conferma Password'
            value={credentials.confirmPassword}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                confirmPassword: e.target.value,
              })
            }
          />
          <button
            className='submit'
            type='submit'
          >
            Registrati
          </button>
        </Form>
        {/* <div>
        Hai un account? <Link to='/login'>Accedi</Link>
      </div> */}
        <Or>
          <div className='line' />
          or
          <div className='line' />
        </Or>
        <OtherLogin>
          <div></div>
          <div></div>
          <div></div>
        </OtherLogin>
        <Register>
          Hai un account? <Link to='/login'>Accedi</Link>
        </Register>

        {/* Errori */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
      </FormContainer>
      <Logo src={logo} />
    </Container>
  );
}

export default SignUp;
const Container = styled.div`
  height: 100dvh;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* background-color: #16181f; */
  color: rgba(255, 255, 255, 0.7);
  position: relative;
`;
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  width: 100%;
  height: 100%;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  background: rgb(22, 24, 31);
  background: -moz-linear-gradient(
    0deg,
    rgba(22, 24, 31, 1) 62%,
    rgba(22, 24, 31, 0) 100%
  );
  background: -webkit-linear-gradient(
    0deg,
    rgba(22, 24, 31, 1) 62%,
    rgba(22, 24, 31, 0) 100%
  );
  background: linear-gradient(
    0deg,
    rgba(22, 24, 31, 1) 62%,
    rgba(22, 24, 31, 0) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#16181f",endColorstr="#16181f",GradientType=1);
`;
const Form = styled.form`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  input {
    width: 100%;
    padding: 20px 12px;
    font-size: 16px;
    /* background-color: #3d3d3d; */
    background-color: rgba(255, 255, 255, 0.3);

    color: rgba(255, 255, 255, 0.7); /* Colore testo grigio chiaro */
    border: none; /* Rimuove il bordo */
    border-radius: 8px; /* Bordo arrotondato */
    outline: none; /* Rimuove il contorno al focus */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* Ombra sottile */
    &::placeholder {
      color: rgba(
        0,
        0,
        0,
        0.5
      ); /* Colore placeholder leggermente trasparente */
      font-style: italic; /* Testo placeholder in corsivo */
      font-weight: bolder;
    }
  }
  .submit {
    all: unset;
    width: 100%;
    color: #16181f;
    background-color: #3dfcc4;
    padding: 20px 0;
    text-align: center;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
  }
`;
const Or = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  gap: 10px;
  .line {
    height: 1px;
    flex: 1;
    background-color: rgba(255, 255, 255, 0.7);
  }
`;

const OtherLogin = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  div {
    height: 50px;
    aspect-ratio: 1;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 10px;
  }
`;

const Register = styled.div`
  a {
    color: #3dfcc4;
    cursor: pointer;
  }
`;
const Bg = styled.img`
  object-fit: cover;

  position: absolute;
  top: -10%;
  z-index: -1;
`;
const Logo = styled.img`
  position: absolute;
  z-index: 10;
  height: 150px;
  left: 0;
  bottom: 10px;
  /* top: -100px; */
`;
