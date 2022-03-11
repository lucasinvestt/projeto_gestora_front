import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import TitleWithBackButton from '../components/TitleWithBackButton';
import ConfirmActionModal from '../components/ConfirmActionModal';
import { deleteSecurity, getSecuritiesList } from '../api/api';

const SecuritiesList = () => {
    const [securities, setSecurities] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        getSecuritiesList().then(res => setSecurities(res.data))
    }, []);

    function goToEditSecurity(security_id) {
        // window.location.href = `http://localhost:7090/securities/edit/${security_id}`;
        navigate(`/securities/edit/${security_id}`);
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

        deleteSecurity(itemId)
        .then(res => console.log(`sucesso ao remover item ${itemId}`))
        .catch(err => console.log(`falha ao remover item ${itemId}`))
        
        setShow(false);
    }
    // modal =-=============================

    return (
        <Container>
            <TitleWithBackButton title='Ativos'></TitleWithBackButton>
            <br />

            <Table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Símbolo</th>
                        <th>Gerenciar</th>
                    </tr>
                </thead>
                <tbody>
                    {securities.map( (item, idx) => {
                        return <tr key={idx}>
                            <td>{item.symbol}</td>
                            <td>
                                <Button className='me-2' onClick={() => goToEditSecurity(item.id)}>
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

            <ConfirmActionModal
                show={show}
                title='Remover Ativo'
                body='Tem certeza que deseja remover o ativo selecionado?'
                handleClose={handleClose}
                confirmFunction={() => deleteItem(deleteItemId)}
            />

            <br />
        </Container>
    );

}

export default SecuritiesList;