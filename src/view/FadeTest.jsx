import React, { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import TitleWithBackButton from '../components/TitleWithBackButton';

import { Transition } from 'react-transition-group';

const FadeTest = () => {

    const duration = 300;

    const defaultStyle = {
      transition: `opacity ${duration}ms ease-in-out`,
      opacity: 0,
    }
    
    const transitionStyles = {
      entering: { opacity: 1 },
      entered:  { opacity: 1 },
      exiting:  { opacity: 0 },
      exited:  { opacity: 0 },
    };
    
    const Fade = ({ in: inProp }) => (
      <Transition in={inProp} timeout={duration}>
        {state => (
          <div style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}>
            I'm a fade Transition!
          </div>
        )}
      </Transition>
    );

    const [teste, setTeste] = useState('222');

    function changeTeste() {
        setTeste(teste + '1');
    }

    let inteste = false;
    const [mode, setMode] = React.useState("out-in");
    const [state, setState] = React.useState(true);
    return (
        <Container>
            
            <TitleWithBackButton title='Teste Fade In'></TitleWithBackButton>
            <Fade></Fade>

            <Transition in={inteste} appear={true} timeout={150}>
                {teste => (
                    <Fade className={`fade fade-${teste}`} />
                )}
            </Transition>

            <p>{teste}</p>
            <button onClick={() => changeTeste()}></button>
        </Container>
    );
}

export default FadeTest;