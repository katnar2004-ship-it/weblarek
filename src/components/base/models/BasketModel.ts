import { IBuyer, TPayment } from "../../../types";

export class BuyerModel {
  private _payment: TPayment | null = null;
  private _address: string = '';
  private _phone: string = '';
  private _email: string = '';

  setBuyerField(field: Partial<IBuyer>): void {
    if (field.payment !== undefined) this._payment = field.payment;
    if (field.address !== undefined) this._address = field.address;
    if (field.phone !== undefined) this._phone = field.phone;
    if (field.email !== undefined) this._email = field.email;
  }

  getBuyerData(): IBuyer {
    return {
      payment: this._payment as TPayment,
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }

  clear(): void {
    this._payment = null;
    this._address = '';
    this._phone = '';
    this._email = '';
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._payment) {
      errors.payment = 'Не выбран тип оплаты';
    }

    if (!this._email || this._email.trim() === '') {
      errors.email = 'Укажите email';
    }

    if (!this._phone || this._phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    if (!this._address || this._address.trim() === '') {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }
}

