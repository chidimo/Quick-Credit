import Model from '../models/Model';
import { InternalServerError } from '../utils/errorHandlers';
import { dev_logger } from '../utils/loggers';

import
{ 
    add_loan_to_db,
    get_loan_by_id,
    loan_repayment_history,
    check_loan_existence,
    add_repayment_to_db,
    get_repayment_by_id,
    update_loan_status,
    update_loan_balance
} from './helpers/LoansController';

const loans_model = new Model('loans');
const repayments_model = new Model('repayments');

const LoansController = {
    get_all_loans: async (req, res) => {
        const { status, repaid } = req.query;
        dev_logger(`rep ${repaid}, ${typeof repaid}`);
        try {
            let data;
            if (status && repaid) {
                data = await loans_model.select(
                    `id, userid, createdon, status, repaid,
                    amount, tenor, interest, balance, paymentinstallment`,
                    `WHERE status='${status}' AND repaid='${repaid}'`
                );
            }
            else {
                data = await loans_model.select(
                    `id, userid, createdon, status, repaid,
                    amount, tenor, interest, balance, paymentinstallment`,
                );
            }
            return res.status(200).json({ data: data.rows });
        }
        catch (e) { return InternalServerError(req, res, e); }
    },

    get_loan: async (req, res) => {
        const { id } = req.params;
        return get_loan_by_id(loans_model, id, res, 200);
    },

    create_loan: async (req, res) => {
        const { rows } = await add_loan_to_db(loans_model, req, res);
        const [ { id }, ] = rows;
        return get_loan_by_id(loans_model, id, res, 201);
    },

    approve_or_reject_loan: async (req, res) => {
        const { id } = req.params;
        let status;
        if (req.url.includes('approve')) { status = 'approved';}
        if (req.url.includes('reject')) { status = 'rejected';}

        req.status = status;
        try {
            await update_loan_status(loans_model, req, res);
            return get_loan_by_id(loans_model, id, res, 200);
        }
        catch (e) { return InternalServerError(req, res, e); }
    },

    loan_repayment_history: async (req, res) => {
        try {
            const loan = await check_loan_existence(loans_model, req, res);
            if (loan) {
                return await loan_repayment_history(repayments_model, req, res);
            }
        }
        catch (e) { return InternalServerError(req, res, e); }
    },

    post_repayment: async (req, res) => {
        const { rows } = await add_repayment_to_db(repayments_model, req, res);
        const [ { id }, ] = rows;
        await update_loan_balance(loans_model, req, res);
        return await get_repayment_by_id(repayments_model, id, res, 201);
    },

    get_repayment: async (req, res) => {
        const { id } = req.params;
        dev_logger(`id ******** ${id}`)
        return get_repayment_by_id(repayments_model, id, res, 200);
    },

    get_all_repayments: async (req, res) => {
        try {
            const data = await repayments_model.select(
                'id, loanid, adminid, createdon, amount',
            );
            return res.status(200).json({ data: data.rows });
        }
        catch (e) { return InternalServerError(req, res, e); }
    },
};

export default LoansController;
