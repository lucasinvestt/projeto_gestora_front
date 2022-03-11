import React, { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteSecurityTransaction, getAllSecurityTransactions, getAllSecurityTransactionsFromDate, getSecurityTransactionsFromFund } from '../api/api';
import ConfirmActionModal from '../components/ConfirmActionModal';

import TitleWithBackButton from '../components/TitleWithBackButton';
import { getFormatedDate } from '../scripts/helper_scripts';

const SecurityTransactions = () => {
    const [securityTransactions, setSecurityTransactions] = useState([])
    // const [date, setDate] = useState((new Date()).toISOString().split('T')[0]) //useState(new Date())
    const [date, setDate] = useState(getFormatedDate(new Date())) //useState(new Date())
    const {id} = useParams();
    const filterDate = new Date(useParams().date);

    useEffect(() => {
        let formatedFilterDate;

        if (filterDate != 'Invalid Date') {
            formatedFilterDate = getFormatedDate(new Date(filterDate))
            setDate(formatedFilterDate)
        }

        if (id !== undefined) { //list from fund
            getSecurityTransactionsFromFund(id, formatedFilterDate)
            .then(res => setSecurityTransactions(res.data)) 
        } else if (filterDate != 'Invalid Date') {
            getAllSecurityTransactionsFromDate(formatedFilterDate)
            .then(res => setSecurityTransactions(res.data))
        } else {
            getAllSecurityTransactions().then(res => setSecurityTransactions(res.data))
        }

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

        deleteSecurityTransaction(itemId)
        .then(res =>  console.log(`sucesso ao remover item ${itemId}`))
        .catch(err => console.log(`falha ao remover item ${itemId}`));

        setShow(false);
    }
    // modal =-=============================

    return (
        <Container>
            <TitleWithBackButton title='Transações de Ativos'></TitleWithBackButton>
            
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
                                <Button className='me-2' onClick={() => goToEditSecurityTransactions(item.id)}>
                                    Editar
                                </Button><span></span>
                                <Button className='btn btn-danger' onClick={() => confirmationModal(item.id)}>
                                    Excluir
                                </Button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </Table>

            <ConfirmActionModal
                show={show}
                title='Remover transação de ativo'
                body='Tem certeza que deseja remover o item selecionado?'
                handleClose={handleClose}
                confirmFunction={() => deleteItem(deleteItemId)}
            />

            <br />
        </Container>
    );

}

export default SecurityTransactions;