import { body, validationResult } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

import loans from '../utils/sample.loans';
import repayments from '../utils/sample.repayments';

const LoansController = {

    get_all_loans: (req, res) => {
        const { status, repaid } = req.query;
        const boolean_repaid = (req.query.repaid === 'true');
        
        // if both status and repaid is unspecified
        if ((status !== undefined) && (repaid !== undefined)) {
            const data = loans.filter(loan => (
                loan.status === status && loan.repaid === boolean_repaid
            ));
            res.status(200).json({ data });
        }
        else {
            const data = [];
            loans.map(loan => data.push(loan));
            res.status(200).json({ data });
        }
    },
        
    get_loan: (req, res) => {
        const { id } = req.params;
        const data = loans.filter(loan => (loan.id === id));
        if (data.length === 0) {
            res.status(404).json({ error: `Loan with id ${id} not found` });
        }
        else res.status(200).json({ data });
    },

    create_loan: [
        body('tenor')
            .isInt({ min: 1 })
            .withMessage('Tenor cannot be less than 1')
            .isInt({ max: 12 })
            .withMessage('Tenor cannot be greater than 12'),
        body('amount')
            .isFloat({ min: 50000 })
            .withMessage('Amount cannot be less than 50,000')
            .isFloat({ max: 1000000 })
            .withMessage('Amount cannot be greater than 1,000,000'),
            
        sanitizeBody('tenor').toInt(),
        sanitizeBody('amount').toFloat(),
            
        (req, res) => {
                
            // don't validate email since we'll read it from logged in user
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const { email, amount, tenor } = req.body;
            const interest = 0.05 * amount;
            const paymentInstallment = (amount + interest) / tenor;
            const balance = amount - 0;

            res.status(201).json({
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
        }
    ],
        
    approve_loan: (req, res) => {
        const { id } = req.params;
        const loan = loans.find(loan => (loan.id === id));
        loan.status = 'approved';
        res.status(200).json({ data: loan });
    },
    
    reject_loan: (req, res) => {
        const { id } = req.params;
        const loan = loans.find(loan => (loan.id === id));
        loan.status = 'rejected';
        res.status(200).json({ data: loan });
    },
    
    loan_repayment_history: (req, res) => {
        const { id } = req.params;
        const data = repayments.filter(payment => (payment.loanId === id));
        res.status(200).json({ data });
    },

    post_repayment: [
        body('amount')
            .isInt()
            .withMessage('Repayment amount must be a number'),
        
        sanitizeBody('amount').toFloat(),
        (req, res) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const { amount } = req.body;
            const repay = {
                id: '',
                createdOn: new Date(),
                loanId: id,
                amount,
            };
            // update loan balance
            const loan = loans.find(loan => (loan.id === id));
            loan.balance = loan.balance + amount;
            res.status(201).json({ data: repay });
        }
    ],
};

export default LoansController;
