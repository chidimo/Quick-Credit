import { InternalServerError } from '../../utils/errorHandlers';
import { dev_logger } from '../../utils/loggers';

export const check_loan_existence = async (model_instance, req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await model_instance.select(
            'id, amount', `WHERE id=${id}`);
        const [ loan, ] = rows;
        if (loan) return loan;
    }
    catch (e) { return InternalServerError(res, e);}
};

export const add_loan_to_db = async (model_instance, req, res) => {
    const { userid, amount, tenor } = req.body;
    const interest = 0.05 * amount;
    const paymentinstallment = (amount + interest) / tenor;
    const balance = amount - 0;

    try {
        return await model_instance.insert_with_return(
            '(userid, amount, tenor, interest, balance, paymentinstallment)',
            `'${userid}', '${amount}', '${tenor}', '${interest}', '${balance}',
            '${paymentinstallment}'`);        
    }
    catch (e) { return InternalServerError(res, e);}
};

export const update_loan_status = async (model_instance, req, res) => {
    const { id } = req.params;
    try {
        await model_instance.update(
            `status='${req.status}'`, `WHERE id=${id}`);
    }
    catch (e) { return InternalServerError(res, e); }
};

export const update_loan_balance = async (model_instance, req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        await model_instance.incrementation_update(
            'balance', `${amount}`, `WHERE id=${id}`);
    }
    catch (e) { return InternalServerError(res, e); }
};

export const get_loan_by_id = async (model_instance, id, res, code) => {
    try {
        const { rows } = await model_instance.select(
            `id, userid, createdon, status, repaid, amount,
            tenor, interest, balance, paymentinstallment`,
            `WHERE id=${id}`
        );
        if (rows.length === 0) return res.status(404).json({ 
            error: `Loan with id ${id} does not exist`
        });
    
        return res.status(code).json({ data: rows[0] });
    }
    catch (e) {
        return InternalServerError(null, res, e);
    }
};

// repayments
export const loan_repayment_history = async (model_instance, req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await model_instance.select(
            'id, loanid, adminid, createdon, amount',
            `WHERE loanid=${Number(id)}`
        );
        return res.status(200).json({ data: rows });
    }
    catch (e) { return InternalServerError(res, e);}
};

export const add_repayment_to_db = async (model_instance, req, res) => {
    const { id } = req.params;
    const { amount, adminid } = req.body;
    try {
        return await model_instance.insert_with_return(
            '(loanid, adminid, amount)',
            `'${id}', '${adminid}', '${amount}'`);                    
    }
    catch (e) { return InternalServerError(res, e);}
};

export const get_repayment_by_id = async (model_instance, id, res, code) => {
    try {
        const { rows } = await model_instance.select(
            'id, loanid, adminid, createdon, amount', `WHERE id=${id}`
        );
        if (rows.length === 0) {
            return res.status(404).json({
                error: `Repayment with id ${id} not found`
            });
        }
        return res.status(code).json({ data: rows[0] });
    }
    catch (e) {
        return InternalServerError(null, res, e);
    }
};
