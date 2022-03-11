import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Toast, Alert, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { createSecurity, getSecuritiesList, getSecurity, updateSecurity } from '../api/api';

import TitleWithBackButton from '../components/TitleWithBackButton';

const RegisterSecurity = () => {
    const [securitiesList, setSecuritiesList] = useState(-1);
    const [symbol, setSymbol] = useState('');
    const [type, setType] = useState('');

    const {id} = useParams();

    // toast
    const [show, setShow] = useState(false);
    const [toastMessage, setToastMessage] = useState('Registro realizado com sucesso');
    const [toastVariant, setToastVariant] = useState('success');

    useEffect(() => {
        if (id) {
            getSecurity(id)
            .then(res => {
                setSymbol(res.data.symbol);
                setType(res.data.security_type)
            })

            return;
        }
        
        getSecuritiesList().then()

    }, []);



    function handleSymbolChange(event) {
        setSymbol(event.target.value);
    }

    function handleTypeChange(event) {
        setType(event.target.value);
    }



    function displayToast(variant, message) {
        setToastMessage(message);
        setToastVariant(variant)
        setShow(true);
    }

    function handleSubmit(event) {
        event.preventDefault();
        
        let body = {
            symbol,
            security_type: type
        }

        let request;

        if (id) request = updateSecurity(id, body);
        else request = createSecurity(body);

        request
        .then(res => displayToast('success', 'Operação realizada com sucesso'))
        .catch(err => displayToast('danger', 'Falha ao realizar a operação'))

        // let body = {
        //     date,
        //     description,
        //     value: Number(value),
        //     fund_id: selectedFundId,
        // }
        // let url = 'http://localhost:3000/cash_transactions/';
        // console.log(body);

        // if (id !== undefined) { //edição
        //     let url = `http://localhost:3000/cash_transactions/${id}`;
        //     body = {
        //         description,
        //         value: Number(value),
        //         date
        //     }

        //     axios.patch(url, body)
        //     .then(res => {
        //         displayToast('success', 'Alteração realizada com sucesso')
        //     })
        //     .catch(err => {
        //         displayToast('danger', 'Falha ao realizar a operação')
        //     })

        //     return;
        // }


        // axios.post(url, body)
        // .then(res => {
        //     displayToast('success', 'Registro realizado com sucesso')
        // })
        // .catch(err => {
        //     displayToast('danger', 'Falha ao realizar a operação')
        // })


    }

    return (
        <Container>
            {/* <h3>{id ? 'Editar' : 'Registrar'} transação de Caixa</h3> */}

            <TitleWithBackButton title={id ? 'Editar ativo' : 'Registrar ativo'} />

            <form onSubmit={handleSubmit} className='w-25'>
                <h5>Símbolo do ativo</h5>
                <Form.Control type="text" value={symbol} onChange={handleSymbolChange}/>
                <br />

                <h5>Tipo do ativo</h5>
                <Form.Control type="text" placeholder='' value={type} onChange={handleTypeChange} />

                <br />

                <Button type='submit'>Registrar operação</Button>  
            </form>

            <div className="position-relative position-relative-example">
                <Toast 
                    bg={toastVariant} 
                    className='position-absolute top-100 start-50 translate-middle' 
                    onClose={() => setShow(false)} 
                    show={show} 
                    delay={3000} 
                    autohide
                >
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">{toastMessage}</strong>
                    </Toast.Header>
                </Toast>
            </div>

        </Container>
    );
}

export default RegisterSecurity;