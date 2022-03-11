import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const HomePage = () => {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs md='auto'>
                    <img src='/images/undraw_savings_re_eq4w.svg' width='400px' height='400px'/>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col xs md='auto'>
                    <h3>Bem-vindo(a) à InvestTech</h3>
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;