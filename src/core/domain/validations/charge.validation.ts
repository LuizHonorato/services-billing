import ValidationInterface from '@/core/shared/domain/validations/validation.interface';
import { checkEmailIsValid } from '../../shared/utils';
import ChargeInputData from '@/core/application/dtos/charge-input-data.dto';

type ChargeValidationResponse = {
  errors: string[];
};

export default class ChargeValidation implements ValidationInterface {
  errors: string[] = [];

  validate(input: ChargeInputData): ChargeValidationResponse {
    if (!input.name || input.name.length < 2) {
      this.errors.push('Name is required');
    }

    if (!input.governmentId) {
      this.errors.push('Government id is required');
    }

    if (!input.email) {
      this.errors.push('Email is required');
    }

    if (!checkEmailIsValid(input.email)) {
      this.errors.push('Invalid email');
    }

    if (!input.debtAmount || Number(input.debtAmount) <= 0) {
      this.errors.push('Debt amount is required');
    }

    if (!input.debtDueDate) {
      this.errors.push('Debt due date is required');
    }

    if (!input.debtId) {
      this.errors.push('Debt id is required');
    }

    return { errors: this.errors };
  }
}
