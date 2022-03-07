import axios from "axios";

export const investTechApi = axios.create({
    baseURL: 'http://localhost:3000/'
});

//securities
export async function getSecuritiesList() {
    return investTechApi.get('/securities');
}

export async function getSecurityTransaction(transactionId) {
    return investTechApi.get(`/security_transactions/${transactionId}`)
}

export async function getSecurityTransactionsFromFund(fundId, date) {
    return investTechApi.get(`/funds/${fundId}/securities_transactions/${date}`);
}

export async function updateSecurityTransaction(transactionId, updates) {
    return investTechApi.patch(`/security_transactions/${transactionId}`, updates)
}

//cash transactions
export async function getCashTransactionsList() {
    return investTechApi.get(`/cash_transactions/`);
}

export async function getCashTransaction(transactionId) {
    return investTechApi.get(`/cash_transactions/${transactionId}`);
}

export async function getCashTransactionsFromFund(fundId, date) {
    return investTechApi.get(`/funds/${fundId}/cash_transactions/${date}`);
}

export async function updateCashTransaction(transactionId, updates) {
    return investTechApi.patch(`/cash_transactions/${transactionId}`, updates);
}

export async function deleteCashTransaction(transactionId) {
    return investTechApi.delete(`/cash_transactions/${transactionId}`);
}

//pl
export async function getPL(fundId, date) {
    return investTechApi.get(`/pl/${fundId}/${date}`);
}


export async function getFundsList() {
    return investTechApi.get('/funds');
}

export async function getPortfolioWithClosePrices(fundId, formatedDate) {
    return investTechApi.get(`/funds/${fundId}/portfolio_with_close_prices/${formatedDate}`);
} 



export async function getFundBalance(fundId, date) {
    return investTechApi.get(`/fund_balance/${fundId}/${date}`);
}


export async function getFundInfo(id) {
    return investTechApi.get(`/funds/${id}`);
}