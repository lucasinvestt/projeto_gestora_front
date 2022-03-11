// import React from 'react';
// import { Container, Nav, NavbarBrand, NavDropdown } from 'react-bootstrap';
// import { getFormatedDate } from '../scripts/helper_scripts';

// const Navbar = () => {
//     return (
//         <Container>
//             <Navbar bg='dark' variant='dark' expand='lg'>
//                 <Container>
//                     <Navbar.Brand href="/">InvestTech</Navbar.Brand>

//                     <Nav className="me-auto">
//                     <Nav.Link href="/funds">Listar Fundos</Nav.Link>
//                     <Nav.Link href="/funds/1">Portifolio</Nav.Link>

//                     <NavDropdown title="Transações" id="nav-dropdown">
//                         <Nav.Link className='text-dark' href="/security_transactions/new">Cadastrar transação de Ativo</Nav.Link>
//                         <Nav.Link className='text-dark' href="/cash_transactions/new">Cadastrar transação de Caixa</Nav.Link>
//                         <Nav.Link className='text-dark' href="/security_transactions">Listar transações de Ativos</Nav.Link>
//                         <Nav.Link className='text-dark' href="/cash_transactions/">Listar transações de Caixa</Nav.Link>
//                     </NavDropdown>

//                     <NavDropdown title="Ativos" id="nav-dropdown">
//                         <Nav.Link className='text-dark' href="/securities/new">Cadastrar Ativos</Nav.Link>
//                         <Nav.Link className='text-dark' href="/securities/">Listar Ativos</Nav.Link>
//                         <Nav.Link className='text-dark' href="/close_prices/new">Cadastrar Preço de Fechamento</Nav.Link>
//                         <Nav.Link className='text-dark' href={`/close_prices/${getFormatedDate(new Date())}`}>
//                             Listar Preços de Fechamento
//                         </Nav.Link>
//                     </NavDropdown>

//                     <Nav.Link href="/blockchain/">Blockchain</Nav.Link></Nav>
//                 </Container>
//             </Navbar>
//         </Container>
//     );
// }

// export default Navbar;