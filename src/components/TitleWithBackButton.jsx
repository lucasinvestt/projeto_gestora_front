import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TitleWithBackButton = ({title}) => {
    const navigate = useNavigate();

    return (
        <Row className='mt-3 mb-3'>
            <Col><button className='btn btn-primary' onClick={() => navigate(-1)}>Voltar</button></Col>
            <Col className='col-auto'><h2 className="text-center">{title}</h2></Col>
            <Col></Col>
        </Row>
        // <Row className='mt-3 mb-3'>
        //     <Col><button className='btn btn-primary' onClick={() => navigate(-1)}>Voltar</button></Col>
        //     <Col><h2 className="text-center">{title}</h2></Col>
        //     <Col></Col>
        // </Row>
    );

}

export default TitleWithBackButton;