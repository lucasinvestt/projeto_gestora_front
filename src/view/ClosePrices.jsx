import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmActionModal from '../components/ConfirmActionModal';

import TitleWithBackButton from '../components/TitleWithBackButton';

const ClosePrices = () => {
    const [closePrices, setClosePrices] = useState([])
    const [date, setDate] = useState(new Date())
    const {id} = useParams();
    const filterDate = new Date(useParams().date);
    const navigate = useNavigate();

    useEffect(() => {
        let url = 'http://localhost:3000/close_prices/';
        
        // if (id !== undefined) {
        //     //edit close price
        //     url = `http://localhost:3000/close_prices/${id}`;
        //     axios.get(url)
        //     .then(res => {
        //         console.log('close prices');
        //         console.log(res);
        //         setClosePrices(res.data);
        //     })
        // }

        axios.get(url)
        .then(res => {
            console.log('close prices');
            console.log(res);
            setClosePrices(res.data);
        })

    }, []);

    function onDateChange(event) {
        setDate(event.target.value)
    }

    function filterByDate() {
        window.location.href = `http://localhost:7090/close_prices/${date}`;
    }


    function goToEditClosePrice(id) {
        // history.push(`http://localhost:7090/close_prices/edit/${id}`);
        window.location.href = `http://localhost:7090/close_prices/edit/${id}`
    }


    // modal =-===================================================
    const [show, setShow] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function confirmationModal(id) {
        setShow(true);
        setDeleteItemId(id);
    }

    function deleteItem(itemId) {
        let url = `http://localhost:3000/close_prices/${itemId}`

        axios.delete(url)
        .then(res => {
            console.log(`sucesso ao remover item ${itemId}`)
            //colocar toast depois

        })
        .catch(err => {
            console.log(`falha ao remover item ${itemId}`)
            // colocar toast depois
        })

        console.log(`Removing item ${itemId}...`);
        
        setShow(false);
    }
    // modal =-=================================================

    return (
        <Container>

            <TitleWithBackButton title='Valores de Fechamento'></TitleWithBackButton>

            <br />
            <div className="input-group">
                <input onChange={onDateChange} type="date"></input><br />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={filterByDate}>Confirmar</button>
                </div>
            </div>
            <br />

            <h3>Falta fazer filtro por data no backend</h3>
            <Table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Ativo</th>
                        <th>Valor de Fechamento</th>
                        <th>Data</th>
                        <th>Gerenciar</th>
                    </tr>
                </thead>
                <tbody>
                    {closePrices.map( (item, idx) => {
                        return <tr key={idx}>
                            {/* <td>{item.security_id}</td> */}
                            <td>{item.security.symbol}</td>
                            <td>R$ {item.value.toLocaleString('pt-br')}</td>
                            <td>{item.date.toLocaleString('pt-br')}</td>
                            <td>
                                <Button className='me-2' onClick={() => goToEditClosePrice(item.id)}>Editar</Button><span></span>
                                <Button onClick={() => confirmationModal(item.id)} className='btn btn-danger'>Excluir</Button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </Table>

            <ConfirmActionModal 
                show={show}
                title='Remover valor de fechamento'
                body='Tem certeza que deseja remover o valor de fechamento selecionado?'
                handleClose={handleClose}
                confirmFunction={() => deleteItem(deleteItemId)}
            />
            <br />
        </Container>
    );

}

export default ClosePrices;