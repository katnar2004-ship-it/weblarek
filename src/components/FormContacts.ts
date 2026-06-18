import { Form } from './Form';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface IContactsData {
    email: string;
    phone: string;
}

export class FormContacts extends Form<IContactsData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        
        this._data = { email: '', phone: '' };
        
        this.emailInput.addEventListener('input', () => {
            this.onInputChange('email', this.emailInput.value);
            this.events.emit('contacts:email-change', { email: this.emailInput.value });
        });
        
        this.phoneInput.addEventListener('input', () => {
            this.onInputChange('phone', this.phoneInput.value);
            this.events.emit('contacts:phone-change', { phone: this.phoneInput.value });
        });
    }

    set email(value: string) {
        this._data.email = value;
        if (this.emailInput) {
            this.emailInput.value = value;
        }
        this.events.emit('contacts:email-change', { email: value });
    }

    get email(): string {
        return this._data.email;
    }

    set phone(value: string) {
        this._data.phone = value;
        if (this.phoneInput) {
            this.phoneInput.value = value;
        }
        this.events.emit('contacts:phone-change', { phone: value });
    }

    get phone(): string {
        return this._data.phone;
    }

    validate(): boolean {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._data.email);
        const phoneValid = this._data.phone.replace(/\D/g, '').length >= 10;
        return emailValid && phoneValid;
    }

    protected onInputChange(field: keyof IContactsData, value: string): void {
        this.setData({ [field]: value } as Partial<IContactsData>);
        if (field === 'email') {
            this.events.emit('contacts:email-change', { email: value });
        } else if (field === 'phone') {
            this.events.emit('contacts:phone-change', { phone: value });
        }
        this.events.emit('contacts:validate');
    }

    protected setData(data: Partial<IContactsData>): void {
        this._data = { ...this._data, ...data };
        this.disableSubmit(!this.validate());
    }
}