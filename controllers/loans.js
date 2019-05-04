const _ = require('underscore');
const loans = require('../utils/sample.loans');
const repayments = require('../utils/sample.repayments');

const get_all_loans = (req, res) => {
    const { status, repaid } = req.query;
    const boolean_repaid = (req.query.repaid === 'true');

    // if both status and repaid is unspecified
    if ((status !== undefined) && (repaid !== undefined)) {
        const data = _.filter(loans, loan => (
            loan.status === status && loan.repaid === boolean_repaid
        ));
        res.send({ status: 200, data });
    }
    else {
        const data = [];
        _.map(loans, loan => {
            data.push(loan);
        });
        res.send({ status: 200, data });
    }
};

const get_loan = (req, res) => {
    const { id } = req.params;
    const data = _.filter(loans, loan => (loan.id === id));
    if (data.length === 0) {
        res.send({ status: 404, error: `Loan with id ${id} not found` });
    }
    else res.send({ status: 200, data });
};

const create_loan = (req, res) => {
    const { email } = req.body;
    const amount = Number(req.body.amount);
    const tenor = Number(req.body.tenor);
    const interest = 0.05 * amount;
    const paymentInstallment = (amount + interest) / tenor;
    const balance = amount - 0;

    res.send({
        status: 201,
        data: {
            loanId: '',
            status: 'pending',
            email,
            amount,
            tenor,
            interest,
            paymentInstallment,
            balance
        }
    });
};

const approve_loan = (req, res) => {
    const { id } = req.params;
    const loan = _.filter(loans, loan => (loan.id === id));
    const [ data, ] = loan;
    data.status = 'approved';
    res.send({ status: 200, data });
};

const reject_loan = (req, res) => {
    const { id } = req.params;
    const loan = _.filter(loans, loan => (loan.id === id));
    const [ data, ] = loan;
    data.status = 'rejected';
    res.send({ status: 200, data });
    
};

const loan_repayment_history = (req, res) => {
    const { id } = req.params;
    const data = _.filter(repayments, payment => (payment.loanId === id));
    res.send({ status: 200, data });
};

const post_repayment = (req, res) => {
    const { id } = req.params;
    const amount = Number(req.body.amount);

    const repay = {
        id: '',
        createdOn: new Date(),
        loanId: id,
        amount,
    };
    // update loan balance
    const [ loan, ] = _.filter(loans, loan => (loan.id === id));
    loan.balance = loan.balance + amount;

    res.send({ status: 201, data: repay });
};

module.exports = {
    get_loan,
    get_all_loans,
    create_loan,
    approve_loan,
    reject_loan,
    loan_repayment_history,
    post_repayment,
};
