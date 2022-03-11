import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

import TitleWithBackButton from '../components/TitleWithBackButton';
import ConfirmActionModal from '../components/ConfirmActionModal';
import { getFormatedDate } from '../scripts/helper_scripts';
import { deleteCashTransaction } from '../api/api';


const CashTransactions = () => {
    const [cashTransactions, setCashTransactions] = useState([])
    // const [date, setDate] = useState((new Date()).toISOString().split('T')[0]); //useState(new Date())
    const [date, setDate] = useState(getFormatedDate(new Date())); //useState(new Date())
    const {id} = useParams();
    const filterDate = (new Date(useParams().date));
    const navigate = useNavigate();

    useEffect(() => {
        if (filterDate != 'Invalid Date') {
            setDate(getFormatedDate(new Date(filterDate)))
        }

        let url = 'http://localhost:3000/cash_transactions/';

        // console.log(`ID: ${id}`);
        // console.log(`filterDate: ${filterDate}`);

        if (id !== undefined) {
            url = `http://localhost:3000/funds/${id}/cash_transactions/${filterDate}`; //conferir 
        } else if (filterDate != 'Invalid Date') {
            url = `http://localhost:3000/cash_transactions/all/${getFormatedDate(filterDate)}`;
        }
        
        axios.get(url)
        .then(res => {
            console.log('cash transactions');
            console.log(res);
            // setCashTransactions(res.data);

            let data = res.data.sort((a,b) => {
                if (a.date > b.date) return -1;
                if (a.date < b.date) return 1;
                return 0;
            });
            setCashTransactions(data);
        })

    }, []);

    function onDateChange(event) {
        setDate(event.target.value)
    }

    function filterByDate() {
        if (id !== undefined) {
            window.location.href = `http://localhost:7090/funds/${id}/cash_transactions/${date}`;
        } else {
            window.location.href = `http://localhost:7090/cash_transactions/${date}`;
        }
    }

    function goToEditCashTransactions(transaction_id) {
        window.location.href = `http://localhost:7090/cash_transactions/edit/${transaction_id}`;
    }


    // modal =-=============================
    const [show, setShow] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function confirmationModal(id) {
        setShow(true);
        setDeleteItemId(id);
    }

    function deleteItem(itemId) {
        console.log(`Removing item ${itemId}...`);

        deleteCashTransaction(itemId)
        .then(res => console.log(`sucesso ao remover item ${itemId}`))
        .catch(err => console.log(`falha ao remover item ${itemId}`))
        
        setShow(false);
    }
    // modal =-=============================

    return (
        <Container>
            <TitleWithBackButton title='Transações de Caixa'></TitleWithBackButton>

            <div className="input-group">
                <input value={date} onChange={onDateChange} type="date"></input><br />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={filterByDate}>Confirmar</button>
                </div>
            </div>
            <br />

            <Table className='table table-striped'>
                <thead>
                    <tr>
                        {id ? <></> : <th>Fundo</th>}
                        <th>Descrição</th>
                        <th>Valor Total</th>
                        { id ? <></> : <th>Data</th>}
                        <th>Gerenciar</th>
                    </tr>
                </thead>
                <tbody>
                    {cashTransactions.map( (item, idx) => {
                        return <tr key={idx}>
                            {id ? <></> : <td>{item.fund.name}</td>}
                            <td>{item.description}</td>
                            <td>R$ {item.value.toLocaleString('pt-br')}</td>
                            { id ? <></> : <td>{item.date.toLocaleString('pt-br')}</td>}
                            <td>
                                <Button className='me-2' onClick={() => goToEditCashTransactions(item.id)}>
                                    Editar
                                </Button><span></span>
                                <Button onClick={() => confirmationModal(item.id)}  className='btn btn-danger'>
                                    Excluir
                                </Button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </Table>


            {/* modal */}
            <ConfirmActionModal
                show={show}
                title='Remover transação de Caixa'
                body='Tem certeza que deseja remover o item selecionado?'
                handleClose={handleClose}
                confirmFunction={() => deleteItem(deleteItemId)}
            />

            <br />
        </Container>
    );

}

export default CashTransactions;