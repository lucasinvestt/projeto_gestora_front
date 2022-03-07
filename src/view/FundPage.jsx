import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"
import TitleWithBackButton from '../components/TitleWithBackButton';

import { getFormatedDate } from '../scripts/helper_scripts';

import { getCashTransactionsFromFund, getFundBalance, getFundInfo, getPL, getPortfolioWithClosePrices } from '../api/api';

const FundPage = () => {
    const [fundsInfo, setFundsInfo] = useState({});
    const [portfolio, setPortfolio] = useState([]);
    const [balance, setBalance] = useState(0);
    const [pl, setPl] = useState(0);
    const {id} = useParams();
    const navigate = useNavigate();
    const [date, setDate] = useState(getFormatedDate( new Date() ));

    const [cashTransactions, setCashTransactions] = useState([]);

    // function getFormatedDate(date) {
    //     console.log("date")
    //     console.warn(date);
    //     console.warn(date.toISOString().split('T')[0]);
    //     return date.toISOString().split('T')[0];
    // }

    useEffect(() => {
        // let baseUrl = 'http://localhost:3000/funds';
        // axios.get(baseUrl + `/${id}`)
        // .then(res => {
        //     console.log(res);
        //     setFundsInfo(res.data);
        // })

        getFundInfo(id).then(res => setFundsInfo(res.data));

        getPortfolio();
    }, []);


    function getPortfolio() {
        getPortfolioWithClosePrices(id, date).then(res => setPortfolio(res.data));
        getFundBalance(id, date).then(res => setBalance(res.data[0].balance));
        getPL(id, date).then(res => setPl(res.data.pl));
        getCashTransactionsFromFund(id, date).then(res => setCashTransactions(res.data));
    }


    // function getPortfolio() {
    //     console.log("INITIAL DATE")
    //     console.log(date);
    //     //tava o de cima
    //     //teste --------------------------------------------
    //     let url = `http://localhost:3000/funds/${id}/portfolio_with_close_prices/${date}`;
    //     axios.get(url)
    //     .then(res => {
    //         console.log(res);
    //         setPortfolio(res.data);
    //     })
    //     //teste --------------------------------------------

    //     url = `http://localhost:3000/fund_balance/${id}/${date}`
    //     axios.get(url)
    //     .then(res => {
    //         console.log('balance');
    //         console.log(res);
    //         setBalance(res.data[0].balance);
    //     })

    //     let plUrl = `http://localhost:3000/pl/${id}/${date}`
    //     axios.get(plUrl)
    //     .then(res => {
    //         console.log('PL');
    //         console.log(res);
    //         setPl(res.data.pl)
    //     })

    //     let cashTransactionUrl = `http://localhost:3000/funds/${id}/cash_transactions/${date}`
    //     axios.get(cashTransactionUrl)
    //     .then(res => {
    //         console.log('Cash Transactions');
    //         console.log(res);
    //         setCashTransactions(res.data)
    //     })
    // }

    function onDateChange(event) {
        setDate(event.target.value)
    }

    return (
        <Container>
            <TitleWithBackButton title={fundsInfo.name}></TitleWithBackButton>

            <div className='d-flex justify-content-center'>
                <div>
                    <Link to={`/funds/${id}/report/${getFormatedDate(new Date())}`}>Relatório</Link> <span> </span>
                    <Link to={`/funds/${id}/security_transactions/${getFormatedDate(new Date())}`}>Transações de Ativos</Link> <span> </span>
                    <Link to={`/funds/${id}/cash_transactions/${getFormatedDate(new Date())}`}>Transações de Caixa</Link> <span> </span>
                </div>

            </div>

            <br /><br />
 
            <h2 className="text-center">Portifolio</h2>
            
            <br />
            <div className="input-group">
                <input value={date} onChange={onDateChange} type="date"></input><br />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={getPortfolio}>Confirmar</button>
                </div>
            </div>
            <br />
            
            <p><strong>PL: </strong>R$ {pl.toLocaleString('pt-br')}</p>
            <p><strong>Saldo em caixa:</strong> R$ {balance.toLocaleString('pt-br')}</p>

            <br></br>
            <h3>Ativos</h3>

            <Table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Símbolo</th>
                    <th>Quantidade</th>
                    <th>Valor Unitário</th>
                    <th>Financeiro</th>
                </tr>
                </thead>

                <tbody>
                    {portfolio.map((item, idx) => 
                        <tr key={idx}>
                            <td>{item.name}</td>
                            <td>{item.symbol}</td>
                            <td>{item.securitycount}</td>
                            <td>R$ {item.close_price.toLocaleString('pt-br')}</td>
                            <td>R$ {(item.securitycount*item.close_price).toLocaleString('pt-br')}</td>
                        </tr>
                    )}
                </tbody>
            </Table>

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