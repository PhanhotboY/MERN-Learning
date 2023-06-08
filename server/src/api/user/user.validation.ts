import { body } from 'express-validator';

import { Validation } from '../interfaces/Validation';

const passwordValidationChain = body('password')
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8 - 20 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage('Password must be alphanumeric');

const emailValidationChain = body('email').trim().isEmail().withMessage('Email must be valid!');

export const passwordValidations = new Validation([passwordValidationChain]);
export const emailValidations = new Validation([emailValidationChain]);

export const signupValidations = new Validation([
    emailValidationChain,
    passwordValidationChain,
    body('phoneNumber')
        .matches(/^0\d{9}$/)
        .withMessage('Phone number must be valid'),
]);

export const signinValidations = new Validation([
    emailValidationChain,
    body('password').trim().notEmpty().withMessage('Password must not be blank'),
]);
