import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import bg from '../assets/login/bg.png';
import logo from '../assets/login/logo.png';
function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // Stato per mostrare/nascondere la password
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('response ok');

        localStorage.setItem('token', data.token);

        navigate('/dashboard');
      } else {
        setError(data.error || 'Errore durante il login');
      }
    } catch (err) {
      setError('Errore di rete');
      console.error('Login error:', err);
    }
  };

  return (
    <Container>
      <Bg src={bg} />
      <FormContainer>
        <Logo src={logo} />
        <Form onSubmit={handleSubmit}>
          <input
            type='email'
            placeholder='Email'
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <div className='password-container'>
            <input
              type={showPassword ? 'text' : 'password'} // Alterna tra "text" e "password"
              placeholder='Password'
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
            <button
              type='button'
              className='toggle-password'
              onClick={() => setShowPassword(!showPassword)} // Cambia lo stato
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}{' '}
            </button>
          </div>
          <div className='formUtility'>
            <div className='remember'>
              <input type='checkbox' />
              <div> remember me</div>
            </div>
            <div className='retrievePassword'>Password dimenticata?</div>
          </div>

          <button
            className='submit'
            type='submit'
          >
            Sign in
          </button>
        </Form>
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
          Non hai un account? <Link to='/sign-up'>Registrati</Link>
        </Register>
      </FormContainer>
    </Container>
  );
}

export default Login;
const Bg = styled.img`
  object-fit: cover;

  position: absolute;
  top: -10%;
  z-index: -1;
`;
const Logo = styled.img`
  position: absolute;
  z-index: 10;
  height: 100px;
  left: 0;
  top: -100px;
`;
const Container = styled.div`
  height: 100dvh;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  position: relative;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: 10px;
  /* background-color: #16181f; */
  color: rgba(255, 255, 255, 0.7);
  padding: 20px 0;
  &::before {
    content: '';
    padding: 20px 0;
    position: absolute;
    width: 100vw;
    height: 100%;
    background-color: #16181f;
    z-index: -1;
    bottom: 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;
  width: 100%;
  input {
    width: 100%;
    padding: 20px 12px;

    font-size: 16px;
    background-color: #3d3d3d; /* Colore di sfondo grigio scuro */
    color: rgba(255, 255, 255, 0.7); /* Colore testo grigio chiaro */
    border: none; /* Rimuove il bordo */
    border-radius: 8px; /* Bordo arrotondato */
    outline: none; /* Rimuove il contorno al focus */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* Ombra sottile */
    &::placeholder {
      color: rgba(
        255,
        255,
        255,
        0.5
      ); /* Colore placeholder leggermente trasparente */
      font-style: italic; /* Testo placeholder in corsivo */
    }
  }

  .password-container {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    input {
      width: 100%;
      padding: 20px 12px;

      font-size: 16px;
      background-color: #3d3d3d; /* Colore di sfondo grigio scuro */
      color: rgba(255, 255, 255, 0.7); /* Colore testo grigio chiaro */
      border: none; /* Rimuove il bordo */
      border-radius: 8px; /* Bordo arrotondato */
      outline: none; /* Rimuove il contorno al focus */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* Ombra sottile */
      &::placeholder {
        color: rgba(
          255,
          255,
          255,
          0.5
        ); /* Colore placeholder leggermente trasparente */
        font-style: italic; /* Testo placeholder in corsivo */
      }
    }
    .toggle-password {
      position: absolute;
      right: 10px;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      user-select: none;
      svg {
        user-select: none;
      }
    }
  }
  .formUtility {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8em;
    .remember {
      display: flex;
      align-items: center;
      text-transform: capitalize;
      flex: 1;
      gap: 10px;
      input {
        all: unset;
        height: 20px;
        width: 20px;
        border-radius: 5px;
        border: 1px solid rgba(255, 255, 255, 0.7);
      }
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
  width: 100%;
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
