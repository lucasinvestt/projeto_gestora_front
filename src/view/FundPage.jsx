import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Fade, Row, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from "react-router-dom"
import TitleWithBackButton from '../components/TitleWithBackButton';

import { getFormatedDate } from '../scripts/helper_scripts';

import { getCashTransactionsFromFund, getFundBalance, getFundInfo, getPL, getPortfolioWithClosePrices } from '../api/api';

const FundPage = () => {
    const [fundsInfo, setFundsInfo] = useState({});
    const [portfolio, setPortfolio] = useState([]);
    const [balance, setBalance] = useState(0);
    const [pl, setPl] = useState(0);
    const [date, setDate] = useState(getFormatedDate( new Date() ));
    const [cashTransactions, setCashTransactions] = useState([]);
    const {id} = useParams();

    let navigate = useNavigate();

    const [fade, setFade] = useState(false);

    useEffect(() => {
        getFundInfo(id).then(res => setFundsInfo(res.data));
        getPortfolio();
    }, []);

    function getPortfolio() {
        getPortfolioWithClosePrices(id, date).then(res => setPortfolio(res.data));
        getFundBalance(id, date).then(res => setBalance(res.data[0].balance));
        getPL(id, date).then(res => setPl(res.data.pl));
        getCashTransactionsFromFund(id, date).then(res => setCashTransactions(res.data));
        
        // setFade(false);
        // setFade(!fade).then(_ => setFade(!fade));
        // setFade(!fade);
        setFade(!fade);
        setFade(!fade);
        // setFade(false);
    }

    useEffect(() => {
        console.log(`entrou no useEffect. Fade = ${fade}`);
        if (fade == true) return;
        setFade(!fade);
    }, [fade])



    function onDateChange(event) {
        setDate(event.target.value)
    }

    return (
        <Container>
            {/* <TitleWithBackButton title={fundsInfo.name}></TitleWithBackButton> */}
            <TitleWithBackButton title={'Portfolio'}></TitleWithBackButton>

            {/* <div className='d-flex justify-content-center'>
                <div>
                    <Link to={`/funds/${id}/report/${getFormatedDate(new Date())}`}>Relatório</Link> <span> </span>
                    <Link to={`/funds/${id}/security_transactions/${getFormatedDate(new Date())}`}>Transações de Ativos</Link> <span> </span>
                    <Link to={`/funds/${id}/cash_transactions/${getFormatedDate(new Date())}`}>Transações de Caixa</Link> <span> </span>
                </div>
            </div> */}

            {/* <br /> */}
 
            {/* <h2 className="text-center">Portifolio</h2> */}
            
            <br />
            <Row>
                <Col className='col-auto'>
                    <div className="input-group">
                        <input value={date} onChange={onDateChange} type="date"></input><br />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button" onClick={getPortfolio}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </Col>
                <Col className='col-auto'>
                    <Button onClick={() => navigate(`/funds/${id}/security_transactions/${getFormatedDate(new Date())}`)}>
                        Transações de Ativos
                    </Button>
                    {/* <Link to={`/funds/${id}/security_transactions/${getFormatedDate(new Date())}`}>Transações de Ativos</Link> */}
                </Col>
                <Col className='col-auto'>
                    <Button onClick={() => navigate(`/funds/${id}/cash_transactions/${getFormatedDate(new Date())}`)}>
                        Transações de Caixa
                    </Button>
                    {/* <Link to={`/funds/${id}/cash_transactions/${getFormatedDate(new Date())}`}>Transações de Caixa</Link> */}
                </Col>
            </Row>

            <br />
            
            <Row className='justify-content-start'>
                <Col className='col-auto'><p><strong>{fundsInfo.name}</strong></p></Col>
                <Col className='col-auto'><p><strong>PL: </strong>R$ {pl.toLocaleString('pt-br')}</p></Col>
                <Col className='col-auto'><p><strong>Saldo em caixa:</strong> R$ {balance.toLocaleString('pt-br')}</p></Col>
            </Row>

            <br></br>
            <h3>Ativos</h3>

            <Fade in={fade} appear={true}>
            <Table>
                <thead>
                <tr>
                    {/* <th>Nome</th> */}
                    <th>Símbolo</th>
                    <th>Quantidade</th>
                    <th>Valor Unitário</th>
                    <th>Financeiro</th>
                </tr>
                </thead>

                <tbody>
                    {portfolio.map((item, idx) => 
                        <tr key={idx}>
                            <td>{item.security.symbol}</td>
                            <td>{item.amount}</td>
                            <td>R$ {item.value.toLocaleString('pt-br')}</td>
                            <td>R$ {(item.amount*item.value).toLocaleString('pt-br')}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            </Fade>

            <br />
            <h3>Transações de Caixa</h3>
            <Table className='table table-striped'>
                <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Valor</th>
                </tr>
                </thead>
                <tbody>
                    {cashTransactions.map((item, idx) => 
                        <tr key={idx}>
                            <td>{item.description}</td>
                            <td>R$ {item.value.toLocaleString('pt-br')}</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <br />
            <br />
        </Container>

    );
}

export default FundPage;