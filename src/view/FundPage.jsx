import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Fade, Form, Row, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import TitleWithBackButton from '../components/TitleWithBackButton';
import { ethers } from "ethers";

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

    useEffect(() => {
        getFundInfo(id).then(res => setFundsInfo(res.data));
        getPortfolio();
    }, []);

    function getPortfolio() {
        getPortfolioWithClosePrices(id, date).then(res => setPortfolio(res.data));
        getFundBalance(id, date).then(res => setBalance(res.data[0].balance));
        getPL(id, date).then(res => setPl(res.data.pl));
        getCashTransactionsFromFund(id, date).then(res => setCashTransactions(res.data));
    }

    function onDateChange(event) {
        setDate(event.target.value)
    }

    //// Blockchain 
    const daiAddress = "0x177bE3112C754b84e0fF2d71DdaF2D1002B1648F";
    const daiAbi = [
        "function registerFund(string memory name, uint id) public",
        "function getFundName (uint id) public view returns (string memory _name)",
        "function addPlByDate(uint fundId, uint _date, uint _pl) external",
        "function getPl (uint fundId, uint _date) external view returns (uint _pl)",
        "event FundCreated(string name, uint id)",
        "event PlAdded(uint fundId, uint date, uint pl)"
    ];

    async function registerFundPl(fundId, date, pl) {
        try {
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            let signer = provider.getSigner()
            const contract = new ethers.Contract(daiAddress, daiAbi, provider);
            const daiWithSigner = await contract.connect(signer)
            
            await daiWithSigner.addPlByDate(fundId, date, parseInt(pl*100));
            alert("Dados salvos na Blockchain com sucesso!")
        } catch (err) {
            alert("Falha ao inserir os dados na Blockchain. Tente novamente")
            console.log(err);
        }
    }
    
    function getBlockchainFormatedDate(date) {
        return date.replaceAll('-', '');
    }
    /// Blockchain ------
    
    return (
        <Container>
            <TitleWithBackButton title={'Portfolio'}></TitleWithBackButton>
            
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
                </Col>
                <Col className='col-auto'>
                    <Button onClick={() => navigate(`/funds/${id}/cash_transactions/${getFormatedDate(new Date())}`)}>
                        Transações de Caixa
                    </Button>
                </Col>
                <Col className='col-auto'>
                    <Button variant="warning" onClick={() => registerFundPl(id, getBlockchainFormatedDate(date), pl)}>
                        Publicar na Blockchain
                    </Button>
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

            <Table>
                <thead>
                <tr>
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
                    {
                        cashTransactions.length === 0 ?
                        <>
                            <br />
                            <p className="text-secondary">
                                Nenhuma transação de caixa registrada no dia selecionado
                            </p>
                        </>
                        :
                        <>{cashTransactions.map((item, idx) => 
                            <tr key={idx}>
                                <td>{item.description}</td>
                                <td>R$ {item.value.toLocaleString('pt-br')}</td>
                            </tr>
                        )}</>
                    }             
                </tbody>
            </Table>

            <br />
            <br />
        </Container>

    );
}

export default FundPage;