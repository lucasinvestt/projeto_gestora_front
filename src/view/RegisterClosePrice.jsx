import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Button, Toast } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import TitleWithBackButton from '../components/TitleWithBackButton';

const RegisterClosePrice = () => {
    const [selectedSecurityId, setSelectedSecurityId] = useState(-1);
    const [closePrice, setClosePrice] = useState(0);
    const [securitiesList, setSecuritiesList] = useState([]);

    const {id} = useParams();

    const [date, setDate] = useState((new Date()).toISOString().split('T')[0]);

    // toast
    const [show, setShow] = useState(false);
    const [toastMessage, setToastMessage] = useState('Registro realizado com sucesso');
    const [toastVariant, setToastVariant] = useState('success');


    useEffect(() => {
        if (id) {
            let url = `http://localhost:3000/close_prices/${id}`

            axios.get(url)
            .then(res => {
                setClosePrice(res.data.value);
                setSelectedSecurityId(res.data.security_id);
                console.log(res);
            })
            .catch(err => {
                console.log('err');
                console.log(err);
            })

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
        setSelectedSecurityId(event.target.value);
        console.log(`Novo valor securityId: ${selectedSecurityId}`);
    }

    function handleClosePriceChange(event) {
        setClosePrice(event.target.value);
    }

    function onDateChange(event) {
        // console.log(date);
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

        // let date = (new Date()).toISOString().split('T')[0];
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
            <h3></h3>
            <TitleWithBackButton title='Registrar preço de fechamento' />
            <br />

            <form onSubmit={handleSubmit}>
                <h5>Selecione o ativo</h5>
                { id ?
                    <select value={selectedSecurityId} disabled={true}>
                        <option value={`${selectedSecurityId}`}>{selectedSecurityId}</option>
                    </select>
                    :
                    <select value={selectedSecurityId} onChange={handleSelectSecurity}>
                        {securitiesList.map(security => {
                            return <option value={`${security.id}`}>{security.name}</option>
                        })}
                    </select>
                }
                <br />

                <h5>Valor de fechamento</h5>
                <input 
                    type="number" 
                    placeholder='0' 
                    value={closePrice}
                    onChange={handleClosePriceChange}
                />

                <br />

                <h5>Data</h5>
                <input value={date} onChange={onDateChange} type="date"></input><br />
                <br></br>


                <Button type='submit'>Registrar valores</Button>  
            </form>

            <p>ativo selecionado {selectedSecurityId}</p>

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

export default RegisterClosePrice;