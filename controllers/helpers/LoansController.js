import titlecase from 'titlecase';

import { InternalServerError } from '../../utils/errorHandlers';
import Messenger from '../../utils/Messenger';
// import { dev_logger } from '../../utils/loggers';

export const sendNewApplicationMessage = loan => {
    const template_data = {
        amount: loan.amount,
        interest: loan.interest,
        tenor: loan.tenor,
        paymentinstallment: loan.paymentinstallment
    };
    const data = {
        email: loan.useremail,
        template_name: 'new_loan_application',
    };
    Messenger.sendEmail(data, template_data);
    return;
};

export const sendFollowUpMessage = (status, loan) => {
    let message;
    if (status === 'approved') {
        message = 'Congratulations, your loan application was approved.';
    }
    else {
        message = 'Sorry, your loan application was rejected.';
    }
    const template_data = {
        status: titlecase(status),
        message
    };
    const data = {
        email: loan.useremail,
        template_name: 'loan_status',
    };
    Messenger.sendEmail(data, template_data);
    return;
};

export const check_loan_existence = async (model_instance, id, res) => {
    try {
        const { rows } = await model_instance.select(
            'id, amount', `WHERE id=${id}`);
        const [ loan, ] = rows;
        if (loan) return true;
        return false;
    }
    catch (e) { return InternalServerError(res, e);}
};

export const add_loan_to_db = async (model_instance, req, res) => {
    const { userid, useremail, amount, tenor } = req.body;
    const interest = 0.05 * amount;
    const paymentinstallment = (amount + interest) / tenor;
    const balance = amount - 0;

    try {
        return await model_instance.insert_with_return(
            `(userid, useremail, amount, tenor, interest, 
                balance, paymentinstallment)`,

            `'${userid}', '${useremail}', '${amount}', '${tenor}', 
            '${interest}', '${balance}', '${paymentinstallment}'`);        
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

export const get_loan_by_id = async (model_instance, id, res) => {
    try {
        const { rows } = await model_instance.select(
            `id, userid, useremail, createdon, status, repaid, amount,
            tenor, interest, balance, paymentinstallment`,
            `WHERE id=${id}`
        );
        return rows[0];
    }
    catch (e) {
        return InternalServerError(res, e);
    }
};

// repayments
export const repay_history = async (model_instance, id, res) => {
    try {
        const { rows } = await model_instance.select(
            'id, loanid, adminid, createdon, amount',
            `WHERE loanid=${Number(id)}`
        );
        return rows;
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

export const get_repayment_from_db = async (model_instance, id, res) => {
    try {
        const { rows } = await model_instance.select(
            'id, loanid, adminid, createdon, amount', `WHERE id=${id}`
        );
        return rows[0];
    }
    catch (e) { return InternalServerError(res, e); }
};

export const return_repay_or_error = async (model_instance, id, res, code) => {
    const repay = await get_repayment_from_db(model_instance, id, res);
    if (repay) {
        return res.status(code).json({ data: repay });
    }
    return res.status(404)
        .json({ error: `Repayment with id ${id} not found` });
};
