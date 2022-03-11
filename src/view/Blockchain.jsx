import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Table } from 'react-bootstrap';
import TitleWithBackButton from '../components/TitleWithBackButton';

import { ethers } from "ethers";
import { getFormatedDate } from '../scripts/helper_scripts';
import { getPL } from '../api/api';


const Blockchain = () => {
    const [result, setResult] = useState(10);
    const [queryDate, setQueryDate] = useState( getFormatedDate(new Date()) );
    const [registerDate, setRegisterDate] = useState(getFormatedDate(new Date()))
    const [date, setDate] = useState(0);
    const [pl, setPl] = useState(0);

    let provider = new ethers.providers.Web3Provider(window.ethereum)
    let signer;

    const daiAddress = "0x47BD7F8D03f790df634ef95520356fFBD1D580C8";
    const daiAbi = [
        "function registerFund(string memory name, uint id) public",
        "function getFundName (uint id) public view returns (string memory _name)",
        "function addPlByDate(uint fundId, uint _date, uint _pl) external",
        "function getPl (uint fundId, uint _date) external view returns (uint _pl)"
    ];

    useEffect(async () => {
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner()

        getPL(1, getFormatedDate(new Date()))
        .then(res => setPl(res.data.pl))
    },[])

    function getBlockchainFormatedDate(date) {
        return date.replaceAll('-', '');
    }


    async function getSeila() {
        const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);

        // let valor = await daiContract.getPlByDate(11);
        // let valor = await daiContract.getPlByDate(20220310);

        let valor = await daiContract.getPlByDate(date);
        console.log("FEZ A CONSULTA");
        console.log(valor);

        //pegar valor
        //botar navariavel
        setResult(ethers.utils.formatUnits(valor, 0));
    }

    async function fazerTranzacao() {
        try {
            const contract = new ethers.Contract(daiAddress, daiAbi, provider);
            const daiWithSigner = contract.connect(signer);
            await daiWithSigner.addPlByDate(20220311, 666);
        } catch (err) {
            console.log('capiroto ta agindo');
        }
    }

    function onQueryDateChange(event) {
        setQueryDate(event.target.value);
    }

    return (
        <Container>
            <TitleWithBackButton title='Blockchain'></TitleWithBackButton>
            <h5>PL do dia: {pl}</h5>


            <input value={registerDate} onChange={(e) => setRegisterDate(e.target.value)} type="date"></input>
            <Button onClick={() => getSeila()}>
                Pegar Resultado
            </Button>
            <br />
            <br />

            <h4>Publicar</h4>
            <input value={pl} type="text" disabled={true}></input>            <br />            <br />
            <input value={queryDate} onChange={onQueryDateChange} type="date"></input>            <br />            <br />

            <Button onClick={() => fazerTranzacao()}>
                Enviar Transação
            </Button>
            <br />
            <span>Resultado: {result}</span>
        </Container>
    );
}

export default Blockchain;