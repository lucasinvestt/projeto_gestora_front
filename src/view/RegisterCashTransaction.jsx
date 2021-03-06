import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Toast, Alert, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import TitleWithBackButton from '../components/TitleWithBackButton';

const RegisterCashTransaction = () => {
    const [selectedFundId, setSelectedFundId] = useState(-1);
    const [description, setDescription] = useState('');
    const [value, setValue] = useState(0);
    const [fundsList, setFundsList] = useState([]);
    const [fundName, setFundName] = useState('')

    const {id} = useParams();

    const [date, setDate] = useState((new Date()).toISOString().split('T')[0]);

    // toast
    const [show, setShow] = useState(false);
    const [toastMessage, setToastMessage] = useState('Registro realizado com sucesso');
    const [toastVariant, setToastVariant] = useState('success');

    useEffect(() => {
        if (id !== undefined) {
            let url = `http://localhost:3000/cash_transactions/${id}`;
            axios.get(url)
            .then(res => {
                setFundsList(res.data);
                console.log(res.data)
                setSelectedFundId(res.data.id);
                setDescription(res.data.description);
                setValue(res.data.value);
                setDate(res.data.date);
                setFundName(res.data.fund.name);
            })
            
            console.log('existe id')
            return;
        }

        let url = `http://localhost:3000/funds`;
        axios.get(url)
        .then(res => {
            setFundsList(res.data);
            console.log(res.data)
            setSelectedFundId(res.data[0].id);
        })


        // url = `http://localhost:3000/securities`;
        // axios.get(url)
        // .then(res => {
        //     setSecuritiesList(res.data);
        //     console.log('securitiesList');
        //     console.log(res.data);
        //     setSelectedSecurityId(res.data[0].id);
        // })


    }, []);

    function handleSelectFund(event) {
        setSelectedFundId(event.target.value);
        console.log(`Novo valor fundId: ${selectedFundId}`);
    }

    function handleDescricaoChange(event) {
        setDescription(event.target.value);
    }

    function handleValueChange(event) {
        setValue(event.target.value);
    }
 
    function onDateChange(event) {
        console.log(date);
        setDate(event.target.value)
    }


    function displayToast(variant, message) {
        setToastMessage(message);
        setToastVariant(variant)
        setShow(true);
    }

    function handleSubmit(event) {
        event.preventDefault();

        let body = {
            date,
            description,
            value: Number(value),
            fund_id: selectedFundId,
        }
        let url = 'http://localhost:3000/cash_transactions/';
        console.log(body);

        if (id !== undefined) { //edi????o
            let url = `http://localhost:3000/cash_transactions/${id}`;
            body = {
                description,
                value: Number(value),
                date
            }

            axios.patch(url, body)
            .then(res => {
                displayToast('success', 'Altera????o realizada com sucesso')
            })
            .catch(err => {
                displayToast('danger', 'Falha ao realizar a opera????o')
            })

            return;
        }


        axios.post(url, body)
        .then(res => {
            displayToast('success', 'Registro realizado com sucesso')
        })
        .catch(err => {
            displayToast('danger', 'Falha ao realizar a opera????o')
        })


    }

    return (
        <Container>
            {/* <h3>{id ? 'Editar' : 'Registrar'} transa????o de Caixa</h3> */}

            <TitleWithBackButton title={id ? 'Editar transa????o de Caixa' : 'Registrar transa????o de Caixa'} />

            <form onSubmit={handleSubmit} className='w-25'>
                <h5>Selecione o fundo</h5>

                { id !== undefined ?
                    <Form.Select value={fundName} disabled={true}>  
                        return <option value={`${fundName}`}>{fundName}</option>
                    </Form.Select>
                    :
                    <Form.Select value={selectedFundId} onChange={handleSelectFund}>
                        {fundsList.map(fund => {
                            return <option value={`${fund.id}`}>{fund.name}</option>
                        })}
                    </Form.Select>
                }

                <h5>Descri????o</h5>
                <Form.Control type="text" value={description} onChange={handleDescricaoChange}/>

                {/* <br /> */}

                <h5>Valor</h5>
                <Form.Control 
                    type="number" 
                    placeholder='0' 
                    value={value}
                    onChange={handleValueChange}
                />

                
                <br />
                {/* <Form.Group className="mb-3">
                    <Form.Label>Data</Form.Label>
                    <Form.Control type="date" />
                </Form.Group> */}

                <h5>Data</h5>
                <Form.Control value={date} onChange={onDateChange} type="date"/>
                <br />
                 

                <br />

                <Button type='submit'>Registrar opera????o</Button>  
            </form>

            
            {/* <Toast 
                bg={toastVariant} 
                className='fixed-top' 
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
            </Toast> */}

            <div className="position-relative position-relative-example">
                {/* <div className="position-absolute top-50 start-100 translate-middle">zz</div> */}
                {/* <div className="position-absolute top-100 start-50 translate-middle">zz</div> */}

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

export default RegisterCashTransaction;