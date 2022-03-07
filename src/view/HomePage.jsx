import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <>
            {/* <img src="../public/undraw_savings_re_eq4w.svg" width='500px' height='500px' alt="" /> */}
            {/* <div className="mx-auto w-100">
            </div> */}
            <Row className="justify-content-md-center">
                <Col xs md='auto'>
                    <img className='center-block' src='/images/undraw_savings_re_eq4w.svg' width='400px' height='400px' alt="" />
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col xs md='auto'>
                    <h3>Bem-vindo(a) à InvestTech</h3>
                </Col>
            </Row>
            
            {/* <h3>Página Inicial</h3>
            <Link to='/funds'>Listar Fundos</Link><br />
            <Link to='#'>Cadastrar Ativos</Link><br />
            <Link to='/security_transactions'>Listar Trasações de Ativos</Link><br /> */}
        </>
    );
}

export default HomePage;