import { body } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';
import { test_logger } from '../utils/loggers';

import validate_error_or_next from './validate_error_or_next';

const LoansValidators = {
    validateAmount: [
        body('amount')
            .isFloat({ min: 50000 })
            .withMessage('Amount cannot be less than 50,000')
            .isFloat({ max: 1000000 })
            .withMessage('Amount cannot be greater than 1,000,000'),
        sanitizeBody('amount').toFloat(),
        validate_error_or_next
    ],

    validateRepayAmount: [
        body('amount')
            .isFloat()
            .withMessage('Repayment amount must be a number'),
        sanitizeBody('amount').toFloat(),
        validate_error_or_next
    ],

    validateTenor: [
        body('tenor')
            .isInt({ min: 1 })
            .withMessage('Tenor cannot be less than 1')
            .isInt({ max: 12 })
            .withMessage('Tenor cannot be greater than 12'),
        sanitizeBody('tenor').toInt(),
        validate_error_or_next

    ],
};

export default LoansValidators;
