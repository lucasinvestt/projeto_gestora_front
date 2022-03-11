import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import TitleWithBackButton from '../components/TitleWithBackButton';

import { ethers } from "ethers";
import { getFormatedDate } from '../scripts/helper_scripts';
import { getPL } from '../api/api';
import { Link } from 'react-router-dom';


const Blockchain = () => {
    const [result, setResult] = useState(10);
    const [queryDate, setQueryDate] = useState( getFormatedDate(new Date()) );
    // const [registerDate, setRegisterDate] = useState(getFormatedDate(new Date()))
    const [registerDate, setRegisterDate] = useState(0)
    const [date, setDate] = useState(0);
    const [pl, setPl] = useState(0);

    const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let daiWithSigner;
    let contract;
    let signer;

    const daiAddress = "0x177bE3112C754b84e0fF2d71DdaF2D1002B1648F";
    // const daiAddress = "0x177be3112c754b84e0ff2d71ddaf2d1002b1648f";
    const daiAbi = [
        "function registerFund(string memory name, uint id) public",
        "function getFundName (uint id) public view returns (string memory _name)",
        "function addPlByDate(uint fundId, uint _date, uint _pl) external",
        "function getPl (uint fundId, uint _date) external view returns (uint _pl)",
        "event FundCreated(string name, uint id)",
        "event PlAdded(uint fundId, uint date, uint pl)"
    ];

    useEffect(async () => {
        try {
            await connectMetamask();
        } catch (err) {
            console.log("ERROOO")
        }

        if (signer !== undefined) {
            setIsMetamaskConnected(true);
        }


        // signer = provider.getSigner()

        // getPL(1, getFormatedDate(new Date()))
        // .then(res => setPl(res.data.pl))
    },[])

    function getBlockchainFormatedDate(date) {
        return date.replaceAll('-', '');
    }

    async function connectMetamask() {
        try {
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner()
            contract = new ethers.Contract(daiAddress, daiAbi, provider);
            daiWithSigner = await contract.connect(signer);
        }
        catch (err) {
            console.log("providereeeeeee");
            console.log(provider)
            // alert(err);
        }
    }


    async function getPl(fundId, date) {
        const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);

        let valor = await daiContract.getPl(fundId, date);
        console.log("FEZ A CONSULTA");
        console.log(valor);

        //pegar valor - //botar navariavel
        setResult(ethers.utils.formatUnits(valor, 0));
    }

    async function fazerTranzacao() {
        try {
            const contract = new ethers.Contract(daiAddress, daiAbi, provider);
            const daiWithSigner = await contract.connect(signer);
            await daiWithSigner.addPlByDate(1, 20220311, 666);
        } catch (err) {
            console.log('deu errado')
        }
    }

    function onQueryDateChange(event) {
        setQueryDate(event.target.value);
    }

    async function createFund(fundName, fundId) {
        try {
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner()
            const contract = new ethers.Contract(daiAddress, daiAbi, provider);
            const daiWithSigner = await contract.connect(signer)

            let res = await daiWithSigner.registerFund(fundName, fundId);
            console.log('resultado de escrever na blockchain')
            console.log(res);
        } catch (err) {
            console.log('capiroto ta agindo');
            console.log(err);
        }
    }


    const [fundId, setFundId] = useState(0);
    const [fundName, setFundName] = useState('');
    const [newFundName, setNewFundName] = useState('');
    async function getFundName(fundId) {
        const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);

        let valor = await daiContract.getFundName(fundId);

        // console.log('valor')
        // console.log(valor)
        setFundName(valor);
    }   

    function onFundIdChange(event) {
        setFundId(event.target.value);
    }

    async function registerFundPl(fundId, date, pl) {
        try {
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner()
            const contract = new ethers.Contract(daiAddress, daiAbi, provider);
            const daiWithSigner = await contract.connect(signer)
            
            // function addPlByDate(uint fundId, uint _date, uint _pl) external",

            await daiWithSigner.addPlByDate(fundId, date, pl);
        } catch (err) {
            console.log('capiroto ta agindo');
            console.log(err);
        }
    }

    return (
        <Container>
            <TitleWithBackButton title='Blockchain'></TitleWithBackButton>


            <Button onClick={()=> window.open("https://rinkeby.etherscan.io/address/0x177be3112c754b84e0ff2d71ddaf2d1002b1648f", "_blank")}>
                Ver contrato no Etherscan
            </Button>

            {
                isMetamaskConnected === false ?
                <>
                    <span className="text-secondary me-4">
                        Carteira Metamask não conectada.
                    </span>
                    <Button onClick={connectMetamask}>
                        Conectar
                    </Button>
                </>
                :
                <p>Metamask Conectado!</p>
            }
            <br></br><br />

            {/* <h5>PL do dia: {pl}</h5> */}

            {/* <br /> */}

            {/* <Row className='justify-content-start'>
                <Col className='col-5'>
                    <h4>Consultar</h4>
                    <Form.Control value={registerDate} onChange={(e) => setRegisterDate(e.target.value)} type="date"></Form.Control>
                    <br />
                    <Button onClick={() => getSeila()}>
                        Pegar Resultado
                    </Button>
                </Col>
                <Col className='col-auto'>
                    <h4>Publicar</h4>
                    <Form.Control value={pl} type="text" disabled={true}></Form.Control> 
                    <br />
                    <Form.Control value={queryDate} onChange={onQueryDateChange} type="date"></Form.Control>
                    <br />

                    <Button onClick={() => fazerTranzacao()}>
                        Enviar Transação
                    </Button>
                </Col>
            </Row> */}

            <Row>
                <Col>
                    {/* <Button onClick={createFund}>Create Fund</Button> */}
                    <h5>Nome do fundo</h5>
                    <Form.Control type='text' value={newFundName} onChange={e => setNewFundName(e.target.value)} />
                    <br></br>
                    <h5>Id do fundo</h5>
                    <Form.Control type='number' value={fundId} onChange={onFundIdChange} />
                    <Button onClick={() => createFund(newFundName, fundId)}>Cadastrar Fundo</Button>
                </Col>
                <Col>
                    <h5>Id do fundo</h5>
                    <Form.Control type='number' value={fundId} onChange={onFundIdChange} />
                    <br />
                    <Button onClick={() => getFundName(fundId)}>Get Fund Name</Button>

                    <p>Fund Name lido da blockchain: {fundName}</p>
                </Col>
            </Row>

            <br /><br />
            <p>pl</p>
            <Row>
                <Col>
                    {/* <Button onClick={createFund}>Create Fund</Button> */}
                    <h5>Id do fundo</h5>
                    <Form.Control type='number' value={fundId} onChange={onFundIdChange} />
                    
                    <h5>Data do Pl</h5>
                    <Form.Control type='number' value={registerDate} onChange={(e) => setRegisterDate(e.target.value)} />

                    <h5>PL do fundo</h5>
                    <Form.Control type='number' value={pl} onChange={e => setPl(e.target.value)} />
                    <br></br>
                    <Button onClick={() => registerFundPl(fundId, registerDate, pl)}>Cadastrar PL do Fundo</Button>
                </Col>
                
                <Col>
                    <h5>Id do fundo</h5>
                    <Form.Control type='number' value={fundId} onChange={onFundIdChange} />
                    <br />
                    <h5>Data do Pl</h5>
                    <Form.Control type='number' value={date} onChange={(e) => setDate(e.target.value)} />

                    <Button onClick={() => getPl(fundId, date)}>Get Fund pl</Button>

                    {/* <p>Fund Name lido da blockchain: {fundName}</p> */}
                </Col>
            </Row>

            <br />

            <h5>PL lido da blockchain: {result}</h5>
            <br /><br /><br />
        </Container>
    );
}

export default Blockchain;