import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const Report = () => {
    const [fundName, setFundName] = useState('');
    const [portfolio, setPortfolio] = useState([]);
    const [previousBalance, setPreviousBalance] = useState(0);
    const [cashTransactions, setCashTransactions] = useState([])
    const [yesterdayPL, setYesterdayPL] = useState(0);
    const [portfolioWithClosePrices, setPortfolioWithClosePrices] = useState([])
    const [date, setDate] = useState(new Date())
    const {id} = useParams();
    const reportDate = new Date(useParams().date);
    const navigate = useNavigate();


    function subtractDaysFromDate(date, days) {
        // let newDate = new Date ( (new Date()).setUTCHours(0,0,0,0) );
        let newDate = new Date ( (new Date(date)).setUTCHours(0,0,0,0) );
        newDate.setDate(date.getDate() - days);
        return newDate;
    }

    function getFormatedDate(date) {
        return date.toISOString().split('T')[0];
    }

    useEffect(() => {
        let baseUrl = 'http://localhost:3000/funds';
        let formatedReportDate = getFormatedDate(reportDate);
        console.log(`REPORT DATE: ${reportDate}`);
        
        //Fund info
        let url = `${baseUrl}/${id}`
        axios.get(url)
        .then(res => {
            console.log(`Fund name: ${res.data[0].name}`);
            setFundName(res.data[0].name); //verificar
        })
        console.log(`REPORT DATE: ${reportDate}`);

        //CASH transactions of the day
        url = `${baseUrl}/${id}/cash_transactions/${formatedReportDate}`
        axios.get(url)
        .then(res => {
            console.log('cash transactions of the day');
            console.log(res);
            setCashTransactions(res.data);
        })
        console.log(`REPORT DATE: ${reportDate}`);



        //tESTE SUPREMO - 49020
        // url = `http://localhost:3000/pl/${id}/'${formatedReportDate}'`
        // axios.get(url)
        // .then(res => {
        //     console.log('PL DO DIA');
        //     console.log(res.data);
        // })





        //pl from day before - PL D-1
        let dayBefore = subtractDaysFromDate(reportDate, 1);
        dayBefore = getFormatedDate(dayBefore)
        console.log(`Day before ${dayBefore}`);
        url = `http://localhost:3000/pl/${id}/'${dayBefore}'`
        axios.get(url)
        .then(res => {
            // console.log(`PL from day before: ${JSON.stringify(res.data[0].balance)}`);
            console.log('pl day before');
            console.log(res.data);
            // setYesterdayPL(res.data.fund_balance + res.data.all_securities_value);
            setYesterdayPL(res.data.pl);
        })
        console.log(`REPORT DATE: ${reportDate}`);


        //balance from day before
        // dayBefore = getFormatedDate(dayBefore);
        url = `http://localhost:3000/fund_balance/${id}/${dayBefore}`
        axios.get(url)
        .then(res => {
            // console.log(`cash balance from day before: ${JSON.stringify(res.data[0].balance)}`);
            console.log(`cash balance from day before:`);
            console.log(`day before: ${dayBefore}`);
            console.log(res);
            setPreviousBalance(res.data[0].balance);
            // setBalance(res.data[0].balance);
        })

        url = `http://localhost:3000/portfolios/${id}/${formatedReportDate}`;
        axios.get(url)
        .then(res => {
            // console.log(res);
            setPortfolio(res.data);
        })


        //portfolio with close prices
        // /funds/:id/portfolio_with_close_prices/:date
        url = `${baseUrl}/${id}/portfolio_with_close_prices/${getFormatedDate(reportDate)}`
        console.log(`REPORT DATE: ${reportDate}`);
        axios.get(url)
        .then(res => {
            // console.log(`Portfolio with close prices:`);
            // console.log(url);
            console.log(res.data);
            setPortfolioWithClosePrices(res.data)
        })

        // let d = getFormatedDate(reportDate)
        // getPortfolioWithClosePrices(d);

    }, []);


    // function getPortfolioWithClosePrices(date) {
    //     let url = `http://localhost:3000/funds/${id}/portfolio_with_close_prices/${getFormatedDate(reportDate)}`
    //     axios.get(url)
    //     .then(res => {
    //         // console.log(`Portfolio with close prices:`);
    //         // console.log(url);
    //         console.log(res.data);
    //         setPortfolioWithClosePrices(res.data)
    //     })
    // }

    function getCashTransactionsSum() {
        // console.log('me chamou')
        return cashTransactions.reduce( (acc, curr) => {
            return acc + curr.value;
        }, 0) + previousBalance;
    }

    function getPortfolioTotalValueSum() {
        // console.log('chamou portfolio sum');
        return portfolioWithClosePrices.reduce( (acc, curr) => {
            return acc + curr.close_price * curr.securitycount
        }, 0);
    }

    function getCurrentPL() {
        return getCashTransactionsSum() + getPortfolioTotalValueSum();
    }




    function onDateChange(event) {
        // console.log(event.target.value);
        setDate(event.target.value)
    }

    return (
        <>
            <Container>
            <h1>{fundName}</h1>
            <div className='d-flex flex-row'>
                <div className='flex-grow-1 flex-fill'>
                    <button className='btn btn-primary' onClick={() => navigate(-1)}>Voltar</button>
                </div>
                <div className="d-flex">
                    <h2 className="text-center">Relatório</h2>
                </div>
                <div className='flex-grow-1 flex-fill'></div>
            </div>

            <br />
            <div className="input-group">
                <input defaultValue={getFormatedDate(reportDate)} onChange={onDateChange} type="date"></input><br />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={() => window.location.href = `http://localhost:7090/funds/${id}/report/${date}`}>Confirmar</button>
                </div>
            </div>
            <br />

            <p><strong>PL em D-1: </strong>R$ {yesterdayPL.toLocaleString('pt-br')}</p>
            <p><strong>Saldo em D-1: </strong>R$ {previousBalance.toLocaleString('pt-br')}</p>

            <br></br>
            <h3>Ativos</h3>



            <Table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Ativo</th>
                        <th>Quantidade</th>
                        <th>Preço Unitario</th>
                        <th>Valor Total</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolioWithClosePrices.map(item => {
                        return <tr>
                            {/* <td>{item.name}</td> */}
                            <td>{item.symbol}</td>
                            <td>{item.securitycount.toLocaleString('pt-br')}</td>
                            <td>R$ {item.close_price.toLocaleString('pt-br')}</td>
                            <td>R$ {(item.securitycount * item.close_price).toLocaleString('pt-br')}</td>
                        </tr>
                    })}

                    <tr>
                        <td colSpan="3"><strong>Total</strong></td>
                        <td>R$ {getPortfolioTotalValueSum().toLocaleString('pt-br')}</td>
                    </tr>
                </tbody>
            </Table>

            <br />
            <h3>Transações</h3>
            <Table className='table table-striped'>
                <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Valor</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Saldo do dia anterior</td>
                        <td>R$ {previousBalance.toLocaleString('pt-br')}</td>
                    </tr>

                    {cashTransactions.map((item, idx) => 
                        <tr key={idx}>
                            <td>{item.description}</td>
                            <td>R$ {item.value.toLocaleString('pt-br')}</td>
                        </tr>
                    )}

                    <tr>
                        {/* <td colspan="3"><strong>Total</strong></td> */}
                        <td><strong>Total</strong></td>
                        <td>R$ {getCashTransactionsSum().toLocaleString('pt-br')}</td>
                    </tr>
                </tbody>
            </Table>


            <h3>Current PL: R$ {getCurrentPL().toLocaleString('pt-br')}</h3>
            <br />
            </Container>
        </>
    );

}

export default Report;