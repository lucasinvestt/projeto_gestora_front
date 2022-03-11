import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Button, Toast, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getClosePrice } from '../api/api';
import TitleWithBackButton from '../components/TitleWithBackButton';

import Select from 'react-select'

const RegisterClosePrice = () => {
    const [selectedSecurityId, setSelectedSecurityId] = useState(-1);
    const [closePrice, setClosePrice] = useState(0);
    const [securitiesList, setSecuritiesList] = useState([]);
    const [securitySymbol, setSecuritySymbol] = useState('');

    const [selectedSecurity, setSelectedSecurity] = useState({});

    const {id} = useParams();

    const [date, setDate] = useState((new Date()).toISOString().split('T')[0]);

    // toast
    const [show, setShow] = useState(false);
    const [toastMessage, setToastMessage] = useState('Registro realizado com sucesso');
    const [toastVariant, setToastVariant] = useState('success');


    const selectOptions = securitiesList.map(item => {return {value: item.id, label: item.symbol}});

    useEffect(() => {
        if (id) {
            getClosePrice(id)
            .then(res => {
                console.log(res)
                setClosePrice(res.data.value);
                setSelectedSecurityId(res.data.security_id);
                setSecuritySymbol(res.data.security.symbol);
                setDate(res.data.date);
            })
            .catch(err => console.log(err))

            return;
        }

        let url = `http://localhost:3000/funds`;

        url = `http://localhost:3000/securities`;
        axios.get(url)
        .then(res => {
            setSecuritiesList(res.data);
            console.log('securitiesList');
            console.log(res.data);
            setSelectedSecurityId(res.data[0].id)
        })


    }, []);

    function handleSelectSecurity(event) {
        setSelectedSecurity(event)
        setSelectedSecurityId(event.value);

        console.log('event.value');
        console.log(event.value);
        console.log('event');
        console.log(event);
        // setSelectedSecurityId(event.target.value);
        console.log(`Novo valor securityId: ${selectedSecurityId}`);
    }

    function handleClosePriceChange(event) {
        setClosePrice(event.target.value);
    }

    function onDateChange(event) {
        setDate(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log('opa, submit');

        if (id) {
            let url = `http://localhost:3000/close_prices/${id}`
            let body = {
                value: Number(closePrice),
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

        let body = {
            date,
            value: Number(closePrice),
            security_id: selectedSecurityId
        }
        console.log(body);

        let url = 'http://localhost:3000/close_prices/';

        axios.post(url, body)
        .then(res => {
            setToastMessage('Registro realizado com sucesso');
            setToastVariant('success')
            setShow(true);
            console.log(res);
        })
        .catch(err => {
            setToastMessage('Falha ao realizar a operação');
            setToastVariant('danger')
            setShow(true);
        })

    }

    return (
        <Container>
            {/* <h3></h3> */}
            <TitleWithBackButton 
                title={id ? 'Editar preço de fechamento' : 'Registrar preço de fechamento'} 
            />
            <br />

            <form onSubmit={handleSubmit}>
                <h5>Selecione o ativo</h5>
                { id ?
                    <Form.Select value={selectedSecurityId} disabled={true}>
                        {/* <option value={`${selectedSecurityId}`}>{selectedSecurityId}</option> */}
                        <option value={`${selectedSecurityId}`}>{securitySymbol}</option>
                    </Form.Select>
                    :
                    // fazer funcionar esse aqui depois;
                    <Select 
                        value={selectedSecurity} 
                        onChange={handleSelectSecurity} 
                        options={selectOptions}
                    />
                    // <select value={selectedSecurityId} onChange={handleSelectSecurity}>
                    //     {securitiesList.map(security => {
                    //         return <option value={`${security.id}`}>{security.symbol}</option>
                    //     })}
                    // </select>
                }
                <br />

                <h5>Valor de fechamento</h5>
                <Form.Control 
                    type="number" 
                    placeholder='0' 
                    value={closePrice}
                    onChange={handleClosePriceChange}
                />

                <br />

                <h5>Data</h5>
                <input value={date} onChange={onDateChange} type="date" disabled={id ? true : false}></input><br />
                <br></br>


                <Button type='submit'>Registrar valores</Button>  
            </form>

            {/* <p>ativo selecionado {selectedSecurityId}</p> */}
            <div className="position-relative position-relative-example">
            <Toast 
                bg={toastVariant} 
                className='position-absolute top-100 start-50 translate-middle' 
                onClose={() => setShow(false)} 
                show={show} 
                delay={3000} autohide
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

export default RegisterClosePrice;