import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, Toast } from 'react-bootstrap';
import TitleWithBackButton from '../components/TitleWithBackButton';

const RegisterFund = () => {
    const [fundName, setFundName] = useState('');
    let navigate = useNavigate();
    let {id} = useParams();

    const [date, setDate] = useState((new Date()).toISOString().split('T')[0]);


    // toast
    const [show, setShow] = useState(false);
    const [toastMessage, setToastMessage] = useState('Registro realizado com sucesso');
    const [toastVariant, setToastVariant] = useState('success');

    useEffect(() => {
        if (id) {
            let url = `http://localhost:3000/funds/${id}`
            axios.get(url)
            .then(res => {
                setFundName(res.data.name);
                setDate(res.data.date);
                console.log('res');
                console.log(res);
            })
            .catch(err => {
                console.log('err');
                console.log(err);
            })
        }
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        console.log('opa, submit');

        //edit
        if (id) {
            let url = `http://localhost:3000/funds/${id}`

            let body = {
                name: fundName,
                date
            }

            axios.patch(url, body)
            .then(res => {
                setToastMessage('Operação realizada com sucesso');
                setToastVariant('success')
                setShow(true);
                console.log(res);
            })
            .catch(err => {
                setToastMessage('Falha ao realizar a operação');
                setToastVariant('danger')
                setShow(true);
                console.log("erro");
                console.log(err);
            })
            return;
        }

        let url = `http://localhost:3000/funds/`
        // let date = (new Date()).toISOString().split('T')[0];

        let body = {
            date,
            name: fundName
        }

        axios.post(url, body)
        .then(res => {
            setToastMessage('Operação realizada com sucesso');
            setToastVariant('success')
            setShow(true);
            console.log(res);
        })
        .catch(err => {
            setToastMessage('Falha ao realizar a operação');
            setToastVariant('danger')
            setShow(true);
            console.log("erro");
            console.log(err);
        })

    }

    function handleFundNameChange(event) {
        setFundName(event.target.value);
    }

    function onDateChange(event) {
        // console.log(date);
        setDate(event.target.value)
    }


    return (
        <Container>
            <TitleWithBackButton title='Cadastrar novo fundo'></TitleWithBackButton>
                
            <form onSubmit={handleSubmit}>
            {/* <Form> */}

                <h5>Nome do fundo</h5>
                <input 
                    type="text" 
                    placeholder='' 
                    value={fundName}
                    onChange={handleFundNameChange}
                />

                <br />

                <h5>Data</h5>
                <input value={date} onChange={onDateChange} type="date"></input><br />
                <br></br>

                <Button onClick={handleSubmit}>Registrar operação</Button>  
            {/* </Form> */}
            </form>

            <Toast bg={toastVariant} className='fixed-top' onClose={() => setShow(false)} show={show} delay={3000} autohide>
                <Toast.Header>
                    <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                    />
                    <strong className="me-auto">{toastMessage}</strong>
                </Toast.Header>
            </Toast>
        </Container>
    );
}

export default RegisterFund;