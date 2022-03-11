import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { deleteFund } from '../api/api';
import ConfirmActionModal from '../components/ConfirmActionModal';

import TitleWithBackButton from '../components/TitleWithBackButton';

const Funds = () => {
    const [fundsInfo, setFundsInfo] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        let baseUrl = 'http://localhost:3000';
        axios.get(baseUrl+'/funds')
        .then(res => {
            console.log(res);
            setFundsInfo(res.data);
        })
    }, []);

    
    function routeChange() {
        let path = 'new'
        navigate(path);
    }

    function goToEditFund(id) {
        navigate(`edit/${id}`)
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
        let url = `http://localhost:3000/funds/${itemId}`

        deleteFund(itemId)
        .then(res => {console.log(`sucesso ao remover item ${itemId}`)})
        .catch(err => { console.log(`falha ao remover item ${itemId}`)})

        // axios.delete(url)
        // .then(res => {
        //     console.log(`sucesso ao remover item ${itemId}`)
        //     //colocar toast depois

        // })
        // .catch(err => {
        //     console.log(`falha ao remover item ${itemId}`)
        //     // colocar toast depois
        // })

        console.log(`Removing item ${itemId}...`);
        
        setShow(false);
    }
    // modal =-=============================

    return (
        <Container>
            <TitleWithBackButton title='Lista de Fundos'></TitleWithBackButton>

            <br />
            <Button onClick={routeChange}>Cadastrar Novo Fundo</Button>
            <br /><br />

            <Table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Nome do fundo</th>
                        <th>Data de criação</th>
                        <th>Gerenciar</th>
                    </tr>
                </thead>
                <tbody>
                    {fundsInfo.map( (fund, idx) => {
                        return <tr key={idx}>
                            <td><Link to={`/funds/${fund.id}`}>{fund.name}</Link><br /></td>
                            <td>{(new Date(fund.date)).toLocaleDateString('pt-br', {timeZone: 'UTC'})}</td>
                            <td>
                                <Button 
                                    className='me-2' 
                                    onClick={() => goToEditFund(fund.id)}>
                                        Editar
                                </Button>
                                <Button 
                                    onClick={() => confirmationModal(fund.id)} 
                                    className='btn btn-danger'>
                                        Excluir
                                </Button>
                            </td>
                        </tr>
                    })}
                    

                </tbody>
            </Table>

            <ConfirmActionModal 
                show={show}
                title='Remover fundo'
                body='Tem certeza que deseja remover o fundo selecionado?'
                handleClose={handleClose}
                confirmFunction={() => deleteItem(deleteItemId)}
            />
        </Container>
    );
}

export default Funds;