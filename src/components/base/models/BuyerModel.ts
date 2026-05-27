import { IBuyer, TPayment, TBuyerValidationErrors } from "../../../types";

export class BuyerModel {
  private payment: TPayment | null = null;
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  setBuyerField(field: Partial<IBuyer>): void {
    if (field.payment !== undefined) this.payment = field.payment;
    if (field.address !== undefined) this.address = field.address;
    if (field.phone !== undefined) this.phone = field.phone;
    if (field.email !== undefined) this.email = field.email;
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clear(): void {
    this.payment = null;
    this.address = '';
    this.phone = '';
    this.email = '';
  }

  validate(): TBuyerValidationErrors {
    const errors: TBuyerValidationErrors = {};

    if (!this.payment) {
      errors.payment = 'Не выбран тип оплаты';
    }

    if (!this.email || this.email.trim() === '') {
      errors.email = 'Укажите email';
    }

    if (!this.phone || this.phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    if (!this.address || this.address.trim() === '') {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }
}

