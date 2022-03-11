import React from "react"
import { Container, Nav, Navbar, NavDropdown, NavItem } from "react-bootstrap"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { getFormatedDate } from "../scripts/helper_scripts"
import {HomePage, Funds, FundPage, ClosePrices, RegisterFund, RegisterSecurity, RegisterCashTransaction, CashTransactions, SecuritiesList, SecurityTransactions, Report, RegisterSecurityTransaction, RegisterClosePrice} from "../view/"
import Blockchain from "../view/Blockchain"
import FadeTest from "../view/FadeTest"


const getRoutes = () => (
    <BrowserRouter>
        <Navbar bg='dark' variant='dark' expand='lg'>
            <Container>
                <Navbar.Brand href="/">InvestTech</Navbar.Brand>

                <Nav className="me-auto">
                <Nav.Link href="/funds">Listar Fundos</Nav.Link>

                <NavDropdown title="Transações" id="nav-dropdown">
                    <Nav.Link className='text-dark' href="/security_transactions/new">Cadastrar transação de Ativo</Nav.Link>
                    <Nav.Link className='text-dark' href="/cash_transactions/new">Cadastrar transação de Caixa</Nav.Link>
                    <Nav.Link className='text-dark' href="/security_transactions">Listar transações de Ativos</Nav.Link>
                    <Nav.Link className='text-dark' href="/cash_transactions/">Listar transações de Caixa</Nav.Link>
                </NavDropdown>

                <NavDropdown title="Ativos" id="nav-dropdown">
                    <Nav.Link className='text-dark' href="/securities/new">Cadastrar Ativos</Nav.Link>
                    <Nav.Link className='text-dark' href="/securities/">Listar Ativos</Nav.Link>
                    <Nav.Link className='text-dark' href="/close_prices/new">Cadastrar Preço de Fechamento</Nav.Link>
                    <Nav.Link className='text-dark' href={`/close_prices/${getFormatedDate(new Date())}`}>
                        Listar Preços de Fechamento
                    </Nav.Link>
                </NavDropdown>

                <Nav.Link href="/blockchain/">Blockchain</Nav.Link>
            </Nav>
            </Container>
        </Navbar>


        <Routes>
            <Route path="/" element={<HomePage></HomePage> } />

            <Route path="/funds/" element={<Funds/>} />
            <Route path="/funds/:id" element={<FundPage/>} />
            <Route path="/funds/:id/report/:date" element={<Report/>} />
            <Route path="/funds/:id/security_transactions/" element={<SecurityTransactions/>} />
            <Route path="/funds/:id/security_transactions/:date" element={<SecurityTransactions/>} />
            <Route path="/funds/:id/cash_transactions/:date" element={<CashTransactions/>} />
            
            <Route path="/funds/new" element={<RegisterFund/>} />
            <Route path="/funds/edit/:id" element={<RegisterFund/>} />

            <Route path="/cash_transactions/" element={<CashTransactions/>} />
            <Route path="/cash_transactions/new" element={<RegisterCashTransaction/>} />
            <Route path="/cash_transactions/:date" element={<CashTransactions/>} />
            <Route path="/cash_transactions/edit/:id" element={<RegisterCashTransaction/>} />
            
            <Route path="/close_prices/:date" element={<ClosePrices/>} />
            <Route path="/close_prices/new" element={<RegisterClosePrice/>} />
            <Route path="/close_prices/edit/:id" element={<RegisterClosePrice/>} />

            <Route path="/security_transactions/" element={<SecurityTransactions/>} />
            <Route path="/security_transactions/new" element={<RegisterSecurityTransaction/>} />
            <Route path="/security_transactions/edit/:id" element={<RegisterSecurityTransaction/>} />
            <Route path="/security_transactions/:date" element={<SecurityTransactions/>} />

            <Route path="/securities/" element={<SecuritiesList/>} />
            <Route path="/securities/new" element={<RegisterSecurity/>} />
            <Route path="/securities/edit/:id" element={<RegisterSecurity/>} />


            <Route path="/blockchain/" element={<Blockchain/>} />
            {/* <Route path="/blockchain/" element={<FadeTest/>} /> */}
        </Routes>
    </BrowserRouter>
)

export default getRoutes 