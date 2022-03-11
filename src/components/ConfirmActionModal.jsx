import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ConfirmActionModal = ({show, title, body, handleClose, confirmFunction}) => {
    const navigate = useNavigate();

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Fechar
            </Button>
            <Button className='btn-danger' variant="primary" onClick={confirmFunction}>
                Remover
            </Button>
            </Modal.Footer>
        </Modal>
    );

}

export default ConfirmActionModal;