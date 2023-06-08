import { ValidationChain } from 'express-validator';

import { validateRequest } from '../middlewares/validate-request';

export class Validation extends Array {
    constructor(validationChains: ValidationChain[]) {
        super();

        this.push(...validationChains);
        this.push(validateRequest);
    }
}
