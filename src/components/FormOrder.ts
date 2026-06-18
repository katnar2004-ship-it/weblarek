import { Form } from './Form.ts';
import { TPayment } from '../types';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface IOrderData {
    payment: TPayment | null;
    address: string;
}

export class FormOrder extends Form<IOrderData> {
    protected addressInput: HTMLInputElement;
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        
        this._data = { payment: null, address: '' };
        
        this.addressInput.addEventListener('input', () => {
            this.onInputChange('address', this.addressInput.value);
            this.events.emit('order:address-change', { address: this.addressInput.value });
        });
        
        this.cardButton.addEventListener('click', () => {
            this.setPayment('card');
            this.events.emit('order:payment-change', { payment: 'card' });
            this.events.emit('order:validate');
        });
        
        this.cashButton.addEventListener('click', () => {
            this.setPayment('cash');
            this.events.emit('order:payment-change', { payment: 'cash' });
            this.events.emit('order:validate');
        });
    }

    set payment(value: TPayment | null) {
        this._data.payment = value;
        this.updatePaymentButtons();
        this.disableSubmit(!this.validate());
        this.events.emit('order:payment-change', { payment: value });
    }

    get payment(): TPayment | null {
        return this._data.payment;
    }

    set address(value: string) {
        this._data.address = value;
        if (this.addressInput) {
            this.addressInput.value = value;
        }
        this.events.emit('order:address-change', { address: value });
    }

    get address(): string {
        return this._data.address;
    }

    validate(): boolean {
        return !!(this._data.payment && this._data.address?.trim());
    }

    protected updatePaymentButtons(): void {
        this.cardButton.classList.toggle('button_alt-active', this._data.payment === 'card');
        this.cashButton.classList.toggle('button_alt-active', this._data.payment === 'cash');
    }

    protected setPayment(value: TPayment): void {
        this.payment = value;
    }

    protected onInputChange(field: keyof IOrderData, value: string): void {
        this.setData({ [field]: value } as Partial<IOrderData>);
        this.events.emit('order:address-change', { address: value });
        this.events.emit('order:validate');
    }

    protected setData(data: Partial<IOrderData>): void {
        this._data = { ...this._data, ...data };
        this.disableSubmit(!this.validate());
    }
}