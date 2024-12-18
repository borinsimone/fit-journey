import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function BottomBar() {
  return (
    <Container>
      <LinkItem to='/dashboard'>Dashboard</LinkItem>
      <LinkItem to='/placeholder1'>Placeholder 1</LinkItem>
      <LinkItem to='/placeholder2'>Placeholder 2</LinkItem>
      <LinkItem to='/placeholder3'>Placeholder 3</LinkItem>
      <LinkItem to='/placeholder4'>Placeholder 4</LinkItem>
    </Container>
  );
}

export default BottomBar;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around; /* Distribuisci i link orizzontalmente */
  padding: 10px 0;
  background-color: #0e1014; /* Colore di sfondo */
  position: fixed;
  bottom: 0; /* Posizione fissa in basso */
`;

const LinkItem = styled(Link)`
  text-decoration: none; /* Rimuove il sottolineato */
  color: #333; /* Colore del testo */
  font-size: 16px;
  padding: 5px;
  transition: color 0.3s ease;

  &:hover {
    color: #007bff; /* Colore quando il link è hoverato */
  }
`;
