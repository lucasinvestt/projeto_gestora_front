import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

import TitleWithBackButton from '../components/TitleWithBackButton';

import { getSecuritiesList } from '../api/api';

const SecuritiesList = () => {
    const [securities, setSecurities] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        getSecuritiesList().then(res => setSecurities(res.data));
    }, []);

    return (
        <Container>
            <TitleWithBackButton title='Ativos'></TitleWithBackButton>

            <Table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Símbolo</th>
                        <th className='w-auto'>Gerenciar</th>
                    </tr>
                </thead>
                <tbody>
                    {securities.map(item => {
                        return <tr>
                            <td>{item.name}</td>
                            <td>{item.symbol}</td>
                            <td>
                                <Button>Editar</Button>
                                <Button>Remover</Button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </Table>

            <br />
        </Container>
    );

}

export default SecuritiesList;