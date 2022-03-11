import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Toast, Alert, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import TitleWithBackButton from '../components/TitleWithBackButton';
import Select from 'react-select'

const RegisterSecurityTransaction = () => {
    const [selectedFundId, setSelectedFundId] = useState(-1);
    const [selectedSecurityId, setSelectedSecurityId] = useState(-1);
    const [securityAmount, setSecurityAmount] = useState(0);
    const [unitValue, setUnitValue] = useState(0);

    const [selectedSecurity, setSelectedSecurity] = useState({})

    const [fundsList, setFundsList] = useState([]);
    const [securitiesList, setSecuritiesList] = useState([]);

    const [fundName, setFundName] = useState("");
    const [securitySymbol, setSecuritySymbol] = useState("");

    const {id} = useParams();

    const [date, setDate] = useState((new Date()).toISOString().split('T')[0]);

    // toast
    const [show, setShow] = useState(false);
    const [toastMessage, setToastMessage] = useState('Registro realizado com sucesso');
    const [toastVariant, setToastVariant] = useState('success');

    useEffect(() => {

        if (id !== undefined) {
            let url = `http://localhost:3000/security_transactions/${id}`;
            axios.get(url)
            .then(res => {
                setSelectedFundId(res.data.fund_id);
                setSelectedSecurityId(res.data.security_id);
                setUnitValue(res.data.unit_value);
                setSecurityAmount(res.data.amount);

                setFundName(res.data.fund.name);
                setSecuritySymbol(res.data.security.symbol);

                setDate(res.data.date)
                // console.log('opa');
                // console.log(res.data)
            })

            return;
        }

        let url = `http://localhost:3000/funds`;
        axios.get(url)
        .then(res => {
            setFundsList(res.data);
            console.log(res.data)
            setSelectedFundId(res.data[0].id);
        })


        url = `http://localhost:3000/securities`;
        axios.get(url)
        .then(res => {
            setSecuritiesList(res.data);
            console.log('securitiesList');
            console.log(res.data);
            setSelectedSecurityId(res.data[0].id);
        })


    }, []);

    function handleSelectFund(event) {
        setSelectedFundId(event.target.value);
        console.log(`Novo valor fundId: ${selectedFundId}`);
    }

    function handleSelectSecurity(event) {
        setSelectedSecurity(event);
        setSelectedSecurityId(event.value)
        // console.log(selectedSecurityId);
        // console.log(event);
        // setSelectedSecurityId(event.target.value);
        // console.log(`Novo valor securityId: ${selectedSecurityId}`);
    }

    function handleSecurityAmountChange(event) {
        setSecurityAmount(event.target.value);
    }

    function handleUnitValueChange(event) {
        setUnitValue(event.target.value);
    }

    function onDateChange(event) {
        // console.log(date);
        setDate(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log('opa, submit');

        // let date = (new Date()).toISOString().split('T')[0];
        let body = {
            date,
            amount: Number(securityAmount),
            unit_value: Number(unitValue),
            fund_id: selectedFundId,
            security_id: selectedSecurityId
        }
        console.log(body);

        let url = 'http://localhost:3000/security_transactions/';

        if (id !== undefined) {
            let body = {
                amount: Number(securityAmount),
                unit_value: Number(unitValue),
                date
            }

            let url = `http://localhost:3000/security_transactions/${id}`;
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
            })

            return;
        }

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


    const selectOptions = securitiesList.map(item => {return {value: item.id, label: item.symbol}});

    return (
        <Container>
            {/* <h3>Registrar transação de Ativo</h3> */}
            <TitleWithBackButton title={id !== undefined ? 'Editar transação de Ativo' : 'Registrar transação de Ativo'}></TitleWithBackButton>

            <form onSubmit={handleSubmit}>
                <h5>Selecione o Fundo</h5>

                {id !== undefined ?
                    // <select value={selectedFundId} disabled={true}>  
                    //     return <option value={`${selectedFundId}`}>{selectedFundId}</option>
                    // </select>
                    <Form.Select value={selectedFundId} disabled={true}>  
                        return <option value={`${selectedFundId}`}>{fundName}</option>
                    </Form.Select>

                    :
                    <Form.Select value={selectedFundId} onChange={handleSelectFund}>
                        {fundsList.map(fund => {
                            return <option value={`${fund.id}`}>{fund.name}</option>
                        })}
                    </Form.Select>
                }
                

                <h5>Selecione o Ativo</h5>

                {id ?
                    // <select value={selectedSecurityId} disabled={true}>  
                    //     return <option value={`${selectedSecurityId}`}>{selectedSecurityId}</option>
                    // </select>

                    <Form.Select value={selectedSecurityId} disabled={true}>
                        return <option value={`${selectedSecurityId}`}>{securitySymbol}</option>
                    </Form.Select>
                    :
                    // <select value={selectedSecurityId} onChange={handleSelectSecurity}>
                    //     {securitiesList.map(security => {
                    //         return <option value={`${security.id}`}>{security.symbol}</option>
                    //     })}
                    // </select>
                    <Select 
                        value={selectedSecurity} 
                        onChange={handleSelectSecurity} 
                        options={selectOptions}
                    />
                }

                {/* <Form.Select value={selectedSecurityId}  onChange={handleSelectSecurity} aria-label="Default select example">
                    {securitiesList.map(security => {
                        return <option value={`${security.id}`}>{security.name}</option>
                    })}
                </Form.Select> */}
                <br />

                <h5>Valor Unitário</h5>
                <Form.Control 
                    type="number" 
                    placeholder='0' 
                    value={unitValue}
                    onChange={handleUnitValueChange}
                />

                <h5>Quantidade</h5>
                <Form.Control 
                    type="number" 
                    placeholder='0' 
                    value={securityAmount}
                    onChange={handleSecurityAmountChange}
                />

                <br />

                
                <h5>Data</h5>
                <input value={date} onChange={onDateChange} type="date"></input><br />
                <br></br>

                <Button type='submit'>Registrar transação</Button>  
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
            {/* <Button onClick={() => setShow(true)}>Show Toast</Button> */}

        </Container>
    );
}

export default RegisterSecurityTransaction;