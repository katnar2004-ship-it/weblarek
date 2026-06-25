import { IBuyer, TPayment, TBuyerValidationErrors } from "../../types";
import { IEvents } from '../base/Events';

export class BuyerModel {
  private payment: TPayment | null = null;
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  constructor(protected events: IEvents) {}

  setBuyerField(field: Partial<IBuyer>): void {
    let changed = false;

    if (field.payment !== undefined && this.payment !== field.payment) {
      this.payment = field.payment;
      changed = true;
    }
    if (field.address !== undefined && this.address !== field.address) {
      this.address = field.address;
      changed = true;
    }
    if (field.phone !== undefined && this.phone !== field.phone) {
      this.phone = field.phone;
      changed = true;
    }
    if (field.email !== undefined && this.email !== field.email) {
      this.email = field.email;
      changed = true;
    }

    if (changed) {
      this.emitChange();
    }
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
    const wasEmpty = !this.payment && !this.address && !this.phone && !this.email;
    
    this.payment = null;
    this.address = '';
    this.phone = '';
    this.email = '';

    if (!wasEmpty) {
      this.emitChange();
    }
  }

  validate(): TBuyerValidationErrors {
    const errors: TBuyerValidationErrors = {};

    if (!this.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    if (!this.address || this.address.trim() === '') {
      errors.address = 'Необходимо указать адрес';
    }

    if (!this.email || this.email.trim() === '') {
      errors.email = 'Необходимо указать email';
    }

    if (!this.phone || this.phone.trim() === '') {
      errors.phone = 'Необходимо указать телефон';
    }

    return errors;
  }

  validateOrder(): Pick<TBuyerValidationErrors, 'payment' | 'address'> {
    const errors: Pick<TBuyerValidationErrors, 'payment' | 'address'> = {};

    if (!this.payment) {
      errors.payment = "Не выбран тип оплаты";
    }

    if (!this.address || this.address.trim() === '') {
      errors.address = "Необходимо указать адрес";
    }

    return errors;
  }

  validateContacts(): Pick<TBuyerValidationErrors, 'email' | 'phone'> {
    const errors: Pick<TBuyerValidationErrors, 'email' | 'phone'> = {};

    if (!this.email || this.email.trim() === '') {
      errors.email = 'Необходимо указать email';
    }

    if (!this.phone || this.phone.trim() === '') {
      errors.phone = 'Необходимо указать телефон';
    }

    return errors;
  }
  
  private emitChange(): void {
    this.events.emit('buyer:changed');
  }
}

