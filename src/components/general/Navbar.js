import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/GlobalContext';
import LogoutButton from '../LogoutButton';

function Navbar({ user }) {
  const {} = useGlobalContext();
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'BUON GIORNO';
    } else if (hour >= 12 && hour < 18) {
      return 'BUON POMERIGGIO';
    } else {
      return 'BUONA SERA';
    }
  };
  return (
    <Container>
      <div className='userText'>
        <div className='greeting'>{getGreeting()},</div>
        <div className='username'>{user?.name}</div>
      </div>

      <Logo />
    </Container>
  );
}

export default Navbar;
const Container = styled.div`
  width: 100%;
  /* padding: 20px 20px; */
  display: flex;
  align-items: center;
  color: #d9d9d9;
  .userText {
    margin-right: auto;
    display: flex;
    flex-direction: column;
    gap: 5px;
    .greeting {
      font-size: 14px;
      font-weight: 100;
    }
    .username {
      font-size: 20px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }
`;
const Logo = styled.div`
  height: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #d9d9d9;
`;
{
  /* <div className='sportName'>calistenico</div>
        <div className='UserName'>{user && user.name}</div> */
}
