import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

import TitleWithBackButton from '../components/TitleWithBackButton';

const SecurityTransactions = () => {
    const [securityTransactions, setSecurityTransactions] = useState([])
    const [date, setDate] = useState((new Date()).toISOString().split('T')[0]) //useState(new Date())
    const {id} = useParams();
    const filterDate = new Date(useParams().date);
    const navigate = useNavigate();

    useEffect(() => {
        if (filterDate != 'Invalid Date') {
            setDate((new Date(filterDate)).toISOString().split('T')[0]);
        }

        let url; // = 'http://localhost:3000/security_transactions/';

        if (id !== undefined) {
            //trocar url e pegar só do id
            url = `http://localhost:3000/funds/${id}/securities_transactions/${filterDate.toISOString().split('T')[0]}`; //conferir 
        } else if (filterDate != 'Invalid Date') {
            // console.log('opaaaaaaaaa, date não é inválido');
            // console.log(filterDate);
            url = `http://localhost:3000/security_transactions/${filterDate.toISOString().split('T')[0]}`;
            //FALTA FAZER A ROTA NO RUBY
        } else {
            url = 'http://localhost:3000/security_transactions/';
        }
        
        axios.get(url)
        .then(res => {
            console.log('security transactions');
            console.log(res);
            setSecurityTransactions(res.data);
        })

    }, []);

    function onDateChange(event) {
        setDate(event.target.value)
    }

    function filterByDate() {
        if (id !== undefined) {
            window.location.href = `http://localhost:7090/funds/${id}/security_transactions/${date}`;
        } else {
            window.location.href = `http://localhost:7090/security_transactions/${date}`;
        }
    }

    function goToEditSecurityTransactions(transaction_id) {
        window.location.href = `http://localhost:7090/security_transactions/edit/${transaction_id}`;
    }
    

    return (
        <Container>
            <TitleWithBackButton title='Transações de Ativos'></TitleWithBackButton>

            <br />
            <div className="input-group">
                <input value={date} onChange={onDateChange} type="date"></input><br />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={filterByDate}>Confirmar</button>
                </div>
            </div>
            <br />

            <br></br>

            <Table className='table table-striped'>
                <thead>
                    <tr>
                        { id ? <></> : <th>Fundo</th> }
                        <th>Ativo</th>
                        <th>Quantidade</th>
                        <th>Preço Unitario</th>
                        <th>Valor Total</th>
                        <th>Data</th>
                        <th>Gerenciar</th>
                    </tr>
                </thead>
                <tbody>
                    {securityTransactions.map( (item, idx) => {
                        return <tr key={idx}>
                            { id ? <></> : <td>{item.fund.name}</td> }
                            <td>{item.security.symbol}</td>

                            <td>{item.amount.toLocaleString('pt-br')}</td>
                            <td>R$ {item.unit_value.toLocaleString('pt-br')}</td>
                            <td>R$ {(item.amount*item.unit_value).toLocaleString('pt-br')}</td>
                            <td>{item.date.toLocaleString('pt-br')}</td>
                            <td>
                                <Button className='me-2' onClick={() => goToEditSecurityTransactions(item.id)}>Editar</Button><span></span>
                                <Button className='btn btn-danger'>Excluir</Button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </Table>

            <br />
        </Container>
    );

}

export default SecurityTransactions;